# Algorithms & Data Structures

Welcome to my study notes & practice area

## Downloading a problem

Fetches a problem from LeetCode and writes a JavaScript stub plus a test file:

```bash
uv run tools/fetch_problem.py two-sum
```

A full URL works too, which is handy since it's what you copy from the browser:

```bash
uv run tools/fetch_problem.py https://leetcode.com/problems/two-sum/
```

Nothing to install first. [uv](https://docs.astral.sh/uv/) reads `pyproject.toml`
and `uv.lock`, builds `.venv/` on the first run, and fetches Python if it's
missing. `uv.lock` pins exact versions, so a fresh clone gets the same setup.

Useful flags:

| Flag | Effect |
|---|---|
| `--name threeSum` | override the filename (defaults to camelCase of the title) |
| `--dir somewhere` | write elsewhere (default: `leetcode`) |
| `--force` | overwrite today's files instead of adding a timestamp |

### File naming

Generated files carry the date they were downloaded:

```
leetcode/twoSum.2026.08.09.js
leetcode/twoSum.2026.08.09.test.js
```

Re-solving a problem later gets its own dated pair, so earlier attempts are
never overwritten. Twice in one day appends the time —
`twoSum.2026.08.09.1425.js`.

## Running tests

Node's built-in test runner, so there's no `package.json` and nothing to install.

Tests only exist for problems you've downloaded. `fetch_problem.py` prints the
exact command for the files it just wrote — copy that line:

```
242. Valid Anagram (Easy) -> validAnagram.2026.08.09.js
  wrote   leetcode/validAnagram.2026.08.09.js
  wrote   leetcode/validAnagram.2026.08.09.test.js

Run:  node --test --watch leetcode/validAnagram.2026.08.09.test.js
```

Watch mode is the one to live in while solving — it reruns on every save. To
find the test file for something you downloaded earlier:

```bash
ls leetcode/*.test.js
```

Everything at once:

```bash
node --test
```

Note that `node --test leetcode/` does **not** work — a bare directory is read as
a module path. Use a quoted glob instead:

```bash
node --test 'leetcode/*.test.js'
```

## How the tests work

Solution files have no `module.exports`, so they stay pasteable into LeetCode
verbatim. `leetcode/_harness.js` reads the source and evaluates it to get the
function, then handles a few LeetCode-specific details:

- **In-place problems** — when LeetCode's metadata says the answer is a mutated
  argument rather than the return value, the test asserts on that argument.
  Arguments are cloned per case so mutations can't leak between them.
- **Trees and linked lists** — inputs arrive as flat arrays and are built into
  real nodes before the call.
- **Result ordering** — each test declares `compare: 'exact' | 'unordered' |
  'unorderedDeep'`. LeetCode's metadata has no order flag, so the generator
  guesses from the problem statement and writes down its reasoning. When an
  exact comparison fails, the harness reports whether a looser one would have
  passed:

  ```
  hint: same elements, different order — this passes with compare: 'unordered'
  ```

  Change the one word and rerun.

Some problems can't be checked automatically — a returned tree, or an expected
output the statement qualifies in prose (`2, nums = [1,2,_]`). Those get a `TODO`
in place of cases, explaining what blocked it, rather than an assertion that
looks right and isn't.
