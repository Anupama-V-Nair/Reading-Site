import express from "express";
import Library from "../models/libraryModels.js";
import Book from "../models/bookModel.js";

const router = express.Router();

// --- Save book to user's library (no duplicates, auto create if missing)
router.post("/add", async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId)
      return res.status(400).json({ error: "Missing userId or bookId" });

    const library = await Library.findOneAndUpdate(
      { userId },
      { $addToSet: { books: bookId } }, // add only if not already saved
      { upsert: true, new: true } // create new doc if missing
    );

    res.status(200).json({ message: "✅ Book saved successfully", library });
  } catch (err) {
    console.error("❌ Save error:", err.message);
    res.status(500).json({ error: "Failed to save book", details: err.message });
  }
});

// --- Get all saved books for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const library = await Library.findOne({ userId }).populate("books");

    if (!library) return res.status(200).json([]);

    res.status(200).json(library.books);
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ error: "Failed to load library", details: err.message });
  }
});

// ✅ Correct remove route
router.delete("/remove", async (req, res) => {
  const { userId, bookId } = req.body;
  console.log("DELETE request received:", req.body);

  try {
    const user = await Library.findOneAndUpdate(
      { userId },
      { $pull: { books: bookId } }, // ✅ just bookId, not { _id: bookId }
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Book removed successfully" });
  } catch (err) {
    console.error("Error in DELETE /remove:", err);
    res.status(500).json({ message: "Error removing book", details: err.message });
  }
});



export default router;


