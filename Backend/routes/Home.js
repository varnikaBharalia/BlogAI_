const { Router } = require("express"); 
const Blog = require("../models/blog"); 
const { restrictTo } = require("../middleware/auth");

const router = Router();

router.get("/home",restrictTo(["user", "admin"]), async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const blogs = await Blog.find({})
      .populate("createdBy", "name profileImage");
    res.status(200).json({user, blogs});
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
