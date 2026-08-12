// https://leetcode.com/problems/binary-tree-paths/
// 257. Binary Tree Paths — Easy
// Topics: String, Backtracking, Tree, Depth-First Search, Binary Tree

'use strict';

/*
Given the `root` of a binary tree, return *all root-to-leaf paths in **any order***.

A **leaf** is a node with no children.

**Example 1:**

![](https://assets.leetcode.com/uploads/2021/03/12/paths-tree.jpg)

```
Input: root = [1,2,3,null,5]
Output: ["1->2->5","1->3"]
```

**Example 2:**

```
Input: root = [1]
Output: ["1"]
```

**Constraints:**

* The number of nodes in the tree is in the range `[1, 100]`.
* `-100 <= Node.val <= 100`
*/

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
// I'm not satisfied with this answer at all. Still learning patterns to work with trees.
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
module.exports = { binaryTreePaths };
