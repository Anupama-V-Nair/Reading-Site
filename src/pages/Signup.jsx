import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
} from "../firebase.js";
import { signInWithPopup } from "firebase/auth";

export default function Signup() {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      alert(`Welcome ${result.user.displayName}!`);
    } catch {
      alert("Google sign-in failed!");
    }
  };

  const handleFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      alert(`Welcome ${result.user.displayName}!`);
    } catch {
      alert("Facebook sign-in failed!");
    }
  };

  const handleTwitter = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      alert(`Welcome ${result.user.displayName}!`);
    } catch {
      alert("Twitter sign-in failed!");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(form.email)) {
      setMsg("Please enter a valid Gmail address (example@gmail.com)");
      return;
    }

    const hasNumber = /\d/;
    if (!hasNumber.test(form.password)) {
      setMsg("Password must contain at least one number (0–9)");
      return;
    }

    setMsg("Please wait...");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/signup`,
        form
      );
      setMsg(res.data.message || "Signed up successfully!");
      
      navigate("/explorer");
    } catch (err) {
      setMsg(err.response?.data?.message || "Error connecting to server");
    }
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Left Panel */}
      <div className="w-[38%] bg-[#d1f5d3] flex flex-col items-center justify-center p-8 text-black rounded-r-none">
        <div className="w-[25vh] h-[18vh] flex items-center justify-center">
          <img src="logo.png" alt="logo" className="h-[18vh] w-[18vw]" />
        </div>
        <p className="max-w-[300px] mt-6 text-left leading-relaxed text-gray-900">
          Read books of every genre — fiction, romance, thriller, self-help,
          biographies, and more — all in one platform, absolutely free.
          Your library without limits.
        </p>
      </div>

      {/* Right Panel */}
      <div
        className="w-[62%] relative flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/src/assets/bg-collage.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#d1f5d3ba] to-[#61db679c] backdrop-blur-sm" />

        <div className="relative z-10 w-full max-w-[520px] bg-[rgba(197,245,199,0.55)] rounded-[28px] p-9 flex flex-col items-center backdrop-blur-md shadow-xl">
          <h1 className="font-playfair text-4xl text-[#0b3b14] mb-2">
            Sign Up Your Account
          </h1>
          <p className="text-center text-gray-800 font-medium mb-5">
            Create an account
          </p>

          <input
            name="name"
            className="w-full p-4 my-2 rounded-2xl border border-gray-300 bg-white/60 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Name"
            onChange={handleChange}
          />
          <input
            name="email"
            className="w-full p-4 my-2 rounded-2xl border border-gray-300 bg-white/60 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            name="password"
            className="w-full p-4 my-2 rounded-2xl border border-gray-300 bg-white/60 text-black focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Password"
            type="password"
            onChange={handleChange}
          />

          <button
            className="w-full py-4 mt-2 rounded-full bg-[#4CE05A] text-black text-lg font-medium hover:opacity-90 transition"
            onClick={handleSubmit}
          >
            Sign Up
          </button>

          <div className="text-center mt-4 text-black">or sign up with</div>

          <div className="flex gap-5 justify-center mt-4">
            <button
              onClick={handleGoogle}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md"
            >
              <img src="/src/assets/google.png" width="28" alt="Google" />
            </button>
            <button
              onClick={handleFacebook}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md"
            >
              <img src="/src/assets/facebook.png" width="28" alt="Facebook" />
            </button>
            <button
              onClick={handleTwitter}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md"
            >
              <img src="/src/assets/x.png" width="28" alt="Twitter" />
            </button>
          </div>

          <Link
            to="/signin"
            className="underline text-[#0b3b14] mt-3 hover:text-green-700"
          >
            If already have account? Sign In
          </Link>

          <div className="text-center text-[#0b3b14] mt-3">{msg}</div>
        </div>
      </div>
    </div>
  );
}

