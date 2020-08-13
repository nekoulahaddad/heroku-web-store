const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ReplySchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,        // if i need to get more info go to link https://mongoosejs.com/docs/populate.html
        ref: 'user'
    },
    parent: Schema.Types.ObjectId,//comment _id
    user: String,
    user_image:String,
    content: String,
    like: {type: Number, default: 0},
    date: {type: Date, default: Date.now}
})    

const CommentSchema = new Schema({
    authorId: {
        type: Schema.Types.ObjectId,        // if i need to get more info go to link https://mongoosejs.com/docs/populate.html
        ref: 'user'
    },
    user: String,
    content: String,
    user_image:String,
    like: {type: Number, default: 0},
    date: {type: Date, default:Date.now },
    reply_count: {type: Number, default: 0}
})


module.exports = Comment = mongoose.model("Comment",CommentSchema)