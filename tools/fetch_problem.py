#!/usr/bin/env python3
"""Fetch a LeetCode problem and generate a JavaScript stub plus a Vitest file.

Usage:
    uv run tools/fetch_problem.py two-sum
    uv run tools/fetch_problem.py https://leetcode.com/problems/two-sum/
    uv run tools/fetch_problem.py two-sum --name twoSum

Generated files always carry the download date, following the convention already
in leetcode/:  validAnagram.2026.08.09.js  +  validAnagram.2026.08.09.test.js
So re-solving a problem later never clobbers an earlier attempt. Solving the same
problem twice in one day appends the time:  validAnagram.2026.08.09.1425.js
Pass --force to overwrite today's files in place.

Everything comes from one call to LeetCode's public GraphQL API:
  content           problem statement, as HTML
  codeSnippets      per-language stubs (we take javascript)
  exampleTestcases  test inputs, newline-delimited
  metaData          function name, param types, and where the answer lives
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import urllib.request
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path

from markdownify import markdownify

GRAPHQL_URL = "https://leetcode.com/graphql"

QUERY = """
query getQuestion($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionFrontendId
    title
    titleSlug
    difficulty
    content
    isPaidOnly
    exampleTestcases
    metaData
    topicTags { name }
    codeSnippets { langSlug code }
  }
}
"""

# Inputs LeetCode serializes as flat arrays but solutions receive as nodes.
LINKED_TYPES = {"TreeNode", "ListNode"}

ANY_ORDER = re.compile(r"in any order|any order|order does not matter", re.I)


@dataclass
class Problem:
    qid: str
    title: str
    slug: str
    difficulty: str
    topics: list[str]
    statement: str
    js_stub: str
    fn_name: str
    param_names: list[str]
    param_types: list[str]
    return_type: str
    output: dict | None
    cases: list[dict] = field(default_factory=list)
    # Why we could not build runnable assertions, if we could not.
    blocked: str | None = None


def fetch(slug: str) -> dict:
    body = json.dumps({"query": QUERY, "variables": {"titleSlug": slug}}).encode()
    request = urllib.request.Request(
        GRAPHQL_URL,
        data=body,
        headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"},
    )
    payload = json.loads(urllib.request.urlopen(request, timeout=30).read())
    if payload.get("errors"):
        raise SystemExit(f"GraphQL error for {slug!r}: {payload['errors']}")
    question = (payload.get("data") or {}).get("question")
    if not question:
        raise SystemExit(f"No problem found for slug {slug!r}.")
    return question


def slug_from(value: str) -> str:
    match = re.search(r"problems/([^/?#]+)", value)
    return match.group(1) if match else value.strip().strip("/")


def camel_case(title: str) -> str:
    words = re.findall(r"[A-Za-z0-9]+", title)
    if not words:
        return "solution"
    return words[0].lower() + "".join(w.capitalize() for w in words[1:])


def to_markdown(content: str) -> str:
    """HTML statement -> markdown.

    The <sup> pre-pass matters: constraints are written 10<sup>4</sup>, and
    every tag-stripping approach silently renders that as "104" instead of
    "10^4". markdownify's sup_symbol option does not help, because the <sup>
    sits inside <code> and code contents are treated as literal text.
    """
    content = re.sub(r"<sup>(.*?)</sup>", r"^\1", content, flags=re.S)
    text = markdownify(content).strip()
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def expected_outputs(content: str) -> list[str]:
    text = html.unescape(re.sub(r"<[^>]+>", "", content))
    return [m.group(1).strip() for m in re.finditer(r"Output:\s*(.+)", text)]


def build_cases(raw_testcases: str, params: int, content: str) -> tuple[list[dict], str | None]:
    """Pair test inputs with expected outputs, or explain why we can't."""
    lines = [ln for ln in raw_testcases.splitlines() if ln.strip() != ""]
    if params == 0:
        return [], "metaData lists no parameters."
    if len(lines) % params != 0:
        return [], (
            f"exampleTestcases has {len(lines)} lines but the function takes "
            f"{params} params, so inputs can't be chunked reliably."
        )

    chunks = [lines[i:i + params] for i in range(0, len(lines), params)]
    outputs = expected_outputs(content)
    if len(outputs) < len(chunks):
        return [], (
            f"found {len(chunks)} test inputs but only {len(outputs)} "
            f'"Output:" lines in the statement.'
        )

    cases = []
    for chunk, raw_expected in zip(chunks, outputs):
        try:
            args = [json.loads(line) for line in chunk]
        except json.JSONDecodeError:
            return [], f"could not parse test input as JSON: {chunk!r}"
        try:
            expected = json.loads(raw_expected)
        except json.JSONDecodeError:
            return [], (
                f"expected output {raw_expected!r} isn't plain JSON — the "
                f"statement probably qualifies it in prose."
            )
        cases.append({"args": args, "expected": expected})
    return cases, None


