import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error

  const navigate = useNavigate();
  const TEST_USER_ID = "672fa3f11cba4a001f0f0001";

  // Fetch user's library books
  useEffect(() => {
    const fetchLibrary = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/library/${TEST_USER_ID}`
        );
        setBooks(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load library");
      } finally {
        setLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  // Remove book from library
  const handleRemove = async (bookId) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/library/remove`,
        { data: { userId: TEST_USER_ID, bookId } }
      );

      if (res.status === 200) {
        setBooks((prev) => prev.filter((b) => b._id !== bookId));
        toast.success("Book removed successfully!");
        setMessageType("success");
      } else {
        toast.error("Failed to remove book");
        setMessageType("error");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error removing book");
      setMessageType("error");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#d1f5d3ed] via-[#d1f5d3ed] to-[#61db67bc] p-10 font-[Poppins] flex flex-col items-center">
      {message && (
        <div
          className={`fixed top-[80px] right-[20px] px-[18px] py-[12px] rounded-[8px] font-medium z-[2000] animate-[fadeInOut_2.5s_ease-in-out] ${
            messageType === "success"
              ? "bg-[#b2f5bb] text-[#0f5132] border border-[#198754]"
              : "bg-[#f8d7da] text-[#842029] border border-[#f5c2c7]"
          }`}
        >
          {message}
        </div>
      )}

      <h1 className="text-4xl font-bold text-[#1b4332] mb-10">📚 My Library</h1>

      {loading && (
        <div className="text-lg text-gray-700 animate-pulse">Loading...</div>
      )}
      {error && (
        <div className="text-lg text-red-600 font-medium">{error}</div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-gray-600 text-lg">No books saved yet.</div>
      )}

      {/* === Book Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-6xl">
        {books.map((b) => (
          <div
            key={b._id}
            className="bg-[#9fe4b8e0] border border-[#9fe4b894] rounded-[20px] p-4 flex flex-col items-center text-center backdrop-blur-[15px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:bg-[#a8f0c2]"
          >
            <img
              src={b.coverUrl}
              alt={b.title}
              className="w-[200px] h-[280px] object-cover rounded-[15px] mb-4 shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
            />
            <div className="flex flex-col items-center gap-1">
              <div className="font-bold text-[#081c15] text-[1rem]">
                {b.title}
              </div>
              <div className="text-[#2d6a4f] text-[0.9rem] mb-2">
                {b.author}
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <button
                className="px-4 py-2 rounded-[10px] font-semibold text-white text-[0.95rem] transition duration-200 bg-gradient-to-br from-[#2d6a4f] to-[#40916c] hover:from-[#1b4332] hover:to-[#2d6a4f]"
                onClick={() =>
                  navigate("/reader", {
                    state: {
                      pdfUrl: b.pdfUrl,
                      title: b.title,
                    },
                  })
                }
              >
                Read
              </button>

              <button
                onClick={() => handleRemove(b._id)}
                className="px-4 py-2 rounded-[10px] font-semibold text-[#1b4332] text-[0.95rem] transition duration-200 bg-[rgba(173,232,208,0.5)] hover:bg-[rgba(173,232,208,0.8)]"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

