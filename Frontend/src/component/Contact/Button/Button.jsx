
import { useState } from "react";

const Button = ({ text, icon, is_outline = false, onClick, type = "button" }) => {
  const [hovered, setHovered] = useState(false);

  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "13px 28px",
    borderRadius: "10px",
    fontSize: "0.92rem",
    fontWeight: 700,
    fontFamily: "'Segoe UI', sans-serif",
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: "none",
    outline: "none",
  };

  const solidStyle = {
    ...baseStyle,
    backgroundColor: hovered ? "#4338ca" : "#4f46e5",
    color: "#fff",
    boxShadow: hovered
      ? "0 6px 20px rgba(79,70,229,0.45)"
      : "0 4px 12px rgba(79,70,229,0.3)",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
  };

  const outlineStyle = {
    ...baseStyle,
    backgroundColor: hovered ? "#eef2ff" : "transparent",
    color: hovered ? "#4338ca" : "#4f46e5",
    border: "1.5px solid #4f46e5",
    transform: hovered ? "translateY(-2px)" : "translateY(0)",
    boxShadow: hovered ? "0 4px 12px rgba(79,70,229,0.15)" : "none",
  };

  return (
    <button
      type={type}
      style={is_outline ? outlineStyle : solidStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {text}
      {icon && <span>{icon}</span>}
    </button>
  );
};

export default Button;
