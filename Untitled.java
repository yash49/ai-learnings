/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
  

    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> ans = new ArrayList<>();

        TreeNode cur = root;
        Stack<TreeNode> s = new Stack<>();

        while (cur != null || s.size() > 0) {
            while (cur != null) {
                s.push(cur);
                cur = cur.left;
            }

            cur = s.pop();

            ans.add(cur.val);

            cur = cur.right;
        }

        return ans;
    }
}