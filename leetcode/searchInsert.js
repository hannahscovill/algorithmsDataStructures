// https://leetcode.com/problems/search-insert-position/submissions/2084963452/

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
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