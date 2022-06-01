import express from "express";
import * as https from "https";
import * as fs from "fs";

import { WebSocket } from "ws";

class App {
  public express;

  constructor() {
    this.express = express();
    this.startServer();
  }

  private startServer() {
    const key = fs.readFileSync("./key-rsa.pem");
    const cert = fs.readFileSync("./cert.pem");

    const router = express.Router();
    router.all("/", (req, res) => res.send("well, hello there."));
    this.express.use("/", router);

    const server = https.createServer({ key, cert }, this.express);
    const port = 6669;

    server.listen(port, "0.0.0.0", () => {
      console.log(`server listening on port ${port}`);
    });
  }
}
export default new App().express;
