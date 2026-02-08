import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../firebase";



export default function Published() {
  const [posts, setPosts] = useState([]);
  const api = "http://localhost:5000";
  const navigate = useNavigate();

  // Replace this with actual logged-in username (from context/auth)
  const user = auth.currentUser;
  const userName = user?.displayName || user?.email;

  // ✅ Fetch only this user's published posts

const fetchPublished = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const userName = user.displayName || user.email;
    const res = await axios.get(`${api}/api/write/user/${userName}/published`);
    setPosts(res.data);
  } catch {
    toast.error("Error loading published posts");
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`${api}/api/write/${id}`);
      toast.success("Post deleted");
      fetchPublished();
    } catch (err) {
      toast.error("Error deleting post");
      console.error(err);
    }
  };

  const handleEdit = (post) => {
    navigate("/writing", { state: { editPost: post } });
  };

  useEffect(() => { fetchPublished(); }, []);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800">Your Published Posts</h2>
        <Link to="/writing" className="bg-green-400 hover:bg-green-500 text-white px-4 py-1 rounded-full">
          Back to Writing
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-600">You haven’t published anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((p) => (
            <div key={p._id} className="bg-green-100 rounded-lg p-4 shadow">
              <h4 className="font-bold text-green-800">{p.title}</h4>
              <p className="text-sm text-gray-700">{p.genre} • {p.category}</p>
              <p className="text-sm text-gray-600 mt-2">{p.content.slice(0, 100)}...</p>

              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


