const express = require('express');

const app = express();



app.use('/api/posts', (req, res, next) => {
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
