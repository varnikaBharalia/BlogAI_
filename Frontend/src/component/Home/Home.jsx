import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UseUser from "../UserContext/UserContext";
import toast from "react-hot-toast";
import axiosInstance from "../API/axiosInstance";
// import CircularIndeterminate from "./CircularIndeterminate";
import CircularIndeterminate from "../AddBlog/CircularIndeterminate";
import Swal from "sweetalert2";

export default function Home() {
  const { CurrentUser: user, setCurrentUser } = UseUser();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHome() {
      try {
        const res = await axiosInstance.get("/home");
        setBlogs(res.data.blogs || []);
        setCurrentUser(res.data.user);
      } catch (err) {
        toast.error("Failed to load blogs.");
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    }
    fetchHome();
  }, []);

  const handleDelete = async (blogId, e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Delete Blog?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;
    try {
      await axiosInstance.delete(`/blog/delete/${blogId}`);
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
      toast.success("Blog deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete blog.");
    }
  };

  if (loading) return <CircularIndeterminate />;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          // padding: "56px 24px 32px",
          padding: "36px 24px 24px",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#4f46e5",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            marginBottom: "8px",
          }}
        >
          Welcome back
        </p>
        <h1
          style={{
            // fontSize: "clamp(2rem, 5vw, 3rem)",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 650,
            color: "#0f172a",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.15,
            marginBottom: "12px",
            letterSpacing: "-1px",
          }}
        >
          {/* {user?.name ? `Hello, ${user.name} ` : "Discover Stories"} */}
          {user?.name
            ? `Hello, ${user.name.split(" ")[0]} 👋`
            : "Discover Stories"}
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", maxWidth: "480px" }}>
          Explore ideas, share knowledge, and write what matters.
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 32px",
        }}
      >
        <div
          style={{ height: "1px", backgroundColor: "#e2e8f0", width: "100%" }}
        />
      </div>

      {/* Blog Grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 80px",
          display: "grid",
          // gridTemplateColumns: "repeat(auto-fill, minmax(280px, 300px))",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "24px",
          width:"100%",
          // justifyContent: "start",
        }}
      >
        {blogs.length === 0 ? (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "80px 0",
              color: "#94a3b8",
              fontSize: "1.1rem",
            }}
          >
            No blogs yet. Be the first to create one! ✨
          </div>
        ) : (
          blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              user={user}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

function BlogCard({ blog, user, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const isAdmin = user?.role === "admin";
  const baseURL = axiosInstance.defaults.baseURL;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        maxWidth: "340px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 12px 40px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s ease",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Cover Image */}
      <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
        <img
          src={blog.coverImage || `${baseURL}/default-cover.jpg`}
          alt={blog.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.4s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        />
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px 16px 12px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: "#1e293b",
            fontFamily: "'Georgia', serif",
            lineHeight: 1.35,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {blog.title}
        </h3>

        <p
          style={{
            fontSize: "0.82rem",
            color: "#94a3b8",
            margin: 0,
          }}
        >
          By {blog.createdBy?.name || "Unknown"}
        </p>
      </div>

      {/* Footer Actions */}
      <div
        style={{
          padding: "10px 16px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #f1f5f9",
        }}
      >
        <Link
          to={`/blog/${blog._id}`}
          style={{
            textDecoration: "none",
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#4f46e5",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "gap 0.2s ease",
          }}
        >
          View <span style={{ fontSize: "1rem" }}>→</span>
        </Link>

        {isAdmin && (
          <button
            onClick={(e) => onDelete(blog._id, e)}
            style={{
              background: "none",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              padding: "4px 10px",
              color: "#ef4444",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "'Segoe UI', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#fef2f2";
              e.target.style.borderColor = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.borderColor = "#fecaca";
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