def parse(question: dict) -> Problem:
    meta = json.loads(question["metaData"])
    params = meta.get("params", []) or []
    snippets = {c["langSlug"]: c["code"] for c in question["codeSnippets"]}

    js_stub = snippets.get("javascript")
    if js_stub is None:
        raise SystemExit(f"{question['title']} has no JavaScript snippet.")

    return_type = (meta.get("return") or {}).get("type", "")
    cases, blocked = build_cases(
        question["exampleTestcases"], len(params), question["content"]
    )

    # A returned tree or list can't be compared against the statement's
    # flat-array rendering without a serializer, so don't pretend.
    if not blocked and return_type in LINKED_TYPES:
        blocked = f"return type is {return_type}; comparing it needs a serializer."

    return Problem(
        qid=question["questionFrontendId"],
        title=question["title"],
        slug=question["titleSlug"],
        difficulty=question["difficulty"],
        topics=[t["name"] for t in question["topicTags"]],
        statement=to_markdown(question["content"]),
        js_stub=js_stub.strip(),
        fn_name=meta.get("name", camel_case(question["title"])),
        param_names=[p["name"] for p in params],
        param_types=[p["type"] for p in params],
        return_type=return_type,
        output=meta.get("output"),
        cases=cases,
        blocked=blocked,
    )


def render_solution(problem: Problem) -> str:
    # Block comments can't contain */ — escape any that appear in the prose.
    statement = problem.statement.replace("*/", "*\\/")
    return "\n".join([
        f"// https://leetcode.com/problems/{problem.slug}/",
        f"// {problem.qid}. {problem.title} — {problem.difficulty}",
        f"// Topics: {', '.join(problem.topics)}" if problem.topics else "//",
        "",
        # Vitest compiles modules as strict; declaring it here keeps a direct
        # `node file.js` run behaving the same way.
        "'use strict';",
        "",
        "/*",
        statement,
        "*/",
        "",
        problem.js_stub,
        "",
        f"module.exports = {{ {problem.fn_name} }};",
        "",
    ])


