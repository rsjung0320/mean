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
  post.save();

  res.status(201).json({
    message: 'Post added successfully!',
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'faef2f2f1',
      title: "First server-side post",
      content: "First content1"
    },
    {
      id: 'faef2f2f2',
      title: "Second server-side post",
      content: "Second content1"
    }
  ];
  return res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
  // next()는 이 함수를 끝낸다는 뜻이다. 하지만 우리는 계속해서 해야하니 쓰면 안된다.
});


module.exports = app;
