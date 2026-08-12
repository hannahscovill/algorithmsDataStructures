// https://leetcode.com/problems/valid-parentheses/
// 20. Valid Parentheses — Easy
// Topics: String, Stack, Bracket Sequences

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
  // util for is this an open or close?
  const isOpen = (char) => char === "[" || char === "(" || char === "{";
  const isClosed = (char) => !isOpen(char);
  // util for if they match
  const matches = (open, close) => {
    switch (true) {
      case open === "[" && close === "]":
        return true;
      case open === "(" && close === ")":
        return true;
      case open === "{" && close === "}":
        return true;
      default:
        return false;
    }
  };

  // check if i and i+1 are a pair, if not, check if i or -i are a pair
  // i, j, k - probably just i/i+1, j
  // move while j > i
  var i = 0;
  var j = s.length - 1;
  while (i < j) {
    const first = s[i];
    const second = s[i + 1];
    const last = s[j];
    if (isOpen(first) && isClosed(second) && matches(first, second)) {
      i = i + 2;
    } else if (isOpen(first) && isClosed(last) && matches(first, last)) {
      i++;
      j--;
    } else {
      return false;
    }
  }
  return true;
};
