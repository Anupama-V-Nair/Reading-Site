import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  facebookProvider,
  twitterProvider,
} from "../firebase.js";
import { signInWithPopup } from "firebase/auth";

export default function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      alert(`Welcome ${user.displayName}!`);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (error) {
      alert("Google Sign-in failed!");
    }
  };

  const handleFacebook = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      alert(`Welcome ${user.displayName}!`);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (error) {
      alert("Facebook Sign-in failed!");
    }
  };

  const handleTwitter = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;
      alert(`Welcome ${user.displayName}!`);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (error) {
      alert("Twitter Sign-in failed!");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Signing in...");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
        form
      );
      setMsg(res.data.message || "Login successful!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/explorer");
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Left Panel */}
      <div className="w-[38%] bg-[#d1f5d3] flex flex-col items-center justify-center p-8 text-black rounded-right-none">
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
            Sign In Your Account
          </h1>
          <p className="text-center text-gray-800 font-medium mb-5">
            Welcome back, please login
          </p>

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
            Sign In
          </button>

          <div className="text-center mt-4 text-black">or sign in with</div>

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
            to="/signup"
            className="underline text-[#0b3b14] mt-3 hover:text-green-700"
          >
            If don’t have an account? Sign Up
          </Link>

          <div className="text-center text-[#0b3b14] mt-3">{msg}</div>
        </div>
      </div>
    </div>
  );
}
