const mkdirp = require("mkdirp");
const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const auth = require("../middleware/auth");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");
const ACCESS_KEY_ID = require("../config/index").ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = require("../config/index").SECRET_ACCESS_KEY;
const BUCKET = require("../config/index").BUCKET;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var path = "uploads/";
    mkdirp.sync(path);
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" || ext !== ".png") {
      return cb(res.status(400).end("only jpg, png are allowed"), false);
    }
    cb(null, true);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
}).single("file");

router.post("/uploadImage", upload, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

const s3 = new aws.S3({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY,
  Bucket: BUCKET,
});

const profileImgUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profileImage");

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

router.post("/profile-img-upload", (req, res) => {
  profileImgUpload(req, res, (error) => {
    if (error) {
      res.json({ success: false, error });
    } else {
      // If File not found
      if (req.file === undefined) {
        res.json("Error: No File Selected");
      } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location;
        res.json({
          success: true,
          image: imageLocation,
          imageName: imageName,
        });
      }
    }
  });
});

// Multiple File Uploads ( max 4 )
const uploadsBusinessGallery = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          "-" +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("galleryImage", 4);

router.post("/multiple-file-upload", (req, res) => {
  uploadsBusinessGallery(req, res, (error) => {
    if (error) {
      res.json({ error: error });
    } else {
      // If File not found
      if (req.files === undefined) {
        res.json("Error: No File Selected");
      } else {
        // If Success
        let fileArray = req.files,
          fileLocation;
        const galleryImgLocationArray = [];
        for (let i = 0; i < fileArray.length; i++) {
          fileLocation = fileArray[i].location;
          galleryImgLocationArray.push(fileLocation);
        }
        // Save the file name into database
        res.json({
          filesArray: fileArray,
          locationArray: galleryImgLocationArray,
        });
      }
    }
  });
});

router.get("/", auth, (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items));
});

router.post("/uploadProduct", auth, (req, res) => {
  const product = new Item(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json(product);
  });
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
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  } else {
    Item.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  }
});

router.put("/editPost/:id", (req, res) => {
  const { name, price, description } = req.body;
  Item.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { name, description, price } },
    { new: true }
  ).then(() =>
    Item.find()
      .then((items) => res.json(items))
      .catch((err) => err.status(500))
      .catch((err) => res.json(err))
  );
});

router.get("/like/:id", (req, res) => {
  Item.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 } }).then(
    () =>
      Item.find()
        .then((items) => res.json(items))
        .catch((err) => err.status(500))
        .catch((err) => res.json(err))
  );
});

router.get("/:id", (req, res) => {
  Item.findById(req.params.id)
    .then((item) => res.json(item))
    .catch((err) => res.status(404).json({ success: false }));
});

router.delete("/:id", (req, res) => {
  Item.findById(req.params.id)
    .then((item) => item.remove().then(() => res.json({ success: true })))
    .catch((err) => res.status(404).json({ success: false }));
});

router.put("/editComment/:id", (req, res) => {
  const { content } = req.body;
  Item.findOneAndUpdate(
    { _id: req.params.id, "comment._id": req.query.CommentId },
    {
      $set: {
        "comment.$.content": content,
      },
    }
  )
    .then(() =>
      Item.find()
        .then((item) => res.json(item))
        .catch((err) => err.status(500))
    )
    .catch((err) => res.json(err));
});

//add comments
router.post("/:id/addComment", auth, (req, res) => {
  User.findById(req.user.id, (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ msg: "please fill all things" });
    }
    Item.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          comment: {
            user: user.name,
            user_image: user.images[0],
            content: content,
          },
        },
        $inc: { comment_count: 1 },
      }
    )
      .then(() =>
        Item.findById(req.params.id)
          .then((item) => res.json(item))
          .catch((err) => err.status(500))
      )
      .catch((err) => res.json(err));
  });
});

//add Replies
router.post("/addReply/:id", auth, (req, res) => {
  User.findById(req.user.id, (err, userInfo) => {
    if (err) return res.json({ success: false, err });
    const user = userInfo;
    const { Reply_content } = req.body;
    Item.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          replies: {
            parent: req.query.CommentId,
            authorId: user._id,
            user_image: user.images[0],
            user: user.name,
            content: Reply_content,
          },
        },
      },
      (err, items) => {
        if (err) return res.json(err);
        Item.findOneAndUpdate(
          { _id: req.params.id, "comment._id": req.query.CommentId },
          {
            $inc: { "comment.$.reply_count": 1 },
            $push: {
              "comment.$.replies": {
                parent: req.query.CommentId,
                authorId: user._id,
                user_image: user.images[0],
                user: user.name,
                content: Reply_content,
                date: Date.now(),
              },
            },
          },
          (err, item) => {
            if (err) return res.json(err);
            Item.findById(req.params.id)
              .then((item) => res.status(200).json(item))
              .catch((err) => err.status(500));
          }
        );
      }
    );
  });
});

router.get("/addReply/:id", (req, res) => {
  Item.find(
    { _id: req.params.id, "replies.parent": req.query.CommentId },
    (err, item) => {
      if (err) return res.json(err);
      res.status(200).json(item);
    }
  );
});

module.exports = router;
