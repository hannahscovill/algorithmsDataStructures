// I'm not satisfied with this answer at all. Still learning patterns to work with trees.

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {string[]}
 */
var binaryTreePaths = function (root) {
    var paths = []
    const dfs = (node, path = '') => {
        path = `${path}${node.val}`
        if (!node.left && !node.right) {
            paths.push(path)
            return
        }
        if (node.left) {
            dfs(node.left, `${path}->`)
        }
        if (node.right) {
            dfs(node.right, `${path}->`)
        }
    }
    dfs(root, '')
    return paths;

};

// refactor:
    // const dfsSuccinct = (node, path = '') => {
    //     if (!node) paths.push(path);
    //     path = `${path}${node.val}`
    //     if (!node.left && !node.right) {
    //         paths.push(path)
    //         return
    //     };
    //     if (node.left) dfsSuccinct(node.left, `${path}->`)
    //     if (node.right) dfsSuccinct(node.right, `${path}->`)
    // }