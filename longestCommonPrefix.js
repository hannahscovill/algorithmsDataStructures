const strs = ["flower", "flow", "flight"]

const longest = strs.map(str => str.length).sort((a, b) => b - a)[0]
var ans = ''
for (let i = 0; i < longest; i++) {
    const a = new Set(strs.map(x => (x.slice(0, i+1))))
    if (a.size > 1) break
    const [firstItemFromSet] = a
    ans = firstItemFromSet
}
console.log(ans)