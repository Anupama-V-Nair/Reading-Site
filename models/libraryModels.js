import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
  {
    userId: {
      type: String, // not ObjectId since you’re using a simple test user ID
      required: true,
      unique: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // must match your Book model name exactly
      },
    ],
  },
  { timestamps: true }
);

const Library = mongoose.model("Library", librarySchema);
export default Library;


