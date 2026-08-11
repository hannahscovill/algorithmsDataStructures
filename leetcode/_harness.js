// Shared test harness for LeetCode solutions. Not a test file itself —
// `node --test` only picks up *.test.js, so this is ignored by the runner.
//
// Solution files deliberately have no module.exports, so they stay pasteable
// into LeetCode verbatim. We read the source and evaluate it instead.

const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert');

function loadSolution(file, fnName) {
    const full = path.join(__dirname, file);

    // Register the solution in Node's module graph so `node --test --watch`
    // reruns when it changes. Reading it with fs alone leaves the watcher
    // blind to it: editing a solution would restart the runner and then run
    // zero tests ("Restarted at ..." and nothing else). Top-level output is
    // muted during this pass so side effects can't print twice.
    const realLog = console.log;
    console.log = () => {};
    try {
        require(full);
    } catch {
        // Solutions don't have to be requireable; the fs read below is the
        // one that actually matters.
    } finally {
        console.log = realLog;
    }

    const src = fs.readFileSync(full, 'utf8');
    // Function bodies run in sloppy mode, which tolerates the implicit
    // globals LeetCode-style solutions sometimes leave lying around.
    const fn = new Function(
        `${src}\n;return typeof ${fnName} === "function" ? ${fnName} : undefined;`
    )();
    if (!fn) {
        throw new Error(
            `${file} defines no function named "${fnName}". ` +
            `Rename it, or update fnName in the test file.`
        );
    }
    return fn;
}

// --- input coercion ------------------------------------------------------
// LeetCode serializes trees and linked lists as flat arrays. Solutions expect
// real nodes, so build them from the raw case data.

function buildTree(arr) {
    if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null) return null;
    const root = { val: arr[0], left: null, right: null };
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length) {
            const v = arr[i++];
            if (v !== null) {
                node.left = { val: v, left: null, right: null };
                queue.push(node.left);
            }
        }
        if (i < arr.length) {
            const v = arr[i++];
            if (v !== null) {
                node.right = { val: v, left: null, right: null };
                queue.push(node.right);
            }
        }
    }
    return root;
}

function buildList(arr) {
    if (!Array.isArray(arr)) return null;
    let head = null;
    for (let i = arr.length - 1; i >= 0; i--) head = { val: arr[i], next: head };
    return head;
}

function coerce(value, type) {
    if (type === 'TreeNode') return buildTree(value);
    if (type === 'ListNode') return buildList(value);
    return value;
}

// --- comparators ---------------------------------------------------------
// Sorting by JSON is lexicographic, not numeric — fine here, because both
// sides get the same treatment and we only ever check equality.

const key = (v) => JSON.stringify(v);
const cmp = (a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);

const sortShallow = (v) => (Array.isArray(v) ? [...v].sort(cmp) : v);
const sortDeep = (v) => (Array.isArray(v) ? sortShallow(v.map(sortDeep)) : v);

const COMPARATORS = {
    exact: (actual, expected) => assert.deepStrictEqual(actual, expected),
    unordered: (actual, expected) =>
        assert.deepStrictEqual(sortShallow(actual), sortShallow(expected)),
    unorderedDeep: (actual, expected) =>
        assert.deepStrictEqual(sortDeep(actual), sortDeep(expected)),
};

// When an exact comparison fails, check whether a looser one would have
// passed and say so — that turns a confusing diff into a one-word fix.
function check(actual, expected, compare) {
    const comparator = COMPARATORS[compare];
    if (!comparator) {
        throw new Error(
            `Unknown compare mode "${compare}". ` +
            `Use one of: ${Object.keys(COMPARATORS).join(', ')}`
        );
    }
    try {
        comparator(actual, expected);
    } catch (err) {
        const alt = compare === 'exact' ? looserMatch(actual, expected) : null;
        if (!alt) throw err;

        // Build a new error rather than appending to err.message: the reporter
        // prints err.stack, which captured the message at throw time, so a
        // later edit to .message would never be shown.
        throw new assert.AssertionError({
            message:
                `${err.message}\n\n  hint: same elements, different order — ` +
                `this passes with compare: '${alt}'`,
            actual,
            expected,
            operator: 'deepStrictEqual',
        });
    }
}

// Which looser comparator, if any, would have accepted this result?
function looserMatch(actual, expected) {
    for (const alt of ['unordered', 'unorderedDeep']) {
        try {
            COMPARATORS[alt](actual, expected);
            return alt;
        } catch {
            // this mode doesn't help either
        }
    }
    return null;
}

// --- running -------------------------------------------------------------

function invoke(fn, rawArgs, paramTypes, output) {
    // Clone per case so in-place problems can't leak mutations between cases.
    const args = structuredClone(rawArgs).map((v, i) => coerce(v, paramTypes[i]));
    const returned = fn(...args);
    if (!output) return returned;

    // metaData.output means the answer is a mutated argument, not the return.
    const target = args[output.paramindex];
    return output.size === 'ret' ? target.slice(0, returned) : target;
}

function label(fnName, args, index) {
    let rendered = args.map((a) => JSON.stringify(a)).join(', ');
    if (rendered.length > 60) rendered = `${rendered.slice(0, 57)}...`;
    return `example ${index + 1}: ${fnName}(${rendered})`;
}

function runCases(spec) {
    const {
        file,
        fnName,
        cases,
        compare = 'exact',
        paramTypes = [],
        output = null,
    } = spec;

    const fn = loadSolution(file, fnName);
    cases.forEach((c, i) => {
        test(label(fnName, c.args, i), () => {
            check(invoke(fn, c.args, paramTypes, output), c.expected, compare);
        });
    });
}

module.exports = { runCases, loadSolution, COMPARATORS, buildTree, buildList };
