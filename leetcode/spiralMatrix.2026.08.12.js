// https://leetcode.com/problems/spiral-matrix/
// 54. Spiral Matrix — Medium
// Topics: Array, Matrix, Simulation

"use strict";

/*
Given an `m x n` `matrix`, return *all elements of the* `matrix` *in spiral order*.

**Example 1:**

![](https://assets.leetcode.com/uploads/2020/11/13/spiral1.jpg)

```
Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]
Output: [1,2,3,6,9,8,7,4,5]
```

**Example 2:**

![](https://assets.leetcode.com/uploads/2020/11/13/spiral.jpg)

```
Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
Output: [1,2,3,4,8,12,11,10,9,5,6,7]
```

**Constraints:**

* `m == matrix.length`
* `n == matrix[i].length`
* `1 <= m, n <= 10`
* `-100 <= matrix[i][j] <= 100`
*/

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function (matrix) {
  // shrinking the bounds/pointers
  var up = 0;
  var left = 0;
  var right = matrix[0].length - 1;
  var down = matrix.length - 1;
  var spiral = [];

  // would be nice to traverse instead of a while loop..
  // but while the spiral.length < columns * rows
  // in the while loop, for loops to walk each direction

  // {
  //   args: [
  //     [
  //       [1, 2, 3],
  //       [4, 5, 6],
  //       [7, 8, 9],
  //     ],
  //   ],
  //   expected: [1, 2, 3, 6, 9, 8, 7, 4, 5],
  // },

  while (spiral.length < matrix[0].length * matrix.length) {
    // spiral.push(0)
    // from left to right
    for (let x = left; x <= right; x++) {
      spiral.push(matrix[up][x]);
    }
    // from up to down
    for (let x = up + 1; x <= down; x++) {
      spiral.push(matrix[x][right]);
    }

    // from right to left
    if (down != up) { // I got caught here this time, wanting to swap this condition between blocks 3 and 4
      for (let x = right - 1; x >= left; x--) {
        spiral.push(matrix[down][x]);
      }
    }

    // from down to up
    if (right != left) {
      for (let x = down - 1; x >= up + 1; x--) {
        spiral.push(matrix[x][left]);
      }
    }
    up++;
    left++;
    down--;
    right--;
  }
  return spiral;
};

module.exports = { spiralOrder };
