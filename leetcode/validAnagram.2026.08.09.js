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
var isAnagram = function (s, t) {
  // are strings equal length
  if (s.length !== t.length) return false;
  console.log('are they uneven?')
  console.log(s.length !== t.length)

  const frequencyFromString = (ogStr) => {
    seen = new Map();
    const chars = ogStr.split("");
    chars.forEach((x) => {
      seen.has(x) ? seen.set(x, seen.get(x) + 1) : seen.set(x, 1);
    });
    return seen;
  };

  // loop and create the map1
  const freqS = frequencyFromString(s);
  console.log(freqS)
  // then map 2
  const freqT = frequencyFromString(t);
  console.log(freqT)
  // loop over map? to check values match in other map
  const hasSameValueAsFreqT = ([k, v]) => freqT.get(k) == v
  console.log([...freqS].every(hasSameValueAsFreqT))
  return [...freqS].every(hasSameValueAsFreqT);
};

module.exports = { isAnagram };
