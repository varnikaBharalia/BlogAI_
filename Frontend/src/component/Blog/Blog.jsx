import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import UseUser from "../UserContext/UserContext";
import toast from "react-hot-toast";
import axiosInstance from "../API/axiosInstance";
import CircularIndeterminate from "./CircularIndeterminate";
import ChatbotToggle from "../ChatBot/ChatbotToggle";
import ChatWindow from "../ChatBot/ChatWindow";
import { FaSave, FaEdit } from "react-icons/fa";
import { MdPersonAddAlt1 } from "react-icons/md";
import { io } from "socket.io-client";
import CollaboratorPanel from "./CollaboratorPanel";
import debounce from "lodash.debounce";

export default function Blog() {
  const baseURL = axiosInstance.defaults.baseURL;
  const { id } = useParams();
  const navigate = useNavigate();
  const { CurrentUser: user, setCurrentUser } = UseUser();
  const [searchParams] = useSearchParams();
  const roomFromUrl = searchParams.get("room");
  const areaRef = useRef(null);

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const [editable, setEditable] = useState(false);
  const [newCoverImage, setNewCoverImage] = useState(null);
  const [customRoomId, setCustomRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);
  const socketRef = useRef(null);
  const [showCollaboratorPanel, setShowCollaboratorPanel] = useState(false);
  
  // NEW: Track who is currently in the room
  const [activeCollaborators, setActiveCollaborators] = useState([]);

  useEffect(() => {
    const socket = io(baseURL);
    socketRef.current = socket;

    const handleRecieveData = (updatedBody) => {
      setBlog((prevBlog) => ({ ...prevBlog, body: updatedBody }));
    };

    const handleroomEnd = () => {
      toast.success("The collaboration session has ended.");
      setEditable(false);
      setShowCollaboratorPanel(false);
      setActiveCollaborators([]); // Clear the list
    };

    // Listen for real-time updates and popups
    socket.on("room-users-update", (users) => setActiveCollaborators(users));
    socket.on("user-joined", (name) => toast.success(`${name} joined the room!`, { icon: '👋' }));
    socket.on("user-left", (name) => toast(`${name} left the room.`, { icon: '🚶' }));
    
    socket.on("receive-body", handleRecieveData);
    socket.on("room-ended", handleroomEnd);

    return () => {
      socket.off("receive-body", handleRecieveData);
      socket.off("room-ended", handleroomEnd);
      socket.off("room-users-update");
      socket.off("user-joined");
      socket.off("user-left");
      socket.disconnect();
    };
  }, []);

  // NEW: Auto-join if someone clicks a smart link
  useEffect(() => {
    if (roomFromUrl && socketRef.current && user) {
      setShowCollaboratorPanel(true);
      setCustomRoomId(roomFromUrl);
      
      socketRef.current.emit("join-room", { 
        roomId: roomFromUrl, 
        user: { _id: user._id, name: user.name, profileImage: user.profileImage } 
      });
      
      setCurrentRoom(roomFromUrl);
      setEditable(true);
    }
  }, [roomFromUrl, user]);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await axiosInstance.get(`/blog/${id}`);
        setBlog(res.data.blog);
        setComments(res.data.comments);
        const homeRes = await axiosInstance.get("/home");
        setCurrentUser(homeRes.data.user);
      } catch (err) {
        navigate("/");
        toast.error("Failed to fetch blog. Please try again.");
      }
    }
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [blog?.body]);

  const handleBlogUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("body", blog.body);
      formData.append("userId", user._id);
      if (newCoverImage) formData.append("coverImage", newCoverImage);

      const res = await axiosInstance.put(`/blog/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setBlog(res.data.blog);
      setEditable(false);
      setNewCoverImage(null);
      toast.success("Blog updated successfully!");

      if (currentRoom && socketRef.current) {
        socketRef.current.emit("end-room", { roomId: currentRoom });
        
        setCurrentRoom(null);
        setCustomRoomId("");
      }

    } catch (err) {
      toast.error("Failed to update blog.");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/blog/comment/${id}`, { content, user });
      toast.success("Comment added successfully!");
      setContent("");
      const res = await axiosInstance.get(`/blog/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/blog/comment/${commentId}`);
      toast.success("Comment deleted successfully!");
      const res = await axiosInstance.get(`/blog/${id}`);
      setComments(res.data.comments);
    } catch (err) {
      toast.error("Failed to delete comment.");
    }
  };

  const emitBody = useCallback(
    debounce((body) => {
      if (socketRef.current && editable && currentRoom) {
        socketRef.current.emit("send-body", { roomId: currentRoom, body });
      }
    }, 500),
    [socketRef, editable, currentRoom] 
  );

  const handleChange = (e) => {
    const newBody = e.target.value;
    setBlog((prev) => ({ ...prev, body: newBody }));
    if (editable && currentRoom) emitBody(newBody);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };

  if (!blog) return <CircularIndeterminate />;

  const isOwner =
    (user && blog.createdBy._id === user._id) || user?.role === "admin";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* Floating Toolbar (top right) */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "24px",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          borderRadius: "999px",
          padding: "8px 14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={() => setShowCollaboratorPanel((prev) => !prev)}
          title="Add Collaborator"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#4f46e5",
            fontSize: "1.25rem",
            padding: "4px 6px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eef2ff")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <MdPersonAddAlt1 />
        </button>

        {isOwner && (
          <button
            onClick={() => {
              if (editable) handleBlogUpdate();
              setEditable((prev) => !prev);
            }}
            title={editable ? "Save" : "Edit"}
            style={{
              background: editable ? "#4f46e5" : "none",
              border: editable ? "none" : "none",
              cursor: "pointer",
              color: editable ? "#fff" : "#64748b",
              fontSize: "1rem",
              padding: "6px 10px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!editable) e.currentTarget.style.backgroundColor = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              if (!editable) e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {editable ? <FaSave /> : <FaEdit />}
          </button>
        )}
      </div>

      {/* Collaborator Panel */}
      {showCollaboratorPanel && (
        <CollaboratorPanel
          blogId={blog._id}
          socket={socketRef.current}
          user={user}
          blogCreatorId={blog.createdBy._id}
          customRoomId={customRoomId}
          setCustomRoomId={setCustomRoomId}
          currentRoom={currentRoom}
          setCurrentRoom={setCurrentRoom}
          onEditableChange={setEditable}
          onClose={() => setShowCollaboratorPanel(false)}
          activeCollaborators={activeCollaborators} // Passed down to the panel!
        />
      )}

      {/* Hero Cover Image */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
          marginTop: "20px",
        }}
      >
        <img
          src={
            newCoverImage
              ? URL.createObjectURL(newCoverImage)
              : blog.coverImage
          }
          alt="Blog Cover"
          style={{
            maxWidth: "800px",
            maxHeight: "350px",
            width: "auto",
            height: "auto",
            borderRadius: "12px",
            objectFit: "contain",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          }}
        />
      </div>
      {editable && (
        <div style={{ maxWidth: "760px", margin: "12px auto", padding: "0 24px" }}>
          <label
            style={{
              display: "inline-block",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1.5px solid #c7d2fe",
              color: "#4f46e5",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              backgroundColor: "#eef2ff",
            }}
          >
            Change Cover Image
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setNewCoverImage(e.target.files[0])}
            />
          </label>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Title */}
        {editable ? (
          <input
            type="text"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            style={{
              width: "100%",
              border: "none",
              borderBottom: "2px solid #c7d2fe",
              outline: "none",
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#0f172a",
              backgroundColor: "transparent",
              marginBottom: "32px",
              padding: "4px 0",
              boxSizing: "border-box",
            }}
          />
        ) : (
          <h1
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: 1.2,
              marginBottom: "32px",
              letterSpacing: "-0.5px",
            }}
          >
            {blog.title}
          </h1>
        )}

        {/* Author Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "40px",
            padding: "16px",
            backgroundColor: "#f8fafc",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        >
          <img
            src={`${baseURL}${blog.createdBy.profileImage}`}
            alt="Author"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #e0e7ff",
              flexShrink: 0,
            }}
          />
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                color: "#1e293b",
                fontSize: "0.95rem",
              }}
            >
              {blog.createdBy.name}
            </p>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.82rem" }}>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Body */}
        <textarea
          ref={areaRef}
          value={blog.body}
          readOnly={!editable}
          onChange={handleChange}
          rows={1}
          style={{
            width: "100%",
            outline: "none",
            resize: "none",
            fontFamily: "'Georgia', serif",
            fontSize: "1.1rem",
            color: "#334155",
            lineHeight: 1.9,
            backgroundColor: editable ? "#fafbff" : "transparent",
            padding: editable ? "16px" : "0",
            borderRadius: editable ? "10px" : "0",
            border: editable ? "1.5px solid #c7d2fe" : "none",
            marginBottom: "56px",
            boxSizing: "border-box",
            overflow: "hidden",
            transition: "all 0.2s ease",
          }}
        />

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#e2e8f0",
            marginBottom: "48px",
          }}
        />

        {/* Comments Section */}
        <h2
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: "24px",
          }}
        >
          Comments ({comments.length})
        </h2>

        {user && (
          <form
            onSubmit={handleCommentSubmit}
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "32px",
            }}
          >
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              required
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                outline: "none",
                fontSize: "0.9rem",
                fontFamily: "'Segoe UI', sans-serif",
                color: "#334155",
                backgroundColor: "#f8fafc",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                backgroundColor: "#4f46e5",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                fontFamily: "'Segoe UI', sans-serif",
                whiteSpace: "nowrap",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#4338ca")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#4f46e5")}
            >
              Add →
            </button>
          </form>
        )}

        {/* Comment List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {comments.map((comment) => (
            <div
              key={comment._id}
              style={{
                backgroundColor: "#f1f5f9",
                borderRadius: "12px",
                padding: "14px 18px",
                position: "relative",
              }}
            >
              {user?.role === "admin" && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "14px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    padding: "2px",
                    borderRadius: "4px",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#fecaca")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                  title="Delete comment"
                >
                  ❌
                </button>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <img
                  src={`${baseURL}${comment.createdBy.profileImage}`}
                  alt="User"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e0e7ff",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontWeight: 600,
                    color: "#1e293b",
                    fontSize: "0.88rem",
                  }}
                >
                  {comment.createdBy.name}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                  paddingLeft: "50px",
                }}
              >
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Chatbot FAB */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 99 }}>
        <ChatbotToggle onClick={() => setShowChatbot(!showChatbot)} />
        {showChatbot && (
          <ChatWindow blogId={id} onClick={() => setShowChatbot(false)} />
        )}
      </div>
    </div>
  );
}