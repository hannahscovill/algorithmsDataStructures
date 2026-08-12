// https://leetcode.com/problems/rotate-array/
// 189. Rotate Array — Medium
// Topics: Array, Math, Two Pointers

'use strict';

/*
Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative.

**Example 1:**

```
Input: nums = [1,2,3,4,5,6,7], k = 3
Output: [5,6,7,1,2,3,4]
Explanation:
rotate 1 steps to the right: [7,1,2,3,4,5,6]
rotate 2 steps to the right: [6,7,1,2,3,4,5]
rotate 3 steps to the right: [5,6,7,1,2,3,4]
```

**Example 2:**

```
Input: nums = [-1,-100,3,99], k = 2
Output: [3,99,-1,-100]
Explanation: 
rotate 1 steps to the right: [99,-1,-100,3]
rotate 2 steps to the right: [3,99,-1,-100]
```

**Constraints:**

* `1 <= nums.length <= 10^5`
* `-2^31 <= nums[i] <= 2^31 - 1`
* `0 <= k <= 10^5`

**Follow up:**

* Try to come up with as many solutions as you can. There are at least **three** different ways to solve this problem.
* Could you do it in-place with `O(1)` extra space?
*/

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function (nums, k) {
    if (nums.length > k) {
        const removedEnd = nums.splice(nums.length - k)
        nums.splice(0, 0, ...removedEnd)
    } else {
        for (i = 0; i < k; i++) {
            nums.unshift(nums.pop())
        }
    }
};

// nums = [ // Does not overwrite `nums`
//     ...nums.slice(k).reverse(),
//     ...nums.slice(0, nums.len - k)
// ]

module.exports = { rotate };
