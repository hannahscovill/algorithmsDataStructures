---
name: update-solutions-table
description: Regenerate the "Solutions completed" table and "Totals by month" table in this repo's readme.md. Use whenever a new leetcode/ solution is added, an existing one starts/stops passing its tests, or the tables just look stale.
---

# Update the solutions table

Two tables in `readme.md`, right under `## Solutions completed`, track every
problem attempted: the table itself (`Problem | Difficulty | Completed |
Solution | Notes`) and a `### Totals by month` rollup beneath it. Both are
sorted **most recent first**. This skill regenerates them from the current
state of `leetcode/`.

Every solution file gets a row — passing, failing, or still incomplete.
Nothing is hidden from the table; the `Notes` column is what tells the
reader a row isn't a clean pass.

## 1. Find candidate solution files

List `leetcode/*.js`, excluding `_harness.js`. Two naming eras exist:

- **Dated** (`name.YYYY.MM.DD.js`, optionally with `.HHMM`) — paired with a
  `name.YYYY.MM.DD.test.js`. This is the current convention.
- **Undated** (`name.js`) — legacy files from before the test harness
  existed. No paired test file.

Multiple attempts at the same problem (e.g. two dated Spiral Matrix files)
each get their own row. Don't add "(2nd attempt)" or similar numbering to
the problem name — duplicate problem names in the table are fine as-is.

## 2. Work out the `Notes` value for each row

- **Dated file with a test that passes in full**: leave `Notes` blank.
- **Dated file with a test that fails** (run `npx vitest run` or `npx
  vitest run <name>` to check): `Notes: FAILING`.
- **`passWithNoTests: true` edge case**: this is a per-file option passed
  into `runCases({...})` (implemented in `leetcode/_harness.js`), not a
  `vitest.config.mjs` setting. Normally an empty `cases: []` array means
  Vitest registers zero tests and errors with "no test suite found" — the
  right default, since an empty test file is usually a mistake. Setting
  `passWithNoTests: true` on a scaffold whose cases were commented out on
  purpose changes that error into a single `test.skip('<fnName>: no cases
  yet')` instead. `npx vitest run` reports this file as skipped, not
  passed and not failed. A skipped file has nothing verified — `Notes:
  INCOMPLETE`, not `FAILING` (it isn't asserting anything, so it can't be
  failing).
- **Undated legacy file (no test file)**: read it. A working, complete
  function body gets a blank `Notes`, even if the author left a
  self-critical comment ("not satisfied with this") — that's not the same
  as unfinished. Mark `Notes: INCOMPLETE` when it's clearly unfinished:
  hardcoded scratch variables with no real return path, a trailing
  "Feedback: try X instead" note, a bare script never wrapped in the
  problem's actual function signature, or a commit message like "WIP
  <name>".
- **A row that already carries a note other than `INCOMPLETE` or
  `FAILING`** (e.g. `FAILING?`) reflects the repo owner's own judgment
  call about that solution, not something derived mechanically — leave it
  as-is rather than overwriting it.

## 3. Get the "Completed" timestamp for each row

Run `git log --format='%ad %s' --date=iso -- <file>` and use the **oldest**
(last line, i.e. the commit that first added the file) entry's date/time.
Format as `YYYY.MM.DD HH:MM` (24-hour, no seconds, no timezone). For legacy
files whose only commit is a bulk import, that bulk-import timestamp is the
best available data — don't fabricate a more precise one.

## 4. Get the LeetCode URL, display name, and difficulty

Most solution files have the canonical URL, problem title, and difficulty
in a header comment (e.g. `// https://leetcode.com/problems/plus-one/` and
`// 66. Plus One — Easy`). Prefer that over guessing. If a file has no such
comment, derive the slug/title from the LeetCode problem the file is
clearly solving (check the function name or existing repo comments for a
hint), and look up the difficulty on the problem's LeetCode page rather
than guessing — difficulty is Easy, Medium, or Hard, nothing else.

## 5. Rebuild the table

Table columns: `Problem` (name hyperlinked to the LeetCode URL, no attempt
numbering — see step 1) | `Difficulty` (from step 4) | `Completed` (from
step 3) | `Solution` (filename hyperlinked to the file's repo-relative
path, e.g. `leetcode/plusOne.2026.08.12.js`) | `Notes` (from step 2, blank
for a clean pass). Sort rows by completed timestamp, **descending** (newest
first). There's no explanatory paragraph below the table — every row is
listed, so the `Notes` column carries that information per-row instead.

## 6. Rebuild the totals table

Group all rows (including failing/incomplete ones) by `YYYY.MM`. For each
month, count total rows and break that count down by difficulty. List
months descending (newest first) — matching the table above it:

```markdown
### Totals by month

| Month | Solved | Easy | Medium | Hard |
|---|---|---|---|---|
| 2026.08 | 6 | 3 | 3 | 0 |
| 2026.07 | 1 | 1 | 0 | 0 |
| 2025.02 | 10 | 6 | 4 | 0 |
```

## 7. Sanity check

After editing, confirm for every month row that `Easy + Medium + Hard =
Solved`, and that the sum of every month's `Solved` equals the number of
rows in the solutions table above it.
