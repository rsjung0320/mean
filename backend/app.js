const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  // 보안 이슈는 아니고, 설정하면 된다고 한다.
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});
// NqiqwFKyG1d7wDqv
app.post("/api/posts", (req, res, next) => {
  const post = req.body;
  console.log(post);
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
