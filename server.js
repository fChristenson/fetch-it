const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.writeHead(200);
  res.write(JSON.stringify({ foo: 1 }));
  res.end();
});

server.listen(3000);
