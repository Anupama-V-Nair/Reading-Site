import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./src/context/AuthContext";
import SignIn from "./src/pages/Signin";
import SignUp from "./src/pages/Signup";
import Explorer from "./src/pages/Explorer";
import Library from "./src/pages/library";
import WritingSpace from "./src/pages/WritingSpace";
import Drafts from "./src/pages/Drafts";
import Published from "./src/pages/Published";
import Reader from "./src/components/Reader";
import Navbar from "./src/components/Navbar";

// 🔒 Protect private routes
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
}

// 🧩 Layout that decides when to show Navbar
function Layout({ genre, setGenre, category, setCategory }) {
  const location = useLocation();
  const hideNavbarRoutes = ["/signin", "/signup"];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar setGenre={setGenre} setCategory={setCategory} />
      )}

      <div className="min-h-screen bg-green-50">
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Redirect base route to signup by default */}
          <Route path="/" element={<Navigate to="/signup" />} />

          {/* Protected routes */}
          <Route
            path="/explorer"
            element={
              <PrivateRoute>
                <Explorer genre={genre} category={category} />
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <Library />
              </PrivateRoute>
            }
          />
          <Route
            path="/reader"
            element={
              <PrivateRoute>
                <Reader />
              </PrivateRoute>
            }
          />
          <Route
            path="/writing"
            element={
              <PrivateRoute>
                <WritingSpace />
              </PrivateRoute>
            }
          />
          <Route
            path="/drafts"
            element={
              <PrivateRoute>
                <Drafts />
              </PrivateRoute>
            }
          />
          <Route
            path="/published"
            element={
              <PrivateRoute>
                <Published />
              </PrivateRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to="/explorer" />}
          />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

// ✅ Only one App component (final)
export default function App() {
  const [genre, setGenre] = useState("");
  const [category, setCategory] = useState("");

  return (
    <Router>
      <Layout
        genre={genre}
        setGenre={setGenre}
        category={category}
        setCategory={setCategory}
      />
    </Router>
  );
}

