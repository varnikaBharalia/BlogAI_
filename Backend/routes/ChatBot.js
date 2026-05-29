
// const express = require("express");
// const router = express.Router();
// const Blog = require("../models/blog");
// const Comment = require("../models/comment");
// const OpenAI = require("openai");
// const ChatHistory = require("../models/chat");
// const { restrictTo } = require("../middleware/auth");
// require('dotenv').config();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY  });

// router.post("/", restrictTo(["user", "admin"]), async (req, res) => {
//   const { blogId, message } = req.body;
//   const user = req.user;

//   if (!blogId || !message) {
//     return res.status(400).json({ error: "blogId and message are required." });
//   }

//   try {
//     const blog = await Blog.findById(blogId);
//     if (!blog) {
//       return res.status(404).json({ error: "Blog not found." });
//     }

//     const comments = await Comment.find({ blogId });
//     const context = `${blog.title}\n${blog.body}\n\nComments:\n- ${comments.map((c) => c.content).join("\n- ")}`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         { role: "system", content: "You help users understand blogs and comments." },
//         { role: "user", content: `Blog and Comments:\n${context}` },
//         { role: "user", content: message },
//       ],
//     });

//     const botReply = response.choices?.[0]?.message?.content || "I'm not sure how to answer that.";

//     const chatPair = [
//       { role: "user", content: message },
//       { role: "assistant", content: botReply },
//     ];

//     await ChatHistory.findOneAndUpdate(
//       { userId: user._id, blogId },
//       { $push: { messages: { $each: chatPair, $slice: -100 } } },
//       { new: true, upsert: true }
//     );

//     res.json({ reply: botReply });
//   } catch (err) {
//     console.error("Chat failed:", err);
//     res.status(500).json({ error: "Something went wrong." });
//   }
// });

// router.get("/history/:blogId", restrictTo(["user", "admin"]), async (req, res) => {
//   try {
//     const chat = await ChatHistory.findOne({ userId: req.user._id, blogId: req.params.blogId });
//     res.json({ messages: chat?.messages || [] });
//   } catch (err) {
//     console.error("Failed to fetch chat history:", err);
//     res.status(500).json({ error: "Failed to fetch chat history." });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const Groq = require("groq-sdk");
const ChatHistory = require("../models/chat");
const { restrictTo } = require("../middleware/auth");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/", restrictTo(["user", "admin"]), async (req, res) => {
  const { blogId, message } = req.body;
  const user = req.user;

  if (!blogId || !message) {
    return res.status(400).json({ error: "blogId and message are required." });
  }

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found." });
    }

    const comments = await Comment.find({ blogId });
    const context = `${blog.title}\n${blog.body}\n\nComments:\n- ${comments.map((c) => c.content).join("\n- ")}`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that helps users understand blog posts and their comments. Be concise and friendly.",
        },
        {
          role: "user",
          content: `Here is the blog post and its comments for context:\n\n${context}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 1024,
    });

    const botReply = response.choices?.[0]?.message?.content || "I'm not sure how to answer that.";

    const chatPair = [
      { role: "user", content: message },
      { role: "assistant", content: botReply },
    ];

    await ChatHistory.findOneAndUpdate(
      { userId: user._id, blogId },
      { $push: { messages: { $each: chatPair, $slice: -100 } } },
      { new: true, upsert: true }
    );

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/history/:blogId", restrictTo(["user", "admin"]), async (req, res) => {
  try {
    const chat = await ChatHistory.findOne({
      userId: req.user._id,
      blogId: req.params.blogId,
    });
    res.json({ messages: chat?.messages || [] });
  } catch (err) {
    console.error("Failed to fetch chat history:", err);
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

module.exports = router;