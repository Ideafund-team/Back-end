const express = require("express");
const authenticate = require("../middleware/auth");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Post = require("../models/Post");

const router = express.Router();

// Endpoint untuk membuat komentar
router.post("/:postId", authenticate, async (req, res) => {
  try {
      const { content, parent_id } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(400).json({ error: "User not found" });

      const post = await Post.findByPk(req.params.postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      // Jika parent_id ada, cek apakah komentar tersebut valid
      if (parent_id) {
          const parentComment = await Comment.findByPk(parent_id);
          if (!parentComment) {
              return res.status(404).json({ error: "Parent comment not found" });
          }
      }

      const comment = await Comment.create({
          content,
          user_id: req.user.id,
          post_id: req.params.postId,
          parent_id: parent_id || null,
      });

      res.status(201).json(comment);
  } catch (err) {
      console.error("Error creating comment:", err);
      res.status(400).json({ error: err.message });
  }
});

router.post("/:postId/reply/:parentId?", authenticate, async (req, res) => {
  try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(400).json({ error: "User not found" });

      const post = await Post.findByPk(req.params.postId);
      if (!post) return res.status(404).json({ error: "Post not found" });

      let parentComment = null;

      // Cek apakah ini adalah balasan terhadap komentar lain
      if (req.params.parentId) {
          parentComment = await Comment.findByPk(req.params.parentId);
          if (!parentComment) {
              return res.status(404).json({ error: "Parent comment not found" });
          }
      }

      // Buat komentar (atau balasan)
      const comment = await Comment.create({
          content: req.body.content,
          user_id: req.user.id,
          post_id: req.params.postId,
          parent_id: parentComment ? parentComment.id : null,
      });

      res.status(201).json(comment);
  } catch (err) {
      console.error("Error creating comment:", err);
      res.status(400).json({ error: err.message });
  }
});

// Endpoint untuk mendapatkan komentar dan balasan
router.get("/:postId", async (req, res) => {
  try {
      const comments = await Comment.findAll({
          where: { post_id: req.params.postId },
          include: [
              {
                  model: User,
                  attributes: ["id", "username", "email"],
              },
              {
                  model: Comment,
                  as: "Replies",  // Alias untuk nested comments
              },
          ],
      });

      res.json(comments);
  } catch (err) {
      console.error("Error fetching comments:", err);
      res.status(500).json({ error: err.message });
  }
});


module.exports = router;
