
import React from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import UseUser from "../UserContext/UserContext";
import toast from "react-hot-toast";
import axiosInstance from "../API/axiosInstance";

export default function Header() {
  const { CurrentUser: user, setCurrentUser } = UseUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/user/logOut");

      console.log(res.data);

      setCurrentUser(null);
      toast.success("Logged out successfully!");
      navigate("/signin");
    } catch (err) {
      console.error("Logout Error:", err);

      setCurrentUser(null);
      toast.error("Logout failed");
      navigate("/signin");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        backgroundColor: "rgba(255,255,255,0.75)",
        borderBottom: "1px solid rgba(99,102,241,0.1)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontSize: "1.6rem",
            fontWeight: 800,
            fontFamily: "'Georgia', serif",
            background: "linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.5px",
          }}
        >
          BlogAI
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname === to;

            return (
              <Link
                key={to}
                to={to}
                style={{
                  textDecoration: "none",
                  padding: "6px 16px",
                  fontSize: "0.92rem",
                  fontWeight: isActive ? 600 : 500,
                  fontFamily: "'Segoe UI', sans-serif",
                  color: isActive ? "#4f46e5" : "#475569",
                  borderBottom: isActive
                    ? "2px solid #4f46e5"
                    : "2px solid transparent",
                  transition: "all 0.2s ease",
                  paddingBottom: "4px",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {user && (
            <Link
              to="/addBlog"
              style={{
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: "999px",
                backgroundColor: "#4f46e5",
                color: "#fff",
                fontSize: "0.88rem",
                fontWeight: 600,
                fontFamily: "'Segoe UI', sans-serif",
                display: "inline-block",
              }}
            >
              + Create Blog
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "1.5px solid #e2e8f0",
                padding: "7px 16px",
                borderRadius: "999px",
                color: "#64748b",
                fontSize: "0.88rem",
                fontWeight: 500,
                fontFamily: "'Segoe UI', sans-serif",
                cursor: "pointer",
              }}
            >
              LogOut
            </button>
          ) : (
            <Link
              to="/signin"
              style={{
                textDecoration: "none",
                padding: "7px 18px",
                borderRadius: "999px",
                border: "1.5px solid #4f46e5",
                color: "#4f46e5",
                fontSize: "0.88rem",
                fontWeight: 500,
                fontFamily: "'Segoe UI', sans-serif",
              }}
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}