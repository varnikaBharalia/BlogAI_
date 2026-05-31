const express = require('express');
const path = require('path');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const HomeRoutes = require('./routes/Home');
const ChatBotRoutes = require('./routes/ChatBot');
const { checkForAuthenticationCookie } = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./db/Connect');
const http = require("http");
const { Server } = require("socket.io");

require('dotenv').config();

connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://blog-ai-two-nu.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json());


app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.resolve('./public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(checkForAuthenticationCookie());

app.use('/user', userRoutes);
app.use('/', HomeRoutes);
app.use("/blog", blogRoutes);
app.use("/chatbot", ChatBotRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://blog-ai-two-nu.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomUsers = {};

io.on("connection", (socket) => {
  console.log("A user connected to WebSockets:", socket.id);

  // socket.on("join-room", ({ roomId, userId }) => {
  //   socket.join(roomId);
  //   console.log(`User ${userId} joined room ${roomId}`);
  // });

  socket.on("join-room", ({ roomId, user }) => {
    socket.join(roomId);
    socket.roomId = roomId;
    socket.user = user;

    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    if (!roomUsers[roomId].find(u => u._id === user._id)) {
      roomUsers[roomId].push(user);
    }

    io.to(roomId).emit("room-users-update", roomUsers[roomId]);

    // NEW: Broadcast to everyone ELSE that this user joined
    socket.to(roomId).emit("user-joined", user.name);

    console.log(`User ${user.name} joined room ${roomId}`);
  });


  socket.on("send-body", ({ roomId, body }) => {
    // Broadcast the updated text to everyone ELSE in that specific room
    socket.to(roomId).emit("receive-body", body);
  });

  socket.on("end-room", ({ roomId, userId }) => {
    // Tell everyone in the room that the session is over
    io.to(roomId).emit("room-ended");
    // Force all sockets to leave the room
    io.in(roomId).socketsLeave(roomId);
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected:", socket.id);
  // });

  socket.on("disconnect", () => {
    if (socket.roomId && socket.user) {
      roomUsers[socket.roomId] = roomUsers[socket.roomId].filter(
        (u) => u._id !== socket.user._id
      );
      io.to(socket.roomId).emit("room-users-update", roomUsers[socket.roomId]);
      
      // NEW: Broadcast to the room that this user left
      io.to(socket.roomId).emit("user-left", socket.user.name); 
    }
    console.log("User disconnected:", socket.id);
  });


});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server & WebSockets running on port ${process.env.PORT || 3000}`);
});