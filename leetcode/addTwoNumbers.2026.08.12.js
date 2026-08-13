// https://leetcode.com/problems/add-two-numbers/
// 2. Add Two Numbers — Medium
// Topics: Linked List, Math, Recursion

"use strict";

/*
You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

**Example 1:**

![](https://assets.leetcode.com/uploads/2020/10/02/addtwonumber1.jpg)

```
Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.
```

**Example 2:**

```
Input: l1 = [0], l2 = [0]
Output: [0]
```

**Example 3:**

```
Input: l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
Output: [8,9,9,9,0,0,0,1]
```

**Constraints:**

* The number of nodes in each linked list is in the range `[1, 100]`.
* `0 <= Node.val <= 9`
* It is guaranteed that the list represents a number that does not have leading zeros.
*/

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
// hmm well I guess you can't use a for loop and just Math.max(l1.length, l2.length)

//   465
// + 342
// -----
//   807
var addTwoNumbers = function (l1, l2) {
  const listHead = new ListNode(0);
  let result = listHead;
  let carry = 0;

  //  the single = in != is important, never exits with !==
  while (l1 != null || l2 != null || carry !== 0) {
    // console.log("==================");
    const x = l1?.val ?? 0;
    const y = l2?.val ?? 0;
    // console.log(`carry: ${carry}, x: ${x}, y: ${y}`);
    
    const sumTotal = carry + x + y;
    carry = Math.floor(sumTotal / 10);
    
    const sumNode = sumTotal % 10;
    // console.log(`sumNode: ${sumNode}`);
    
    result.next = new ListNode(sumNode);
    result = result.next;
    // console.log(result);
    
    l1 = l1?.next;
    l2 = l2?.next;
    // console.log("==================");
    // console.log(sumTotal, carry, sumNode);
  }
//   console.log(`result: ${JSON.stringify(result)}`)
  return listHead.next;
  //   console.log(l1.val + l2.val);
};

module.exports = { addTwoNumbers };
