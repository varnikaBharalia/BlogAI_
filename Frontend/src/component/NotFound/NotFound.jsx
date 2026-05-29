import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* 404 Text */}
      <h1
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(7rem, 20vw, 12rem)",
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: "0",
          background: "linear-gradient(135deg, #c7d2fe 0%, #4f46e5 50%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-4px",
          position: "relative",
          zIndex: 1,
        }}
      >
        404
      </h1>

      {/* Emoji */}
      <div style={{ fontSize: "3.5rem", marginBottom: "20px", marginTop: "8px" }}>🌌</div>

      {/* Message */}
      <h2
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(1.2rem, 3vw, 1.7rem)",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: "12px",
          maxWidth: "500px",
        }}
      >
        Oops! It looks like this blog vanished into the ether.
      </h2>
      <p
        style={{
          color: "#94a3b8",
          fontSize: "1rem",
          maxWidth: "380px",
          lineHeight: 1.7,
          marginBottom: "40px",
        }}
      >
        The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          padding: "14px 36px",
          borderRadius: "999px",
          backgroundColor: hovered ? "#4338ca" : "#4f46e5",
          color: "#fff",
          border: "none",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Segoe UI', sans-serif",
          boxShadow: hovered
            ? "0 8px 24px rgba(79,70,229,0.45)"
            : "0 4px 12px rgba(79,70,229,0.3)",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🏠 Take Me Home
      </button>
    </div>
  );
}
