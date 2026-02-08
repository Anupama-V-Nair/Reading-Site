import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { auth } from "../firebase";

const user = auth.currentUser;
const userName = user?.displayName || user?.email;  // 🔹 auto get signed-in user




export default function WritingSpace() {
  const [form, setForm] = useState({
    userName: "",
    title: "",
    genre: "",
    category: "",
    content: "",
  });
  const [editId, setEditId] = useState(null);
  const api = "http://localhost:5000";
  const location = useLocation();
  const genreOptions = {
    "Fiction": [
      "Romance",
      "Fantasy",
      "Sci-Fi",
      "Myths/Thrillers",
      "Historical fiction",
      "Horror",
      "Adventure",
      "Drama",
      "Mystery",
    ],
    "Non-Fiction": [
      "Biographies",
      "Memoirs",
      "History",
      "Politics",
      "Science & Tech",
      "Travel",
      "True Stories",
      "Philosophy",
      "Sociology",
    ],
    "Self-Growth": [
      "Motivation",
      "Productivity",
      "Emotional Intelligence",
      "Mindfulness",
      "Finance & Wealth Building",
      "Career & Leadership",
      "Relationships & Communication",
      "Health & Wellness",
      "Spiritual",
    ],
    "Academics": [
      "Textbooks Reference books",
      "Research papers & journals",
      "Scholarly essays",
      "Study guides / lesson PDFs",
      "Course materials",
    ],
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setForm((prev) => ({
        ...prev,
        userName: user.displayName || user.email,
      }));
    }
  }, []);

  useEffect(() => {
    if (location.state?.editPost) {
      const post = location.state.editPost;
      setForm({
        userName: post.userName,
        title: post.title,
        genre: post.genre,
        category: post.category,
        content: post.content,
      });
      setEditId(post._id);
    }
  }, [location.state]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (status) => {

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to save your work");
      return;
    }
      
    try {
      const payload = {
        ...form,
        userName: user.displayName || user.email, // ⬅️ Always use current user
        status,
      };
      if (editId) {
        await axios.put(`${api}/api/write/${editId}`, payload);
        toast.success("Post updated successfully!");
      } else {
        await axios.post(`${api}/api/write`, payload);
        toast.success(
          status === "draft" ? "Saved as Draft!" : "Published successfully!"
        );
      }

      setForm({ userName: "", title: "", genre: "", category: "", content: "" });
      setEditId(null);
    } catch (err) {
      toast.error("Error saving post");
    }
  };

  const handlePublish = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be signed in to publish");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/write", {
        userName: user.displayName || user.email,  // 🔹 user identity saved automatically
        title,
        genre,
        category,
        content,
        status: "published",
      });
      toast.success("Post published successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish");
    }
  };


  return (
    <div className="min-h-screen bg-linear-to-b from-green-200 to-green-50 p-6">
      <div className="flex justify-between items-center bg-[#61db67d2] rounded-xl px-6 py-3">
        <h2 className="text-2xl text-white font-playfair">
          {editId ? "Edit your post..." : "Write your own world..."}
        </h2>
        <div className="flex items-center space-x-3">
          <Link to="/published" className="bg-[#d1f5d3f1] hover:bg-green-500 text-Black px-4 py-1 rounded-full">Published</Link>
          <Link to="/drafts" className="bg-[#d1f5d3f1] hover:bg-green-500 text-Black px-4 py-1 rounded-full">Drafts</Link>
        </div>
      </div>

      <div className="bg-white/70 rounded-lg shadow-md mt-6 p-4">
        <div className="flex space-x-3 mb-3">
          <input name="userName" placeholder="Your Name" value={form.userName} onChange={handleChange} className="border rounded-lg px-3 py-2 flex-1" />
          <select
            name="genre"
            value={form.genre}
            onChange={(e) => {
              setForm({ ...form, genre: e.target.value, category: "" }); // reset category when genre changes
            }}
            className="border rounded-lg px-3 py-2 flex-1"
          >
            <option value="">GENRE</option>
            {Object.keys(genreOptions).map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2 flex-1"
            disabled={!form.genre} // disable if no genre selected
          >
            <option value="">CATEGORY</option>
            {form.genre &&
              genreOptions[form.genre].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          <input name="title" placeholder="TITLE..." value={form.title} onChange={handleChange} className="border rounded-lg px-3 py-2 flex-2" />
        </div>

        <textarea name="content" placeholder="Write your own world..." value={form.content} onChange={handleChange} className="w-full h-64 border rounded-lg p-3 bg-[#9fe4bb47] focus:outline-none focus:ring-2 focus:ring-green-400"></textarea>

        <div className="text-right mt-4 space-x-3">
          <button onClick={() => handleSave("draft")} className="bg-[#d1f5d3f1] hover:bg-green-500 text-Black px-5 py-2 rounded-lg shadow-md">Save</button>
          <button onClick={() => handlePublish("published")} className="bg-[#d1f5d3f1] hover:bg-green-700 text-Black px-5 py-2 rounded-lg shadow-md">{editId ? "Update" : "Publish"}</button>
        </div>
      </div>
    </div>
  );
}
