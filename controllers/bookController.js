import Book from "../models/bookModel.js";

// Add a new book
export const addBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all books
export const getBooks = async (req, res) => {
  try {
    const { genre, category } = req.query;

    // Build filter with case-insensitive match
    const filter = {};
    if (genre)
      filter.genre = { $regex: new RegExp(`^${genre}$`, "i") }; // "i" = ignore case
    if (category)
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };

    const books = await Book.find(filter);
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};


