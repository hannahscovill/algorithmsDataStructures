/**
 * @param {Function} fn
 * @return {Function}
 */
const memoize = (fn) => {
    const memo = {}
    return function (...args) {
        const key = args.join('|')
        const currentEntry = memo[key]
        if (key in memo) {
            return currentEntry
        } else {
            const result = fn(...args)
            memo[key] = result
            return result
        }
    }
}