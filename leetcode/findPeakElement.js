// Eh, not my favorite solution. I don't like while loops really ever anyway.

const indexOfBiggest = (arr) => {
    return arr.reduce(
        (maxIndex, currentValue, index, array) => {
            maxIndex = currentValue > array[maxIndex] ? index : maxIndex
            return maxIndex
        },
        0
    )
}

/**
 * @param {number[]} nums
 * @return {number}
 */
var findPeakElement = function (nums) {
    if (nums.length <= 1) {
        return 0
    } else if (nums.length == 2 || nums.length == 1) {
        return indexOfBiggest(nums)
    }
    var i = 1
    while (i < nums.length - 1) {
        if (nums[i - 1] < nums[i] && nums[i] > nums[i + 1]) {
            return i
        }
        i++
    }
    return indexOfBiggest(nums)
};