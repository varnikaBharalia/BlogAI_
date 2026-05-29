
import { useState } from "react";

export default function About() {
  const features = [
    {
      icon: "✨",
      title: "AI Generation",
      desc: "Transform ideas into publish-ready posts with OpenAI-powered writing assistance.",
    },
    {
      icon: "⚡",
      title: "Real-time Collaboration",
      desc: "Edit blogs simultaneously with co-authors via live WebSocket rooms.",
    },
    // {
    //   icon: "🔒",
    //   title: "Secure & Private",
    //   desc: "JWT-based authentication and role-based access keep your content safe.",
    // },
    {
      icon: "💬",
      title: "AI Chatbot",
      desc: "Ask the built-in AI chatbot to summarize or discuss any blog post instantly.",
    },
    // {
    //   icon: "📱",
    //   title: "Responsive Design",
    //   desc: "A seamless experience whether you're on desktop, tablet, or mobile.",
    // },
    {
      icon: "🗂️",
      title: "Rich Blog Management",
      desc: "Cover images, comments, author profiles, and admin controls — all built in.",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          width: "100%",
          height: "380px",
          background: "linear-gradient(135deg, #1e293b 0%, #312e81 60%, #4f46e5 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
            top: "-150px",
            right: "-150px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.07)",
            bottom: "-100px",
            left: "-80px",
          }}
        />
        <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 24px" }}>
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#a5b4fc",
              marginBottom: "12px",
            }}
          >
            Our Story
          </p>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
              letterSpacing: "-1px",
              lineHeight: 1.15,
            }}
          >
            About BlogAI
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              marginTop: "14px",
              fontSize: "1rem",
              maxWidth: "480px",
              margin: "14px auto 0",
            }}
          >
            AI-Powered &amp; Collaborative Blogging Platform
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "72px 24px 56px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "20px",
          }}
        >
          Built for creators who think big
        </h2>
        <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.85, marginBottom: "16px" }}>
          BlogAI is a modern, full-stack blogging platform designed for seamless writing, publishing, and collaboration. Built with React on the frontend and Node.js/Express on the backend, it allows users to create and manage blog posts with ease.
        </p>
        <p style={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.85 }}>
          Whether you're a solo writer or working as a team, BlogAI simplifies content creation while offering flexibility, AI-assistance, and real-time performance.
        </p>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: "760px", margin: "0 auto 64px", padding: "0 24px" }}>
        <div style={{ height: "1px", backgroundColor: "#e2e8f0" }} />
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 96px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#4f46e5",
              marginBottom: "10px",
            }}
          >
            Platform Features
          </p>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
            }}
          >
            Everything you need to write, collaborate &amp; publish
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 24px",
        borderRadius: "16px",
        backgroundColor: "#fff",
        border: hovered ? "1.5px solid #c7d2fe" : "1.5px solid #f1f5f9",
        boxShadow: hovered
          ? "0 8px 30px rgba(79,70,229,0.08)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: hovered ? "#eef2ff" : "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
          marginBottom: "16px",
          transition: "background 0.2s",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontFamily: "'Georgia', serif",
          fontSize: "1rem",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: "8px",
          margin: "0 0 8px 0",
        }}
      >
        {title}
      </h3>
      <p style={{ color: "#64748b", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
        {desc}
      </p>
    </div>
  );
}
