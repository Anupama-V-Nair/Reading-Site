// src/components/PDFHorizontalViewer.jsx
import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

function PDFHorizontalViewer({ pdfUrl }) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        whiteSpace: "nowrap",
        display: "flex",
        gap: "20px",
        padding: "20px",
        background: "#f0f9f1",
        borderRadius: "16px",
        border: "2px solid #61db67",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <div style={{ width: "100%", minWidth: "900px" }}>
          <Viewer fileUrl={pdfUrl} />
        </div>
      </Worker>
    </div>
  );
}

export default PDFHorizontalViewer;


