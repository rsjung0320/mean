const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://jung:NqiqwFKyG1d7wDqv@cluster-hckzp.mongodb.net/node-angular?retryWrites=true")
  .then(() => {
    console.log('Connected to database!');;

  })
  .catch(() => {
    console.log('Connection failed!');;
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // 보안 이슈는 아니고, 설정하면 된다고 한다.
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/posts", (req, res, next) => {
  // 아직은 mongodb와 연결은 되지 않았다. new Post를 한 순간 몽고 DB에서 ID를 생성하는 것을 확인하였다.
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  // 실제 몽고 DB에 생성된 Data를 넣는다.
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      postId: createdPost._id
    });
  });


});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(documents => {
      return res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
    })
    .catch();

  // next()는 이 함수를 끝낸다는 뜻이다. 하지만 우리는 계속해서 해야하니 쓰면 안된다.
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);;
    res.status(200).json({message: "Post deleted!"});
  });

});

module.exports = app;
