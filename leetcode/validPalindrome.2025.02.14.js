// https://leetcode.com/problems/valid-palindrome/
// 125. Valid Palindrome — Easy
// Topics: Two Pointers, String

'use strict';

/*
A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string `s`, return `true` *if it is a **palindrome**, or* `false` *otherwise*.

**Example 1:**

```
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
```

**Example 2:**

```
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.
```

**Example 3:**

```
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.
```

**Constraints:**

* `1 <= s.length <= 2 * 10^5`
* `s` consists only of printable ASCII characters.
*/

/**
 * https://leetcode.com/problems/valid-palindrome/?envType=study-plan-v2&envId=top-interview-150
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    const crufted = s.replaceAll(/[^a-zA-Z0-9]/g, '').toLowerCase()
    const validCharsLen = crufted.length
    if (validCharsLen==1) return true
    const moves = validCharsLen % 2 === 0 ? validCharsLen/2 : (validCharsLen-1)/2
    var i = 0;
    var j = crufted.length-1
    while (i<moves) {
        if (crufted[i]==crufted[j]) {
            i++
            j--
        } else {
            return false
        }
    }
    return true
};

module.exports = { isPalindrome };
