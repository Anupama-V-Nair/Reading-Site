import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import Book from "../models/bookModel.js";

dotenv.config();

// --- Cloudinary setup ---
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Upload function (Upsert + cover upload) ---
const uploadBook = async (pdfPath, coverPath, metadata) => {
  try {
    if (!fs.existsSync(pdfPath)) {
      console.error(`❌ PDF file not found: ${pdfPath}`);
      return;
    }

    // 1. Upload the PDF
    console.log(`📤 Uploading PDF: ${metadata.title}`);
    const pdfResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "raw",
      folder: "books",
    });

    // 2. Upload the Cover Image
    let coverUrl = "";
    if (coverPath && fs.existsSync(coverPath)) {
      console.log(`📤 Uploading Cover: ${metadata.title}`);
      const coverResult = await cloudinary.uploader.upload(coverPath, {
        resource_type: "image",
        folder: "book_covers",
      });
      coverUrl = coverResult.secure_url;
    } else {
      console.log(`⚠️ Cover image not found for ${metadata.title}. Using placeholder.`);
      coverUrl = "/placeholder.png"; // Frontend placeholder
    }

    // 3. Prepare update data
    const updates = {
      title: metadata.title,
      author: metadata.author,
      genre: metadata.genre,
      category: metadata.category,
      pdfUrl: pdfResult.secure_url,
      coverUrl: coverUrl,
    };

    // 4. Safe upsert (update or create)
    await Book.findOneAndUpdate(
      { title: metadata.title },
      { $set: updates },
      { upsert: true, new: true }
    );

    console.log(`✅ Upserted (Updated or Created): ${metadata.title}`);
  } catch (err) {
    console.error(`❌ Upload failed for ${metadata.title}:`, err.message);
  }
};

// --- Start uploading books ---
const startUpload = async () => {
  
  await uploadBook("C:/Users/Anupama/OneDrive/Desktop/project/reading site/reading_site/reading-site/backend/utils/pdfs/The Alchemist.pdf", 
    "C:/Users/Anupama/OneDrive/Desktop/project/reading site/reading_site/reading-site/backend/utils/cover/The Alchemist cover.jpg", {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Non-fiction",
    category: "Philosophy",
  });
  await uploadBook("C:/Users/Anupama/OneDrive/Desktop/project/reading site/reading_site/reading-site/backend/utils/pdfs/The Almanack of Naval Ravikant Final.pdf", 
    "C:/Users/Anupama/OneDrive/Desktop/project/reading site/reading_site/reading-site/backend/utils/cover/The Almanack Of Naval Ravikant.jpg", {
    title: "The Almanack Of Naval Ravikant",
    author: "Eric Jorgenson",
    genre: "Self-help",
    category: "Health & Wellness",
  });
  await uploadBook("C:/Users/Anupama/OneDrive/Desktop/project/reading site/reading_site/reading-site/backend/utils/pdfs/Dont Believe Everything You Think.pdf", 
    "C:/Users/Anupama/OneDrive/Desktop/project/reading site/reading_site/reading-site/backend/utils/cover/Don't Believe Everything you think.jpg", {
    title: "Don't Believe Everything you think",
    author: "Joseph Nguyen",
    genre: "Self-help",
    category: "Mindfulness",
  });
  

  mongoose.disconnect();
};

startUpload();


  
  



