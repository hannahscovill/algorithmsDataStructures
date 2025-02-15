// https://leetcode.com/problems/ransom-note/?envType=study-plan-v2&envId=top-interview-150

/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
const canConstruct = function (ransomNote, magazine) {
    if (ransomNote.length == 0) return true
    if (magazine.length == 0) return false
    if (!magazine.includes(ransomNote[0])) return false
    return canConstruct(
        ransomNote.slice(1),
        magazine.replace(ransomNote[0], '')
    )
}

// Helps to understand if the order has to stay the same or not! I did this first and it failed because:
// ransomNote = "aab", magazine = "baa" should output true

/**
 * Intended to remove the duplicates from MAGAZINE. Do NOT use this on the ransom note
 * @param {string} s
 * @return {string}
 */
const duplicatesFromFrontRemoved = (s, getRidOfThis = false) => {
    if (s) return ''
    const remove = getRidOfThis ? getRidOfThis : s[0] // getting away with this because inputs are always lowercase English letters.
    while (s[0] == remove) {
        console.log(`actually, were stuck here. s: ${s}, remove: ${remove}`)
        duplicatesFromFrontRemoved(s.slice(1), remove)
    }
    return s
}

/**
 * @param {string} ransomNote
 * @param {string} magazine
 * @return {boolean}
 */
const cantConstruct = function (ransomNote, magazine) {
    console.log(`starting: note: ${ransomNote}, magazine: ${magazine}`)
    console.log(`additionalConditionCheckValues - ransomNote[0]: ${ransomNote[0]}, ransomNote[1]: ${ransomNote[1]}`)
    if (ransomNote.length == 0) return true
    if (magazine.length == 0) return false

    if (ransomNote.length == 1) {
        return magazine.includes(ransomNote)
    } else if (ransomNote[0] == magazine[0] && ransomNote[0] != ransomNote[1]) {
        console.log('were stuck here?')
        return canConstruct(ransomNote.slice(1), duplicatesFromFrontRemoved(magazine))
    } else if (ransomNote[0] != magazine[0]) {
        console.log('youre not the problem are you?')
        return canConstruct(ransomNote, magazine.slice(1))
    } else if (ransomNote[0] == magazine[0]) {
        console.log(`i did need this! note: ${ransomNote}, magazine: ${magazine}`)
        return canConstruct(ransomNote.slice(1), magazine.slice(1))
    } else {
        console.log('500 error')
        return false
    }


    // loop to the end of the function
    // i looks at note, j looks at magazine so you can move them independently
    // OR you could recursively call the function, splitting off the first char and never needing an index and just whittling them both down

    // recursion pseudocode:
    // if note[first] == magazine[first] : call with the rest of the strings
    // how to handle note == aab and magazine == aaaab
    // note[first] != note[second] : get rid of duplicates of note[first] at the front of magazine, then recurse
    //
    // if note[first] != magazine[first] : call with all of note and omit that char from magazine
};