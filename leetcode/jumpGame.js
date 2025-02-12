const howBigToJump = (nums, jumpSizeNeeded) => {
    if (nums.length == 0) {
        return false
    }
    if (nums[nums.length - 1] >= jumpSizeNeeded) {
        return jumpSizeNeeded
    } else {
        return howBigToJump(nums.slice(0, nums.length - 1), ++jumpSizeNeeded)
    }
}

/**
 * @param {number[]} nums
 * @return {boolean}
 */
const jumpBackwards = (nums) => {
    if (nums.length <= 1 && nums[0] != 0) return true
    let i = nums.length - 1
    if (nums[i] < 1) {
        const jumpSize = howBigToJump(nums.slice(0, nums.length - 1), 2)
        if (jumpSize) {
            return jumpBackwards(
                nums.slice(
                    0,
                    jumpSize
                )
            )
        } else {
            return false
        }
    } else {
        return jumpBackwards(nums.slice(0, nums.length - 1))
    }
}


const a = [3, 2, 1, 0, 4]
const b = [2, 3, 1, 1, 4]
const c = [3, 2, 1, 0, 0]
const d = []
const e = [0,1]
const f = [0]

console.log(
    jumpBackwards(f)
)

// Feedback:
// try BFS() instead of DFS()
// try going from the end of the array to find the zeros