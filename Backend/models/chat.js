const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const chatHistorySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const ChatHistory = model("ChatHistory", chatHistorySchema);
module.exports = ChatHistory;