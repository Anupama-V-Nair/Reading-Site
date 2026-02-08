import express from "express";
import Book from "../models/bookModel.js";

const router = express.Router();

// ✅ Fetch books with optional filters
router.get("/", async (req, res) => {
  try {
    const { genre, category } = req.query;

    const filter = {};
    if (genre) filter.genre = genre;
    if (category) filter.category = category;

    const books = await Book.find(filter);
    res.json(books);
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    res.status(500).json({ message: "Server error fetching books" });
  }
});

export default router;

