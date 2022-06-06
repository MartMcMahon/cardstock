const express = require("express");
const cors = require("cors");

const https = require("https");
const http = require("http");

const fs = require("fs");

const app = express();
app.use(cors());

// create a route for the app
app.get("/", (req: any, res: any) => {
  res.send("hi mart!!");
});

app.get("/ok", (req: any, res: any) => {
  res.send("ok....");
});

// Listen both http & https ports
const httpServer = http.createServer();
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./key-rsa.pem"),
    cert: fs.readFileSync("./cert.pem"),
  },
  app
);

httpServer.listen(8000, () => {
  console.log("HTTP Server running on port 80");
});

httpsServer.listen(8080, () => {
  console.log("HTTPS Server running on port 443");
});
