// Shared test harness for LeetCode solutions.
//
// Test files import their solution directly and hand the function to
// runCases, so Vitest sees the real module: watch mode reruns on solution
// edits, and failures point at the solution's own line.
//
// Everything here is LeetCode-specific behaviour that no test runner
// provides — argument coercion, in-place problems, and result ordering.

import { test, expect } from 'vitest';
import assert from 'node:assert';

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

// --- comparison ----------------------------------------------------------
// Sorting by JSON is lexicographic rather than numeric — fine here, since
// both sides get the same treatment and we only ever check equality.

const key = (v) => JSON.stringify(v);
const order = (a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0);

const sortShallow = (v) => (Array.isArray(v) ? [...v].sort(order) : v);
const sortDeep = (v) => (Array.isArray(v) ? sortShallow(v.map(sortDeep)) : v);

const SHAPES = {
    exact: (v) => v,
    unordered: sortShallow,
    unorderedDeep: sortDeep,
};

function matches(actual, expected, mode) {
    try {
        assert.deepStrictEqual(SHAPES[mode](actual), SHAPES[mode](expected));
        return true;
    } catch {
        return false;
    }
}

// Which looser comparator, if any, would have accepted this result?
function looserMatch(actual, expected) {
    for (const alt of ['unordered', 'unorderedDeep']) {
        if (matches(actual, expected, alt)) return alt;
    }
    return null;
}

function check(actual, expected, compare) {
    const shape = SHAPES[compare];
    if (!shape) {
        throw new Error(
            `Unknown compare mode "${compare}". ` +
            `Use one of: ${Object.keys(SHAPES).join(', ')}`
        );
    }

    // LeetCode exposes no ordering flag, so the generator has to guess. When
    // the guess is wrong, say so in the failure instead of leaving a diff
    // that looks baffling.
    if (compare === 'exact' && !matches(actual, expected, 'exact')) {
        const alt = looserMatch(actual, expected);
        if (alt) {
            expect(
                actual,
                `same elements, different order — this passes with compare: '${alt}'`
            ).toStrictEqual(expected);
            return;
        }
    }

    expect(shape(actual)).toStrictEqual(shape(expected));
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

export function runCases(spec) {
    const {
        fn,
        fnName,
        cases,
        compare = 'exact',
        paramTypes = [],
        output = null,
        // Opt-in, per test file. A file that registers no tests is an error in
        // Vitest ("No test suite found"), which is the right default — an empty
        // test file is usually a mistake. Set this on a scaffold whose cases
        // you've commented out on purpose and the file reports as skipped
        // instead of failing. Off unless asked for.
        passWithNoTests = false,
    } = spec;

    if (passWithNoTests && (cases?.length ?? 0) === 0) {
        // Registering something is what keeps Vitest from erroring; skip marks
        // it as deliberately unfinished rather than quietly passing.
        test.skip(`${fnName}: no cases yet`, () => {});
        return;
    }

    if (typeof fn !== 'function') {
        throw new Error(
            `runCases was given ${typeof fn} instead of a function. ` +
            `Check the import at the top of this test file — the solution ` +
            `must export ${fnName}.`
        );
    }

    cases.forEach((c, i) => {
        test(label(fnName, c.args, i), () => {
            check(invoke(fn, c.args, paramTypes, output), c.expected, compare);
        });
    });
}

export { buildTree, buildList };
