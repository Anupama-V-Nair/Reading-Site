import Library from "../models/libraryModels.js";

export const addToLibrary = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    let userLibrary = await Library.findOne({ userId });

    if (!userLibrary) {
      userLibrary = await Library.create({ userId, books: [bookId] });
    } else if (!userLibrary.books.includes(bookId)) {
      userLibrary.books.push(bookId);
      await userLibrary.save();
    } else {
      return res.status(400).json({ message: "Already in library" });
    }

    res.status(201).json(userLibrary);
  } catch (err) {
    console.error("❌ Add to library error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getUserLibrary = async (req, res) => {
  try {
    const library = await Library.findOne({ userId: req.params.userId }).populate("books");
    if (!library) return res.status(200).json([]);
    res.status(200).json(library.books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromLibrary = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const library = await Library.findOne({ userId });
    if (library) {
      library.books = library.books.filter((b) => b.toString() !== bookId);
      await library.save();
    }
    res.status(200).json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
