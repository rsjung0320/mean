const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");

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
// /images로 요정이 들어 온건은 허락하고, 파일을 가져갈 수 있도록 한다.
// path.join은 실제 경로로 forward 해준다고 한다.
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // 보안 이슈는 아니고, 설정하면 된다고 한다.
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
