import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  coverUrl: {
    type: String
  },
}, {
  timestamps: true

});

const Book = mongoose.model("Book", bookSchema);
export default Book;
