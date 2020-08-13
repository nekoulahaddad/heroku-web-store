const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const ReplySchema = new Schema({
    authorId: String,
    parent: Schema.Types.ObjectId,//comment _id
    user: String,
    user_image:String,
    content: String,
    like: {type: Number, default: 0},
    date: {type: Date, default: Date.now}
})    

const CommentSchema = new Schema({
    authorId: String,
    user: String,
    content: String,
    user_image:String,
    like: {type: Number, default: 0},
    date: {type: Date, default:Date.now },
    reply_count: {type: Number, default: 0},
    replies:{
    type: Array,
    default: []}
})    

const ItemsSchema = new Schema({
writer: {
        type: Schema.Types.ObjectId,        // if i need to get more info go to link https://mongoosejs.com/docs/populate.html
        ref: 'user'
    },
name : {
	type : String,
	required : true
},
description : {
	type : String
},
category : {
    type : String
},
images : {
	type: Array,
    default: []
},
continents: {
    type: Number,
    default: 1
},
date : {
	type : Date,
	default : Date.now
},
price : {
	type : Number
},
price_sale : {
    type : Number
},
likes :{
    type:Number,
    default: 0
},
comment_count: {
    type: Number, default: 0
},
comment :[CommentSchema],
replies: [ReplySchema],
sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
views: {
    type: Number,
    default: 0
}
}, { timestamps: true }) // hie she3`le mnshan ye6la3 created at .. updated at
// al index had shee jedan mohem mnshan al search ... hal2 2na 9ar feny 23mel search bel data base w bs 2ktob shee klme bedawer 3leha bel title w al description
ItemsSchema.index({ 
    title:'text',
    description: 'text',
}, {
    weights: {
        name: 5,
        description: 1,
    }
})


module.exports = Item = mongoose.model("Item",ItemsSchema)

