// Part of Udemy Algorithms & Data Structures Masterclass
// Section 5: Problem Solving Patterns - Multiple Pointers

// Implement a function `countUniqueValues()`
// that accepts a sorted array and counts the 
// unique values in the array. There can be 
// negative numbers in the array but it will 
// alwas be sorted.

/**
 * Counts the unique values in a given array.
 * I'm thinking this is faster than looping but still O(n)
 * @param {Array[Number]} sortedArray - Sorted array of numbers that
 *   may contain negative numbers
 * @returns {Number} The quantity of unique values
 */
const countUniqueValues = (sortedArray) => {
    // Sending this to a set and getting the length is
    // not what we're trying to practice but is so easyyyy
    // const s = new Set(sortedArray)
    // return Array.from(s).length

    // Set up two pointers for index access to sortedArray
    // Step from each side one at a time. Left gets a turn, then right.
    // This will give us a nice, early return on all those 1's in the 
    // first input
    let leftPointer = 0
    let rightPointer = sortedArray.length - 1
    let uniqueValues = []
    const notInUniqueValues = (v) => !(uniqueValues.includes(v))
    while (leftPointer < rightPointer) {
        const valsDoNotEqual = sortedArray[leftPointer] != sortedArray[rightPointer]
        if (notInUniqueValues(sortedArray[leftPointer]) && valsDoNotEqual) {
            uniqueValues.push(sortedArray[leftPointer])
        }
        if (notInUniqueValues(sortedArray[rightPointer]) && valsDoNotEqual) {
            uniqueValues.push(sortedArray[rightPointer])
        }
        ++leftPointer
        --rightPointer
    }
    return uniqueValues.length
}

/**
 * Counts the unique values in a given array.
 * @param {Array[Number]} sortedArray - Sorted array of numbers that
 *   may contain negative numbers
 * @returns {Number} The quantity of unique values
 */
const countUniqueValuesScout = (sortedArray) => {
    // Trying the "j as scout" method from the video
    // i starts at 0 and j starts at 1. j "scouts" ahead to see if
    // the value if different from the value i is at.
    // If j finds a new value, i replaces the value where it's at <- starting will be tricky
    // when j+1 > sortedArray.length-1, return i's value (the index, not the array value at the index)


}

const inputs = [
    [1, 1, 1, 1, 1, 2], // 2
    [1, 2, 3, 4, 4, 4, 7, 7, 12, 12, 13], // 7
    [], // 0
    [-2, -1, -1, 0, 1] // 4
]

inputs.forEach(input => {
    console.log(countUniqueValues(input))
})

