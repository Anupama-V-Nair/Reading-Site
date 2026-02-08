import mongoose from "mongoose";

const writeSchema = new mongoose.Schema({
  userName: { type: String, required: true }, // who wrote it
  title: { type: String, required: true },
  genre: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft" }
}, { timestamps: true });
const Write = mongoose.model("Post", writeSchema);
export default Write;