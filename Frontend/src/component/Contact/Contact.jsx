
import { useState } from "react";
import toast from "react-hot-toast";
// import Button from "./Button";
import Button from "./Button/Button";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
        padding: "64px 24px 80px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "start",
        }}
      >
        {/* Left: Info */}
        <div style={{ paddingTop: "8px" }}>
          <p
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#4f46e5",
              marginBottom: "12px",
            }}
          >
            Contact Us
          </p>
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.15,
              marginBottom: "20px",
              letterSpacing: "-1px",
            }}
          >
            Let's Get in Touch
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1rem",
              lineHeight: 1.7,
              marginBottom: "40px",
              maxWidth: "380px",
            }}
          >
            Have a question, feedback, or just want to say hello? We'd love to hear from you. Fill out the form and we'll respond within 24 hours.
          </p>

          {/* Contact Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[

              { icon: "✉️", label: "Email", value: "vbharalia11@gmail.com" },
              { icon: "💼", label: "LinkedIn", value: "linkedin.com/in/varnika-bharalia-84608228b" },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "#eef2ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.2rem",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                {/* <div>
                  <p style={{ margin: 0, fontSize: "0.78rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {label}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.9rem", color: "#334155", fontWeight: 500 }}>
                    {value}
                  </p>
                </div> */}
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {label}
                  </p>

                  <a
                    href={
                      label === "Email"
                        ? `mailto:${value}`
                        : `https://${value}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: "2px",
                      display: "inline-block",
                      fontSize: "0.9rem",
                      color: "#334155",
                      fontWeight: 500,
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#4f46e5";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#334155";
                    }}
                  >
                    {value}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "40px 36px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
            border: "1px solid #f1f5f9",
          }}
        >
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: "28px",
            }}
          >
            Send a Message
          </h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <ContactInput
              label="Your Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ContactInput
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Message
              </label>
              <textarea
                placeholder="Tell us what's on your mind..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "1.5px solid #e2e8f0",
                  outline: "none",
                  fontSize: "0.9rem",
                  fontFamily: "'Segoe UI', sans-serif",
                  color: "#1e293b",
                  backgroundColor: "#f8fafc",
                  resize: "vertical",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                  minHeight: "120px",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4f46e5";
                  e.target.style.backgroundColor = "#fafbff";
                  e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.backgroundColor = "#f8fafc";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <div style={{ paddingTop: "4px" }}>
              <Button text="Send Message" icon="→" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactInput({ label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#475569",
          marginBottom: "8px",
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
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "10px",
          border: "1.5px solid #e2e8f0",
          outline: "none",
          fontSize: "0.9rem",
          fontFamily: "'Segoe UI', sans-serif",
          color: "#1e293b",
          backgroundColor: "#f8fafc",
          boxSizing: "border-box",
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#4f46e5";
          e.target.style.backgroundColor = "#fafbff";
          e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.backgroundColor = "#f8fafc";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
