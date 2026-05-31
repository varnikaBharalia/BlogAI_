import { useState } from "react";
import toast from "react-hot-toast";

export default function CollaboratorPanel({
  blogId,
  socket,
  user,
  blogCreatorId,
  customRoomId,
  setCustomRoomId,
  currentRoom,
  setCurrentRoom,
  onEditableChange,
  onClose,
}) {
  const [isConnected, setIsConnected] = useState(false);
  
  const generateRandomRoomId = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    // This embeds the blogId directly into the code
    setCustomRoomId(`${blogId}---${randomString}`);
    toast.success("Secure Invite Code generated!");
  };
  const copyToClipboard = () => {
    if (!customRoomId) return;
    navigator.clipboard.writeText(customRoomId);
    toast.success("Invite Code copied to clipboard!");
  };

  const handleJoinRoom = () => {
    if (!customRoomId.trim()) {
      toast.error("Please enter a room ID.");
      return;
    }
    socket.emit("join-room", { roomId: customRoomId, user: user });
    setCurrentRoom(customRoomId);
    onEditableChange(true);
    setIsConnected(true);
    toast.success(`Joined room: ${customRoomId}`);
  };

  const handleEndSession = () => {
    if (!currentRoom) return;
    socket.emit("end-room", { roomId: currentRoom, userId: user._id });
    setCurrentRoom(null);
    onEditableChange(false);
    setIsConnected(false);
    setCustomRoomId("");
    toast.success("Collaboration session ended.");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(15,23,42,0.3)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 200,
        }}
      />

      {/* Side Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "360px",
          maxWidth: "100vw",
          backgroundColor: "#fff",
          zIndex: 201,
          boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            padding: "24px 24px 20px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#0f172a",
                fontFamily: "'Georgia', serif",
              }}
            >
              Co-Author Mode
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.78rem", color: "#94a3b8" }}>
              Real-time collaboration room
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "#94a3b8",
              padding: "4px 8px",
              borderRadius: "6px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#f1f5f9";
              e.target.style.color = "#475569";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#94a3b8";
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "28px 24px", flex: 1, overflowY: "auto" }}>
          {/* Status Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              backgroundColor: isConnected ? "#f0fdf4" : "#f8fafc",
              borderRadius: "10px",
              border: `1px solid ${isConnected ? "#bbf7d0" : "#e2e8f0"}`,
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: isConnected ? "#22c55e" : "#cbd5e1",
                boxShadow: isConnected ? "0 0 0 3px rgba(34,197,94,0.2)" : "none",
                animation: isConnected ? "pulse 2s infinite" : "none",
              }}
            />
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: isConnected ? "#15803d" : "#94a3b8",
              }}
            >
              {isConnected ? "Connected — Live Editing Active" : "Not connected"}
            </span>
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
              50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.1); }
            }
          `}</style>

          {/* Room ID Input */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                fontWeight: 600,
                color: "#475569",
                marginBottom: "8px",
                letterSpacing: "0.3px",
              }}
            >
              Room ID
            </label>
            <input
              type="text"
              value={customRoomId}
              onChange={(e) => setCustomRoomId(e.target.value)}
              placeholder="Enter or share a room ID..."
              disabled={isConnected}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: "10px",
                border: "1.5px solid #e2e8f0",
                outline: "none",
                fontSize: "0.9rem",
                fontFamily: "'Segoe UI', sans-serif",
                color: "#1e293b",
                backgroundColor: isConnected ? "#f8fafc" : "#fff",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                if (!isConnected) e.target.style.borderColor = "#4f46e5";
              }}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "6px" }}>
              Share this ID with co-authors to edit together.
            </p>
          </div>

          {/* Suggested Room ID */}
          {/* Secure Room ID Generator */}
          {!isConnected && (
            <div style={{ marginBottom: "24px", display: "flex", gap: "8px" }}>
              <button
                onClick={generateRandomRoomId}
                style={{
                  flex: 1,
                  padding: "10px",
                  backgroundColor: "#eef2ff",
                  color: "#4f46e5",
                  border: "1px dashed #a5b4fc",
                  borderRadius: "10px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e0e7ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#eef2ff")}
              >
                ✨ Generate Secure Code
              </button>

              <button
                onClick={copyToClipboard}
                title="Copy to clipboard"
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#f8fafc",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#f1f5f9")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8fafc")}
              >
                📋 Copy
              </button>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {!isConnected ? (
              <button
                onClick={handleJoinRoom}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  backgroundColor: "#4f46e5",
                  color: "#fff",
                  border: "none",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Segoe UI', sans-serif",
                  boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#4338ca")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#4f46e5")}
              >
                ⚡ Join / Start Room
              </button>
            ) : (
              <button
                onClick={handleEndSession}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  fontSize: "0.92rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Segoe UI', sans-serif",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
              >
                🔴 End Session
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#cbd5e1", textAlign: "center" }}>
            Changes sync in real-time via WebSocket
          </p>
        </div>
      </div>
    </>
  );
}
