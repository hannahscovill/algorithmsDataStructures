/**
 * https://leetcode.com/problems/valid-palindrome/?envType=study-plan-v2&envId=top-interview-150
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    const crufted = s.replaceAll(/[^a-zA-Z0-9]/g, '').toLowerCase()
    const validCharsLen = crufted.length
    if (validCharsLen==1) return true
    const moves = validCharsLen % 2 === 0 ? validCharsLen/2 : (validCharsLen-1)/2
    var i = 0;
    var j = crufted.length-1
    while (i<moves) {
        if (crufted[i]==crufted[j]) {
            i++
            j--
        } else {
            return false
        }
    }
    return true
};