# Algorithms & Data Structures

Welcome to my study notes & practice area

## Setup

Two toolchains, both lockfile-pinned:

```bash
npm install
```

That's it for running tests. The problem fetcher needs nothing installed —
[uv](https://docs.astral.sh/uv/) reads `pyproject.toml` and `uv.lock`, builds
`.venv/` on first run, and fetches Python if it's missing.

## Downloading a problem

Fetches a problem from LeetCode and writes a JavaScript stub plus a test file:

```bash
uv run tools/fetch_problem.py two-sum
```

A full URL works too, which is what you copy from the browser:

```bash
uv run tools/fetch_problem.py https://leetcode.com/problems/two-sum/
```

Useful flags:

| Flag | Effect |
|---|---|
| `--name threeSum` | override the filename (defaults to camelCase of the title) |
| `--dir somewhere` | write elsewhere (default: `leetcode`) |
| `--force` | overwrite today's files instead of adding a timestamp |

### File naming

Generated files carry the date they were downloaded:

```
leetcode/twoSum.2026.08.11.js
leetcode/twoSum.2026.08.11.test.js
```

Re-solving later gets its own dated pair, so earlier attempts are never
overwritten. Twice in one day appends the time — `twoSum.2026.08.11.1425.js`.

## Running tests

Watch mode — the one to live in while solving:

```bash
npm test
```

Narrow it to the problem you're working on:

```bash
npx vitest twoSum
```

One run, no watch:

```bash
npm run test:run
```

### Reading the output

Vitest labels `console.log` output with the test case it came from, so debug
prints stay next to the failure they belong to:

```
stdout | canIWin.2026.08.11.test.js > example 1: canIWin(10, 11)
11 10

 FAIL  canIWin.2026.08.11.test.js > example 1: canIWin(10, 11)
AssertionError: expected undefined to strictly equal false
- Expected: false
+ Received: undefined
```

By default only the **failing** test's logs are shown. Use `--reporter=verbose`
to see logs from passing tests too.

## How the tests work

A test file imports its solution directly and hands the function to the shared
harness in `leetcode/_harness.js`:

```javascript
import { runCases } from './_harness.js';
import { twoSum } from './twoSum.2026.08.11.js';

runCases({ fn: twoSum, fnName: 'twoSum', paramTypes: ['integer[]', 'integer'],
           compare: 'unordered', cases: [ /* ... */ ] });
```

Solution files therefore end with `module.exports = { twoSum };`. The harness
handles the LeetCode-specific parts that no test runner knows about:

- **In-place problems** — when LeetCode's metadata says the answer is a mutated
  argument rather than the return value, the test asserts on that argument.
  Arguments are cloned per case so mutations can't leak between them.
- **Trees and linked lists** — inputs arrive as flat arrays and are built into
  real nodes before the call.
- **Result ordering** — each test declares `compare: 'exact' | 'unordered' |
  'unorderedDeep'`. LeetCode's metadata has no order flag, so the generator
  guesses from the problem statement and records its reasoning in a comment.
  When an exact comparison fails but a looser one would pass, the failure says
  so:

  ```
  same elements, different order — this passes with compare: 'unordered'
  ```

  Change the one word and rerun.

Some problems can't be checked automatically — a returned tree, or an expected
output the statement qualifies in prose (`2, nums = [1,2,_]`). Those get a
`TODO` in place of cases explaining what blocked it, rather than an assertion
that looks right and isn't.

### Strict mode

Vitest compiles modules as strict, so implicit globals now throw instead of
silently leaking:

```javascript
for (i = 0; i < n; i++)      // ReferenceError: i is not defined
for (let i = 0; i < n; i++)  // fine
```

Generated stubs declare `'use strict'` so a direct `node file.js` run behaves
the same way. Older solutions in this repo predate that and may need a `let`
added before they can be imported by a test.
