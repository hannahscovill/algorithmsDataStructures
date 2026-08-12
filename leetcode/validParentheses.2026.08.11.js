// https://leetcode.com/problems/valid-parentheses/
// 20. Valid Parentheses — Easy
// Topics: String, Stack, Bracket Sequences

"use strict";

/*
Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example 1:**

**Input:** s = "()"

**Output:** true

**Example 2:**

**Input:** s = "()[]{}"

**Output:** true

**Example 3:**

**Input:** s = "(]"

**Output:** false

**Example 4:**

**Input:** s = "([])"

**Output:** true

**Example 5:**

**Input:** s = "([)]"

**Output:** false

**Constraints:**

* `1 <= s.length <= 10^4`
* `s` consists of parentheses only `'()[]{}'`.
*/

/**
 * @param {string} s
 * @return {boolean}
 */
// "[[[]"
// "(([]){})"
var isValid = function (s) {
  // edge case, odd will always be false
  if (s.length % 2 !== 0) return false;
  // utils for isOpen, isClosed, matches
  const open = "[{(";
  const closed = "]})";
  const isOpen = (paren) => open.includes(paren);
  const isClosed = (paren) => closed.includes(paren);
  const matches = (first, second) => {
    const curly = "{}";
    const round = "()";
    const square = "[]";
    switch (true) {
      case curly.includes(first):
        return curly.includes(second);
      case round.includes(first):
        return round.includes(second);
      case square.includes(first):
        return square.includes(second);
      default:
        return false;
    }
  };
  const stack = [];
  for (var i = 0; i < s.length; i++) {
    // check if a paren is open. If it is, add it to the stack
    // if the paren is closed, see if we can remove one from the stack (must match)

    // stack.length > 0 && s.length > 0
    const current = s[i];
    switch (true) {
      case isOpen(current):
        // add to the stack
        stack.push(current);
        break;
      // if it's closed
      case isClosed(current) && matches(stack[stack.length - 1], current):
        stack.pop();
        break;
      default:
        return false;
    }
  }
  // because s.length is always at least 1 we can do this
  return stack.length === 0;
};
module.exports = { isValid };
