 // require는 node.js에서 import를 뜻한다. 그래서 http관련을 가져온다.
 const http = require('http');
 const app = require('./backend/app');

 const port = process.env.PORT || 3000;

 app.set('port', port);
 const server = http.createServer(app);

 server.listen(port);
