 // require는 node.js에서 import를 뜻한다. 그래서 http관련을 가져온다.
 const http = require('http');

 const server = http.createServer((req, res) => {
  res.end('This is my first response');

 });

 server.listen(process.env.PORT || 3000);
