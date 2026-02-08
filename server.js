import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import connectDB from "./config/db.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import writeRoutes from "./routes/writeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

connectDB();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.log(" MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/library", libraryRoutes);

app.use("/api/write", writeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
