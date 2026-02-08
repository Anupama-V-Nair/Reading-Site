import axios from "axios";
import { BASE_URL } from "../utils/constant"; 

const API = axios.create({
  baseURL: BASE_URL,
});

export const getBooks = async ({ genre, category } = {}) => {
  try {
    const params = {};
    if (genre) params.genre = genre;
    if (category) params.category = category;

    const res = await API.get("/books", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching books:", err);
    throw err;
  }
};

export const addToLibrary = async (userId, bookId) => {
  const res = await API.post("/library/add", { userId, bookId });
  return res.data;
};

export const getUserLibrary = async (userId) => {
  const res = await API.get(`/library/${userId}`);
  return res.data;
};
