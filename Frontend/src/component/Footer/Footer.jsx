export default function Footer() {
  return (
    <footer
  style={{
    borderTop: "1px solid #e2e8f0",
    background: "#fff",
    padding: "18px 24px",
  }}
>
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <span
      style={{
        fontWeight: 700,
        color: "#4f46e5",
        fontSize: "1.1rem",
      }}
    >
      BlogAI
    </span>

    <span
      style={{
        color: "#64748b",
        fontSize: "0.85rem",
      }}
    >
      © 2026 BlogAI
    </span>
  </div>
</footer>
  );
}

const linkStyle = {
  color: "#64748b",
  textDecoration: "none",
  fontSize: "0.85rem",
  fontFamily: "'Segoe UI', sans-serif",
  transition: "color 0.2s ease",
};