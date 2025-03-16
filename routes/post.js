const express = require("express");
const authenticate = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const post = await Post.create({ ...req.body, UserId: req.user.id });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/", async (req, res) => {
  const posts = await Post.findAll({ include: User });
  res.json(posts);
});

module.exports = router;
