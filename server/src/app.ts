// import express from "express";
// import * as https from "https";
// import * as fs from "fs";

// import { WebSocket } from "ws";

// class App {
//   public express;

//   constructor() {
//     this.express = express();
//     this.startServer();

//     this.express.get("/", (req, res) => {
//       res.send("ok");
//     });
//   }

//   private startServer() {
//     const key = fs.readFileSync("./localhost-key.pem", "utf8");
//     const cert = fs.readFileSync("./localhost.pem", "utf8");

//     const router = express.Router();
//     router.all("/", (req, res) => res.send("well, hello there."));
//     this.express.use("/", router);

//     const server = https.createServer({ key, cert }, this.express);
//     const port = 8080;

//     server.listen(port);
//   }
// }
// export default new App().express;

// import required packages
const express = require("express");
const cors = require("cors");

const https = require("https");
const http = require("http");

const fs = require("fs");

const app = express();
app.use(cors());

// create a route for the app
app.get("/", (req: any, res: any) => {
  res.send("Hello dev.to!");
});

// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./localhost-key.pem"),
    cert: fs.readFileSync("./localhost.pem"),
  },
  app
);

httpServer.listen(80, () => {
  console.log("HTTP Server running on port 80");
});

httpsServer.listen(443, () => {
  console.log("HTTPS Server running on port 443");
});
