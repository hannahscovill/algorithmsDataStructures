// https://leetcode.com/problems/majority-element/
// 169. Majority Element — Easy
// Topics: Array, Hash Table, Divide and Conquer, Sorting, Counting, Boyer–Moore Majority Vote Algorithm

'use strict';

/*
Given an array `nums` of size `n`, return *the majority element*.

The majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.

**Example 1:**

```
Input: nums = [3,2,3]
Output: 3
```

**Example 2:**

```
Input: nums = [2,2,1,1,1,2,2]
Output: 2
```

**Constraints:**

* `n == nums.length`
* `1 <= n <= 5 * 10^4`
* `-10^9 <= nums[i] <= 10^9`
* The input is generated such that a majority element will exist in the array.

**Follow-up:** Could you solve the problem in linear time and in `O(1)` space?
*/

/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function (nums) {
    var occurances = {}
    nums.forEach(num => {
        if (occurances[num]) {
            occurances[num] = occurances[num] + 1
        } else {
            occurances[num] = 1
        }
    })
    const entryWithMostOccurances = Object.entries(occurances).reduce((previous, current, initial = 0) => {
        return previous[1] > current[1] ? previous : current
    })
    return Number(entryWithMostOccurances[0])
}


const b = [1, 1, 3, 5]
console.log(majorityElement(b))

module.exports = { majorityElement };