def render_test(problem: Problem, solution_file: str, test_file: str) -> str:
    order_hint = ANY_ORDER.search(problem.statement) is not None
    compare = "unorderedDeep" if order_hint and "list<list" in problem.return_type \
        else "unordered" if order_hint else "exact"

    if order_hint:
        reason = "the statement says the answer may be in any order"
    else:
        reason = (
            "no order flag in metaData and the statement doesn't say "
            '"any order"'
        )

    lines = [
        f"// Tests for {problem.qid}. {problem.title}",
        f"// https://leetcode.com/problems/{problem.slug}/",
        f"// Generated by tools/fetch_problem.py — edit freely.",
        "//",
        f"// Run:  npx vitest {test_file}",
        "",
        "import { runCases } from './_harness.js';",
        f"import {{ {problem.fn_name} }} from './{solution_file}';",
        "",
        "runCases({",
        f"    fn: {problem.fn_name},",
        f"    fnName: '{problem.fn_name}',",
        f"    paramTypes: {json.dumps(problem.param_types)},",
        "",
        "    // 'exact' | 'unordered' | 'unorderedDeep'",
        f"    // Chose '{compare}' because {reason}.",
        "    // If a failure says the elements match but the order doesn't,",
        "    // change this one word.",
        f"    compare: '{compare}',",
    ]

    if problem.output:
        lines += [
            "",
            "    // metaData.output: the answer is a mutated argument, not the",
            f"    // return value. Asserting on {problem.param_names[problem.output['paramindex']]!r}"
            + (" (first `return`-many elements)." if problem.output.get("size") == "ret" else "."),
            f"    output: {json.dumps(problem.output)},",
        ]

    lines += ["", "    cases: ["]
    if problem.blocked:
        lines += [
            "        // TODO: no runnable assertions were generated, because",
            f"        // {problem.blocked}",
            "        // Fill these in by hand — the examples are in the",
            "        // statement at the top of the solution file.",
        ]
    else:
        for case in problem.cases:
            args = json.dumps(case["args"])[1:-1]
            lines.append(
                f"        {{ args: [{args}], expected: {json.dumps(case['expected'])} }},"
            )
    lines += ["    ],", "});", ""]
    return "\n".join(lines)


def is_taken(out: Path, stem: str) -> bool:
    return (out / f"{stem}.js").exists() or (out / f"{stem}.test.js").exists()


def resolve_stem(out: Path, base: str, force: bool) -> tuple[str, str | None]:
    """Every generated file is stamped with the date it was downloaded.

    Follows the existing convention in leetcode/: base.YYYY.MM.DD.js
    Re-solving a problem later gets its own dated pair, so an earlier attempt
    is never overwritten — and the date tells you when you pulled it.
    """
    now = datetime.now()
    stem = f"{base}.{now.strftime('%Y.%m.%d')}"
    if force or not is_taken(out, stem):
        return stem, None

    # Same problem again on the same day — add the time. Minutes read better,
    # so only fall through to seconds if a run lands in the same minute.
    for fmt in ("%H%M", "%H%M%S"):
        timed = f"{stem}.{now.strftime(fmt)}"
        if not is_taken(out, timed):
            return timed, f"{stem}.js already exists — writing {timed}.js instead"

    # Same second: fall back to a counter so this can never loop forever.
    attempt = 2
    base_timed = f"{stem}.{now.strftime('%H%M%S')}"
    while is_taken(out, f"{base_timed}.{attempt}"):
        attempt += 1
    timed = f"{base_timed}.{attempt}"
    return timed, f"{stem}.js already exists — writing {timed}.js instead"


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    print(f"  wrote   {path}")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("problem", help="LeetCode slug or full problem URL")
    ap.add_argument("--dir", default="leetcode", help="output directory (default: leetcode)")
    ap.add_argument("--name", help="base filename; defaults to camelCase of the title")
    ap.add_argument(
        "--force",
        action="store_true",
        help="overwrite the undated files instead of writing a dated attempt",
    )
    args = ap.parse_args()

    question = fetch(slug_from(args.problem))
    if question["isPaidOnly"]:
        raise SystemExit(f"{question['title']} is premium-only; no content available.")

    problem = parse(question)
    base = args.name or camel_case(problem.title)
    out = Path(args.dir)

    stem, note = resolve_stem(out, base, args.force)
    solution_file, test_file = f"{stem}.js", f"{stem}.test.js"

    print(f"{problem.qid}. {problem.title} ({problem.difficulty}) -> {solution_file}")
    if note:
        print(f"  {note}")
    write(out / solution_file, render_solution(problem))
    write(out / test_file, render_test(problem, solution_file, test_file))

    if problem.blocked:
        print(f"\n  note: test cases left as a TODO — {problem.blocked}")
    else:
        print(f"\n  {len(problem.cases)} test case(s) generated")
    print(f"\nRun:  npx vitest {out / test_file}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
