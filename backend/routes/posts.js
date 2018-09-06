const express = require("express");
// Multer는 파일 업로드를 위해 사용되는 multipart/form-data 를 다루기 위한 node.js 의 미들웨어 입니다. 효율성을 최대화 하기 위해 busboy 를 기반으로 하고 있습니다.
const multer = require("multer");

const Post = require("../models/post");
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    // 아직은 mongodb와 연결은 되지 않았다. new Post를 한 순간 몽고 DB에서 ID를 생성하는 것을 확인하였다.
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
    });
    // 실제 몽고 DB에 생성된 Data를 넣는다.
    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          id: createdPost._id,
          ...createdPost
        }
      });
    });
  }
);

// update는
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    // 1번 째는 where 절이고, 2번째는 update할 값이다.
    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({
        mssage: "Update successfully!"
      });
    });
  }
);

// param과 body를 잘 구문해서 쓰자!!
router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.get("", (req, res, next) => {
  // string 앞에 +를 붙이면 number로 convert 된다.
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
      .then(count => {
        return res.status(200).json({
          message: "Posts fetched successfully!",
          posts: fetchedPosts,
          maxPosts: count
        });
      })
    .catch();

  // next()는 이 함수를 끝낸다는 뜻이다. 하지만 우리는 계속해서 해야하니 쓰면 안된다.
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
