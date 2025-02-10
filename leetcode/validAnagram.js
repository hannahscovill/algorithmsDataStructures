// Part of Udemy Algorithms & Data Structures Masterclass
// Section 5: Problem Solving Patterns

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    if (s.length != t.length) return false;
    return [...s].sort().join('') == [...t].sort().join('')
};