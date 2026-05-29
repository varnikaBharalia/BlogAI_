
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../API/axiosInstance";

export default function LoginForm() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/user/signup", { name, email, password });
      toast.success("Signup successful! Please sign in.");
      setIsSignUp(false);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("User already exists with this email");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/user/signin", { email, password });
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 50%, #f3e8ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative circles */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          top: "-100px",
          right: "-100px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          bottom: "-80px",
          left: "-80px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid rgba(255,255,255,0.8)",
          padding: "48px 44px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "2.2rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #1e293b 0%, #4f46e5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            BlogAI
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "0.85rem",
              marginTop: "6px",
            }}
          >
            AI-Powered & Collaborative Blogging
          </p>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#f1f5f9",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "32px",
          }}
        >
          {["Sign In", "Sign Up"].map((tab) => {
            const active = (tab === "Sign In" && !isSignUp) || (tab === "Sign Up" && isSignUp);
            return (
              <button
                key={tab}
                onClick={() => setIsSignUp(tab === "Sign Up")}
                style={{
                  flex: 1,
                  padding: "9px",
                  border: "none",
                  borderRadius: "9px",
                  backgroundColor: active ? "#fff" : "transparent",
                  color: active ? "#4f46e5" : "#94a3b8",
                  fontWeight: active ? 700 : 500,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s ease",
                  fontFamily: "'Segoe UI', sans-serif",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "24px",
          }}
        >
          {isSignUp ? "Create your account" : "Welcome back to BlogAI"}
        </h2>

        {/* Form */}
        <form onSubmit={isSignUp ? handleSignup : handleSignin}>
          {isSignUp && (
            <InputField
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
            />
          )}
          <InputField
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
          />
          <InputField
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              backgroundColor: "#4f46e5",
              color: "#fff",
              border: "none",
              fontSize: "0.95rem",
              fontWeight: 700,
              cursor: "pointer",
              marginTop: "8px",
              fontFamily: "'Segoe UI', sans-serif",
              boxShadow: "0 4px 12px rgba(79,70,229,0.35)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#4338ca";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 6px 20px rgba(79,70,229,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4f46e5";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 12px rgba(79,70,229,0.35)";
            }}
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            color: "#94a3b8",
            fontSize: "0.85rem",
          }}
        >
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#4f46e5",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.85rem",
              fontFamily: "'Segoe UI', sans-serif",
              padding: 0,
            }}
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

function InputField({ type, placeholder, value, onChange, label }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: "16px" }}>
      <label
        style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#475569",
          marginBottom: "6px",
          letterSpacing: "0.3px",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: focused ? "1.5px solid #4f46e5" : "1.5px solid #e2e8f0",
          outline: "none",
          fontSize: "0.9rem",
          fontFamily: "'Segoe UI', sans-serif",
          color: "#1e293b",
          backgroundColor: focused ? "#fafbff" : "#f8fafc",
          boxSizing: "border-box",
          transition: "all 0.2s ease",
          boxShadow: focused ? "0 0 0 3px rgba(79,70,229,0.1)" : "none",
        }}
      />
    </div>
  );
}
