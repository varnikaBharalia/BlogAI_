const { Router } = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const multer = require("multer");
const { storage } = require("../service/cloudinary");
const { restrictTo } = require("../middleware/auth");

const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



const router = Router();

const upload = multer({ storage: storage });

router.post("/addNewBlog", restrictTo(["admin", "user"]), upload.single("coverImage"), async (req, res) => {
  try {
    console.log("req.file from Cloudinary:", req.file);

    const { title, body, userId } = req.body;
    if (!title || !body || !req.file || !userId) {
      return res.status(400).json({ error: "Title, body, cover image, and user ID are required" });
    }

    const blog = await Blog.create({
      title,
      body,
      coverImage: req.file.path,
      createdBy: userId,
    });

    res.status(201).json({ blog });

  } catch (err) {
    console.error("Cloudinary Upload Error:", JSON.stringify(err, null, 2));
    res.status(500).json({ error: err.message || "Upload failed" });
  }
});


router.get("/:id", restrictTo(["admin", "user"]), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    // console.log("BLOG DATA:", JSON.stringify(blog, null, 2));

    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    return res.status(200).json({ blog, comments });
  } catch (err) {
    console.error("Failed to fetch blog:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:blogId", restrictTo(["admin"]), async (req, res) => {
  try {
    const blogId = req.params.blogId;

    await Blog.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("Error deleting blog:", err);
    res.status(500).json({ message: "Error deleting blog" });
  }
});

router.post("/comment/:id", restrictTo(["admin", "user"]), async (req, res) => {
  try {
    console.log("req.body from comment is ", req.body);
    console.log("req.params from comment is ", req.params);

    await Comment.create({
      content: req.body.content,
      blogId: req.params.id,
      createdBy: req.body.user._id,
    });

    return res.status(201).json({ message: "Comment created successfully" });
  } catch (err) {
    console.error("Error while creating comment:", err);
    return res.status(500).json({ error: "Failed to create comment" });
  }
});

router.delete("/comment/:id", restrictTo(["admin", "user"]), async (req, res) => {
  try {
    const commentId = req.params.id;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ message: "Failed to delete comment" });
  }

});

router.put(
  "/:id",
  restrictTo(["admin", "user"]),
  upload.single("coverImage"),
  async (req, res) => {
    try {
      const { title, body } = req.body;

      const blog = await Blog.findById(req.params.id);

      if (!blog) {
        return res.status(404).json({
          error: "Blog not found",
        });
      }

      blog.title = title || blog.title;
      blog.body = body || blog.body;

      if (req.file) {
        blog.coverImage = req.file.path;
      }

      await blog.save();

      const updatedBlog = await Blog.findById(blog._id)
        .populate("createdBy");

      return res.status(200).json({
        blog: updatedBlog,
      });
    } catch (err) {
      console.error("Update blog error:", err);
      return res.status(500).json({
        error: "Failed to update blog",
      });
    }
  }
);

router.post("/generate", restrictTo(["admin", "user"]), async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required." });

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a blog writing assistant. Write engaging, well-structured blog posts.",
        },
        {
          role: "user",
          content: `Write a detailed blog post for the title: "${title}". Write only the blog body, no headings or meta text.`,
        },
      ],
      max_tokens: 1024,
    });

    const body = response.choices?.[0]?.message?.content || "";
    res.json({ body });
  } catch (err) {
    console.error("Groq generation failed:", err);
    res.status(500).json({ error: "AI generation failed." });
  }
});

module.exports = router;

