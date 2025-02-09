// This one beat 100% of solutions in runtime!

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


var a = [0,1,2,3,4,5]

a = [-1,2]

console.log(
    a
)