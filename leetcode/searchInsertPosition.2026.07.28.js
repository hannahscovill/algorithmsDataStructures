// https://leetcode.com/problems/search-insert-position/
// 35. Search Insert Position — Easy
// Topics: Array, Binary Search

'use strict';

/*
Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with `O(log n)` runtime complexity.

**Example 1:**

```
Input: nums = [1,3,5,6], target = 5
Output: 2
```

**Example 2:**

```
Input: nums = [1,3,5,6], target = 2
Output: 1
```

**Example 3:**

```
Input: nums = [1,3,5,6], target = 7
Output: 4
```

**Constraints:**

* `1 <= nums.length <= 10^4`
* `-10^4 <= nums[i] <= 10^4`
* `nums` contains **distinct** values sorted in **ascending** order.
* `-10^4 <= target <= 10^4`
*/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
// https://leetcode.com/problems/search-insert-position/submissions/2084963452/
var searchInsert = function (nums, target) {
    // early rule outs before any looping? like if target is larger than nums.at(-1)
    // i for index, check if target is bigger than nums[i],
    // if nums[i] == target, return i
    // if nums[i] < target && nums[i+1] > target, return i+1
    if (nums.at(-1) < target) return nums.length
    if (nums.at(0) > target) return 0
    for (i = 0; i <= nums.length - 1; i++) {
        if (nums[i] == target) return i
        if (nums[i] < target && nums[i + 1] > target) return i + 1
        // if (nums[i] > target) return i
    }
};
module.exports = { searchInsert };
