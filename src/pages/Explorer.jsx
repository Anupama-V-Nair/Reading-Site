import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBooks } from "../services/api";
import { useNavigate,  } from "react-router-dom";
import { toast } from "react-toastify";

export default function Explorer({ genre, category }) {
  const [books, setBooks] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" | "error"
  const api = "http://localhost:5000";

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await getBooks();
        setBooks(data || []);
      } catch (err) {
        console.error("Error loading books:", err);
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const fetchAllPublished = async () => {
    try {
      const res = await axios.get(`${api}/api/write/published`);
      setPosts(res.data);
    } catch {
      console.error("Error fetching explorer posts");
    }
  };

  useEffect(() => {
    fetchAllPublished(); // 🟢 added this call
  }, []);


  const grouped = books.reduce((acc, book) => {
    if (!acc[book.genre]) acc[book.genre] = [];
    acc[book.genre].push(book);
    return acc;
  }, {});

  const handleSave = async (bookId) => {


    try {
      console.log("Saving book:", { userId: TEST_USER_ID, bookId });

      const res = await fetch("http://localhost:5000/api/library/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: TEST_USER_ID, bookId }),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        toast.success(" Book saved to your library!");
        setMessageType("success");
        setTimeout(() => navigate("/library"), 1500);
      } else {
        toast.error(` Failed to save book: ${data.message || res.statusText}`);
        setMessageType("error");
      }
    } catch (err) {
      console.error("Error while saving:", err);
      toast.error("⚠️ Something went wrong — check the server console!");
      setMessageType("error");
    } finally {
      setTimeout(() => setMessage(""), 2500);
    }
  };

  const visibleGenres = Object.keys(grouped).filter(
    (g) => !genre || g === genre
  );

  const filterBooks = (bookList) => {
    return category
      ? bookList.filter((b) => b.category === category)
      : bookList;
  };

  return (
    <main className="min-h-screen flex flex-col gap-[30px] p-[20px_40px]  bg-gradient-to-br from-[#d1f5d3ed] via-[#d1f5d3ed] to-[#61db67bc] font-[Poppins]">
      {message && (
        <div
          className={`fixed top-[80px] right-[20px] px-[18px] py-[12px] rounded-[8px] font-medium z-[2000] animate-[fadeInOut_2.5s_ease-in-out] ${messageType === "success"
              ? "bg-[#b2f5bb] text-[#0f5132] border border-[#198754]"
              : "bg-[#f8d7da] text-[#842029] border border-[#f5c2c7]"
            }`}
        >
          {message}
        </div>
      )}

      <div className="flex flex-col gap-[30px]">
        <div className="flex items-center justify-between mb-[10px]">
          <button className="bg-white/25 border border-white/40 text-[#1b4332] font-semibold px-[18px] py-[8px] rounded-full cursor-pointer backdrop-blur-[10px] transition-all duration-200 hover:bg-white/45 hover:scale-[1.05]">
            {genre || "All Genres"}
          </button>
          <div className="text-[1.8rem] font-extrabold text-[#1b4332]">
            {category || "Explore"}
          </div>
        </div>

        {loading && <div className="text-center text-gray-700">Loading books…</div>}
        {error && <div className="text-center text-red-600">{error}</div>}

        {!loading && !error && visibleGenres.length === 0 && (
          <div className="text-center text-gray-500">No genres found.</div>
        )}

        {!loading &&
          visibleGenres.map((g) => {
            const filtered = filterBooks(grouped[g]);
            if (filtered.length === 0) return null;

            return (
              <div key={g} className="mb-[50px] text-[2.5rem] font-sans">
                <h3 className="text-[2rem] font-extrabold text-[#1b4332] mb-[8px] tracking-[0.5px]">
                  {g}
                </h3>
                <div className="flex gap-[30px] overflow-x-auto py-[10px] scrollbar-thin scrollbar-thumb-[#b7e4c7]">
                  {filtered.map((b) => (
                    <div
                      key={b._id}
                      className="flex-none w-[200px] bg-[#9fe4b8e0] border border-[#9fe4b894] rounded-[20px] p-[15px] cursor-pointer transition-all duration-300 backdrop-blur-[15px] shadow-[0_8px_20px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:scale-[1.03] hover:bg-[#a8f0c2]"
                      onClick={() => setSelectedBook(b)}
                    >
                      <img
                        src={b.coverUrl || "/placeholder.png"}
                        alt={b.title}
                        className="w-full h-[280px] object-cover rounded-[15px] mb-[12px] shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
                      />
                      <div className="text-center">
                        <div className="font-bold text-[#081c15] text-[1rem] mb-[5px]">
                          {b.title}
                        </div>
                        <div className="text-[#2d6a4f] text-[0.9rem]">
                          {b.author}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

        <div className="mt-[60px]">
          <h3 className="text-[2rem] font-extrabold text-[#1b4332] mb-[20px]">
            Published Writings
          </h3>
          {posts.length === 0 ? (
            <p className="text-gray-600">No writings published yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white/40 border border-[#9fe4b894] rounded-[20px] p-[20px] backdrop-blur-[10px] shadow-md hover:-translate-y-1 hover:scale-[1.02] transition"
                >
                  <h4 className="font-bold text-[#1b4332]">{p.title}</h4>
                  <p className="text-sm text-gray-700 mb-2">
                    {p.genre} • {p.category} • by {p.userName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {p.content.slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 🟢 END NEW SECTION */}
      </div>


      {selectedBook && (
        <div
          className="fixed inset-0 bg-white/10 backdrop-blur-[25px] flex justify-center items-center z-[3000] animate-[fadeIn_0.4s_ease_forwards]"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="bg-white/25 border border-white/30 backdrop-blur-[25px] rounded-[25px] flex flex-row gap-[40px] p-[40px] max-w-[800px] w-[90%] text-[#081c15] shadow-[0_8px_32px_rgba(0,0,0,0.25)] transform scale-[0.95] animate-[popIn_0.3s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-1 text-center">
              <img
                src={selectedBook.coverUrl}
                alt={selectedBook.title}
                className="w-[220px] rounded-[15px] mb-[20px] shadow-[0_6px_20px_rgba(0,0,0,0.3)] mx-auto"
              />
              <h2 className="text-[1.5rem] font-bold">{selectedBook.title}</h2>
              <p className="text-[1rem]">{selectedBook.author}</p>
            </div>
            <div className="flex flex-col justify-center gap-[15px]">
              <button
                className="px-[20px] py-[12px] rounded-[10px] font-semibold text-white text-[1rem] transition duration-200 bg-gradient-to-br from-[#2d6a4f] to-[#40916c] hover:from-[#1b4332] hover:to-[#2d6a4f]"
                onClick={() =>
                  navigate("/Reader", {
                    state: {
                      pdfUrl: selectedBook.pdfUrl,
                      title: selectedBook.title,
                    },
                  })
                }
              >
                Read
              </button>

              <button
                className="px-[20px] py-[12px] rounded-[10px] font-semibold text-[#1b4332] text-[1rem] transition duration-200 bg-[rgba(173,232,208,0.5)] hover:bg-[rgba(173,232,208,0.8)]"
                onClick={() => handleSave(selectedBook._id)}
              >
                Save to Library
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}





