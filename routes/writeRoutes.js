import express from "express";
import Post from "../models/writeModels.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userName, title, genre, category, content, status } = req.body;
    const post = await Post.create({ userName, title, genre, category, content, status });
    res.status(201).json({ message: "Post saved successfully", post });
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

router.get("/status/:status", async (req, res) => {
  try {
    const posts = await Post.find({ status: req.params.status });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post updated successfully", post: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

router.get("/published", async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching published posts" });
  }
});

router.get("/user/:userName/published", async (req, res) => {
  try {
    const { userName } = req.params;
    const posts = await Post.find({
      userName: { $regex: new RegExp(`^${userName}$`, "i") }, // case-insensitive
      status: "published",
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user's published posts" });
  }
});

export default router;

