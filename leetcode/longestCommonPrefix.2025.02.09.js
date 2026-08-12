// https://leetcode.com/problems/longest-common-prefix/
// 14. Longest Common Prefix — Easy
// Topics: Array, String, Trie

"use strict";

/*
Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string `""`.

**Example 1:**

```
Input: strs = ["flower","flow","flight"]
Output: "fl"
```

**Example 2:**

```
Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.
```

**Constraints:**

* `1 <= strs.length <= 200`
* `0 <= strs[i].length <= 200`
* `strs[i]` consists of only lowercase English letters if it is non-empty.
*/

/**
 * @param {string[]} strs
 * @return {string}
 */

const strs = ["flower", "flow", "flight"];

var longestCommonPrefix = function (strs) {
  const longest = strs.map((str) => str.length).sort((a, b) => b - a)[0];
  var ans = "";
  for (let i = 0; i < longest; i++) {
    const a = new Set(strs.map((x) => x.slice(0, i + 1)));
    if (a.size > 1) break;
    const [firstItemFromSet] = a;
    ans = firstItemFromSet;
  }
  console.log(ans);
  return ans;
};

module.exports = { longestCommonPrefix };
