import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuth, signOut } from "firebase/auth";

export default function Navbar({ setGenre, setCategory }) {
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const menuRef = useRef(null);

  const genres = {
    Fiction: [
      "Romance", "Fantasy", "Sci-Fi", "Myths/Thrillers",
      "Historical fiction", "Horror", "Adventure", "Drama", "Mystery"
    ],
    "Non-fiction": [
      "Biographies", "Memoirs", "History", "Politics", "Science",
      "Travel", "True Stories", "Philosophy", "Sociology"
    ],
    "Self-help": [
      "Motivation", "Productivity", "Emotional Intelligence", "Mindfulness",
      "Finance", "Career & Leadership", "Relationships & Communication",
      "Health & Wellness", "Spiritual"
    ],
    Academic: [
      "Textbooks", "Research papers", "Scholarly essays", "Study guides",
      "Course materials", "Computer Science"
    ],
  };

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/explorer" && location.pathname === "/");

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="relative w-screen h-[18vh] flex items-center justify-between px-[30px] bg-[#9fe4b8] shadow-[0_2px_8px_rgba(0,0,0,0.1)] mb-0
                 bg-[url('/navbar-bg.png')] bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-[rgba(159,228,184,0.823)] before:-z-0
                 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[97%] after:h-[35%] after:bg-[linear-gradient(to_right,rgb(209,245,211)_70%,rgba(159,228,184,0.323))] after:pointer-events-none after:-z-0"
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="Logo"
        className="relative h-[18vh] object-contain z-[2] m-0"
      />

      {/* Nav links */}
      <div className="absolute bottom-0 left-[12%] h-[20%] w-[80%] flex items-start justify-start gap-[2rem] z-[2]">
        <ul className="flex justify-start gap-[2rem] list-none px-15">
          <li>
            <Link
              to="/explorer"
              className={`font-semibold text-[17px] px-[12px] py-[2px] mb-[12px] border border-[#9fe4b8] rounded-[6px] bg-[rgb(209,245,211)]
                         backdrop-blur-[5px] transition duration-200 relative z-[5] hover:text-[#036509]
                         ${isActive("/explorer") ? "text-[#036509] font-bold underline" : "text-black"}`}
            >
              Explore
            </Link>
          </li>

          <li>
            <select
              className=" bg-[rgb(209,245,211)] border border-[#9fe4b8] text-black font-medium text-[1rem]
                         px-[12px] py-[2px] mb-[12px] rounded-[6px] backdrop-blur-[5px] transition duration-200 relative z-[5] outline-none hover:bg-[rgba(255,255,255,0.25)]"
              onChange={(e) => {
                const g = e.target.value;
                setSelectedGenre(g);
                setSelectedCategory("");
                setGenre(g);
              }}
              value={selectedGenre}
            >
              <option value="">Genre</option>
              {Object.keys(genres).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </li>

          <li>
            <select
              className="appearance-none bg-[rgb(209,245,211)] border border-[#9fe4b8] text-black font-medium text-[1rem]
                         px-[12px] py-[2px] mb-[12px] rounded-[6px] backdrop-blur-[5px] transition duration-200 relative z-[5] outline-none hover:bg-[rgba(255,255,255,0.25)] disabled:opacity-50"
              onChange={(e) => {
                const c = e.target.value;
                setSelectedCategory(c);
                setCategory(c);
              }}
              value={selectedCategory}
              disabled={!selectedGenre}
            >
              <option value="">Category</option>
              {selectedGenre &&
                genres[selectedGenre].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
          </li>

          <li>
            <Link
              to="/library"
              className={`font-semibold text-[17px] px-[12px] py-[2px] mb-[12px] border border-[#9fe4b8] rounded-[6px] bg-[rgb(209,245,211)]
                         backdrop-blur-[5px] transition duration-200 relative z-[5] hover:text-[#036509]
                         ${isActive("/library") ? "text-[#036509] font-bold underline" : "text-black"}`}
            >
              Your Library
            </Link>
          </li>


          <li>
            <Link
              to="/writing"
              className="font-semibold text-[17px] px-[12px] py-[2px] mb-[12px] border border-[#9fe4b8] rounded-[6px] bg-[rgb(209,245,211)]
                         backdrop-blur-[5px] transition duration-200 relative z-[5] hover:text-[#036509] text-black"
            >
              Write
            </Link>
          </li>

          <li>
            <Link
              to="/drafts"
              className="font-semibold text-[17px] px-[12px] py-[2px] mb-[12px] border border-[#9fe4b8] rounded-[6px] bg-[rgb(209,245,211)]
                         backdrop-blur-[5px] transition duration-200 relative z-[5] hover:text-[#036509] text-black"
            >
              Drafts
            </Link>
          </li>

          <li>
            <Link
              to="/published"
              className="font-semibold text-[17px] px-[12px] py-[2px] mb-[12px] border border-[#9fe4b8] rounded-[6px] bg-[rgb(209,245,211)]
                         backdrop-blur-[5px] transition duration-200 relative z-[5] hover:text-[#036509] text-black"
            >
              Published
            </Link>
          </li>
        </ul>
      </div>

      {/* Profile section */}
      <div className="relative" ref={menuRef}>
        <div
          className="w-[40px] h-[40px] bg-[#4caf50] text-white font-bold rounded-full flex items-center justify-center cursor-pointer
                     transition-colors duration-300 select-none hover:bg-[#43a047]"
          onClick={() => setShowMenu(!showMenu)}
        >
          {user?.email ? user.email.charAt(0).toUpperCase() : "U"}
        </div>

        {showMenu && (
          <div className="absolute top-[50px] right-0 bg-white rounded-[8px] shadow-[0_4px_10px_rgba(0,0,0,0.1)] min-w-[120px] z-[100] text-left">
            <p
              className="px-[15px] py-[10px] cursor-pointer hover:bg-[#f0f0f0] transition duration-200"
              onClick={handleLogout}
            >
              Logout
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}







