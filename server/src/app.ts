const express = require("express");
const cors = require("cors");

const https = require("https");
const http = require("http");

const fs = require("fs");

// const app = express();
// app.use(cors());

// create a route for the app
// app.get("/", (req: any, res: any) => {
//   res.send("hi mart!!");
// });

// app.get("/ok", (req: any, res: any) => {
//   res.send("ok....");
// });

import env from "./.env.dev";
const { httpPort, httpsPort, certFile, keyFile } = env;

// Listen both http & https ports
const httpServer = http.createServer();//app);
const httpsServer = https.createServer(
  {
    key: fs.readFileSync("./key-rsa.pem"),
    cert: fs.readFileSync("./cert.pem"),
  },
  // app
);

import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ server: httpsServer });

const clients = new Map();
wss.on("connection", (ws) => {
  ws.send("something");
  clients.set(ws, "test");
});
wss.on("message", (data) => {
  console.log("received: %s", data);
});

setInterval(() => {
  console.log(clients);
}, 1000);

httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server running on port ${httpsPort}`);
});
// insec = new WebSocketServer({ server: httpsServer });
// index.on("connection");
httpServer.listen(httpPort, () => {
  console.log(`HTTP Server running on port ${httpPort}`);
});

// httpsServer.listen(httpsPort);

// const WebSocket = require("ws").Server;
// let socket = new WebSocket({
//   server: httpsServer,
// });

// // server.listen(config.port);

// // import ws from 'ws';

// // const wss = new ws.Server({ port: 333 });
// const clients = new Map();
// socket.on("connection", (ws: any) => {
//   console.log("connectred:", ws);
//   const color = Math.floor(Math.random() * 360);

//   clients.set(ws, color);
// });

// socket.listen(8080);
