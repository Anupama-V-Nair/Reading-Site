import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";


export default function Drafts() {
  const [posts, setPosts] = useState([]);
  const api = "http://localhost:5000";
  const navigate = useNavigate();

  const fetchDrafts = async () => {
    try {
      const res = await axios.get(`${api}/api/write/status/draft`);
      setPosts(res.data);
    } catch {
      toast.error("Error loading drafts");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This draft will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#61DB67",
      cancelButtonColor: "#D1F5D3 ",
      confirmButtonText: "Yes, delete it!",
      background: "#9FE4B8e5", // soft green background
      color: "#000000", 
      customClass: {
      popup: "rounded-2xl shadow-lg border border-[#61DB67]",
      title: "text-soliid black-800 font-bold",
      confirmButton: "px-4 py-2 rounded-md font-semibold text-black",
      cancelButton: "px-4 py-2 rounded-md font-semibold text-black",
    },
    });

  if (confirm.isConfirmed) {
    try {
      await axios.delete(`${api}/api/write/${id}`);
      fetchDrafts();
      toast.success("Draft deleted successfully!");
    } catch {
      toast.error("Error deleting draft");
    }
  } else {
    toast.info("Delete cancelled");
  }
};

const handleEdit = (post) => {
  // navigate with post data
  navigate("/writing", { state: { editPost: post } });
};

useEffect(() => { fetchDrafts(); }, []);

return (
  <div className="min-h-screen bg-green-50 p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-green-800">Your Drafts</h2>
      <Link to="/" className="bg-green-400 hover:bg-green-500 text-white px-4 py-1 rounded-full">Back to Writing</Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((p) => (
        <div key={p._id} className="bg-green-100 rounded-lg p-4 shadow relative">
          <h4 className="font-bold text-green-800">{p.title}</h4>
          <p className="text-sm text-gray-700">{p.genre} • {p.category}</p>
          <p className="text-sm text-gray-600 mt-2">{p.content.slice(0, 100)}...</p>

          <div className="mt-3 flex space-x-2">
            <button onClick={() => handleEdit(p)} className="bg-[#61db67f8] hover:bg-[#61db679f] text-black px-3 py-1 rounded-md text-sm">Edit</button>
            <button onClick={() => handleDelete(p._id)} className="bg-[#61db67f8] hover:bg-[#61db679f] text-black px-3 py-1 rounded-md text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}


