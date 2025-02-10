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