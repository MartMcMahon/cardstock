import init, { start } from "./pkg/cardstock.js";

export const name = "mod";

export class Connection {
  constructor() {
    this.isConnected = false;
    this.ws = new WebSocket("ws://localhost:9999");

    // Connection opened
    this.ws.addEventListener("open", (event) => {
      this.isConnected = true;
      this.ws.send("Hello Server!");
    });

    // Listen for messages
    this.ws.addEventListener("message", function(event) {
      console.log("Message from server ", event.data);
    });
  }

  send(msg) {
    console.log("sending ", msg, "from js");
    this.ws.send(msg);
  }
}

let conn = new Connection();
setTimeout(() => {
  conn.send("test msg 1 from js");
  conn.send("test msg 2 from js");
  conn.send("test msg 3 from js");
}, 1000);

init().then(() => {
  start();
});

export function send(msg) {
  console.log("bevy sending ", msg);
  if (conn.isConnected) {
    conn.send("test msg ", msg, " send from bevy");
  }
}
