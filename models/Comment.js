const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId, 
    ref: "user",
  },
  parent: Schema.Types.ObjectId, 
  user: String,
  user_image: String,
  content: String,
  like: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

const CommentSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId, 
  },
  user: String,
  content: String,
  user_image: String,
  like: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  reply_count: { type: Number, default: 0 },
});

module.exports = Comment = mongoose.model("Comment", CommentSchema);
