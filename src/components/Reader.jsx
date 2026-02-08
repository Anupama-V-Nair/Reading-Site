// src/pages/Reader.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "../styles/Reader.css";

export default function Reader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pdfUrl, title } = location.state || {};

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!pdfUrl) {
    return <div style={{ padding: "2rem" }}>❌ No PDF selected.</div>;
  }

  return (
    <main className="reader-root">
      <header className="reader-header">
        <button className="btn back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>{title}</h2>
      </header>

      <div className="pdf-viewer">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={pdfUrl} 
          defaultScale={1}
          plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    </main>
  );
}




