// https://leetcode.com/problems/valid-anagram/
// 242. Valid Anagram — Easy
// Topics: Hash Table, String, Sorting

'use strict';

/*
Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

**Example 1:**

**Input:** s = "anagram", t = "nagaram"

**Output:** true

**Example 2:**

**Input:** s = "rat", t = "car"

**Output:** false

**Constraints:**

* `1 <= s.length, t.length <= 5 * 10^4`
* `s` and `t` consist of lowercase English letters.

**Follow up:** What if the inputs contain Unicode characters? How would you adapt your solution to such a case?
*/

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    if (s.length != t.length) return false;
    return [...s].sort().join('') == [...t].sort().join('')
};

// // New pattern I thought was interesting that the JS Data Structures & Algorithms Masterclass showed.
// // Not what I would use here though.
// const frequencyCounter = {}
// for (var char of s) {
//     frequencyCounter[char] = ++frequencyCounter[char] || 1
// }

module.exports = { isAnagram };
