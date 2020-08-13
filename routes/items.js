const mkdirp = require("mkdirp")
const express = require("express");
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth')
const multer = require('multer'); // multer it is like bodyparser but bodyparse handles req.body and multer handles req.file

const storage = multer.diskStorage({  // multer it is used to handle req.file, so if i need to upload any files
    destination: (req, file, cb) => { // destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads')
        var path = 'uploads/';
        mkdirp.sync(path)
        cb(null, path) 
    },
    filename: (req, file, cb) => { // Each function gets passed both the request (req) and some information about the file (file) to aid with the decision.
        cb(null, new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname);
        // we use replace(/:/g, '-') to prevent an error while using new Date cuz windows can't handle : in new Date
    }
    ,
    fileFilter: (req, file, cb) => { //Set this to a function to control which files should be uploaded and which should be skipped.
        const ext = path.extname(file.originalname) // cb it is a shortcut of call back func
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

// Big Note : i can add auth as a bodyparser to any route to make it useable without logging in 

//const upload = multer({ dest: 'uploads/' }) new Date().toISOString().replace(/:/g, '-') + "_" + 
const upload = multer({ storage: storage, limits:{fileSize:1024*1024*10}}).single("file") // file is the name of the field, to link it in the front end or in postman

//,image: res.req.file.path, fileName: res.req.file.filename

router.get('/',auth, (req,res) => {
Item.find()
.sort({ date : -1})
.then(items => res.json(items))

});

router.post("/uploadImage", upload ,(req, res) => {  // note : in postman i need to choose body--> form-data --> key:file cuz i have single("file") and then i choose file and then upload the pic, after that i need to go to headers and get rid of content-Type:application.json cuz here i am handeling files and images/--> note lazem ykon al file bnafes al directory tb3 al postman

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true,image: res.req.file.path, fileName: res.req.file.filename})
    })

});

// there is two ways to add the information about new item to the database, so i can use either of them

// first way
/*
router.post('/',auth,(req,res) => {

   const {name,photo,price} = req.body;
	const newItem = new Item({
	name,
	price
	});
	newItem.save().then(item => res.json(item));
});
*/
// second way 
//auth, 
router.post("/uploadProduct", auth,  (req, res) => {

    //save all the data we got from the client into the DB 
    const product = new Item(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json(product)
    })
});


router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);

    let findArgs = {};
    let term = req.body.searchTerm;


    if (term) {
        Item.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    } else {
        Item.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, products, postSize: products.length })
            })
    }

});







//edit a post   
// feny 23mlha yadawy 2no
//const {name,price,description} = req.body
//if (!name || !price || !description) { 23mel shee w 2za kelon mawjoden 23mel shee tany bs bet5ayal fee maktabe bteshte3`el hal she3`el }
router.put("/editPost/:id",(req,res) => {
    const {name,price,description} = req.body
Item.findByIdAndUpdate({_id:req.params.id},
    {$set:{name,description,price}},{ new: true }
    )
.then(()=> Item.find()
.then((items)=> res.json(items))
.catch((err)=> err.status(500))
.catch((err)=> res.json(err))
)
});


//like or dislike
router.get("/like/:id",(req,res) => {
Item.findOneAndUpdate({_id:req.params.id},
    {$inc:{likes:1}}
    )
.then(()=> Item.find()
.then((items)=> res.json(items))
.catch((err)=> err.status(500))
.catch((err)=> res.json(err))
)
});


router.get('/:id',(req,res) => {
Item.findById(req.params.id)
.then(item => res.json(item))
.catch(err => res.status(404).json({success:false}))
});



router.delete('/:id',(req,res) => {
Item.findById(req.params.id)
.then(item => item.remove().then(() => res.json({success:true})))
.catch(err => res.status(404).json({success:false}))
});


//edit comment
router.put('/editComment/:id',(req,res) => {
	const {content} = req.body;
	Item.findOneAndUpdate({_id:req.params.id,"comment._id":req.query.CommentId},
        {
            $set:{
                "comment.$.content": content
                //[{_id:req.query.commentId,content:content}]
                }
        })
	.then(() => Item.find()
		.then(item=>res.json(item))
		.catch(err=>err.status(500)))
    .catch(err => res.json(err))
});

//add comments
router.post('/:id/addComment',auth,(req,res) => {
    User.findById(req.user.id,
    (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo
    const {content} = req.body;
    if (!content) {
    return res.status(400).json({msg : "please fill all things"});
    }
    Item.findByIdAndUpdate({_id:req.params.id},
        {
        $push:{comment: {user:user.name,user_image:user.images[0],content:content}},
        $inc:{comment_count:1}
},

)
    .then(() => Item.findById(req.params.id)
        .then(item=>res.json(item))
        .catch(err=>err.status(500)))
    .catch(err => res.json(err)) 

})});


//add Replies
router.post('/addReply/:id',auth,(req,res) => {
    
    User.findById(req.user.id,
    (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo
   const {Reply_content} = req.body;
    //const {name} = req.user;
    Item.findByIdAndUpdate(
        {_id:req.params.id},
        {$push:
            {
        replies: {parent:req.query.CommentId,authorId:user._id,user_image:user.images[0],user:user.name,content:Reply_content}
}
},(err,items)=>{
    if (err) return res.json(err);
    Item.findOneAndUpdate(
                { _id: req.params.id, "comment._id": req.query.CommentId },
                { $inc: { "comment.$.reply_count": 1 },
                $push:{"comment.$.replies": {parent:req.query.CommentId,authorId:user._id,user_image:user.images[0],user:user.name,content:Reply_content,date: Date.now() }}
                 },
                (err,item)=>{
                    if (err) return res.json(err);
                    Item.findById(req.params.id)
                    .then(item=>res.status(200).json(item))
                    .catch(err=>err.status(500))
                } //https://docs.mongodb.com/manual/reference/operator/update/positional/
            )
})
})});



router.get('/addReply/:id',(req,res) => {   
    Item.find(
                { _id: req.params.id, "replies.parent": req.query.CommentId },
                (err,item)=>{
                    if (err) return res.json(err);
                    res.status(200).json(item)
                } //https://docs.mongodb.com/manual/reference/operator/update/positional/
            )
});








module.exports = router;