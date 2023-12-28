const WebSocket = require("ws");

const app = require("express")();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(outgoing) {
  wss.clients.forEach((client) => {
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.stringify(outgoing));
    }
  });
}
function single(ws, outgoing) {
  ws.send(JSON.stringify(outgoing));
}

const users = {};

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    let msg = JSON.parse(message);

    switch (msg.action) {
      case "ping":
        single(ws, { action: "pong" });
        break;
      case "fetchUser":
        if (users[msg.data.id] === undefined) {
          let user = { id: msg.data.id, cash: 1000, stocks: {} };
          users[msg.data.id] = user;
        }
        single(ws, { action: "userRes", data: users[msg.data.id] });
        break;
      case "setUser":
        users[msg.data.id] = msg.data;
        break;
      default:
        console.log("Unknown message type: " + msg.action);
    }
    console.log("users: ", users);
  });
});

const PORT = 8000;
app.get("/", (_req, res) => res.send("hello!"));
server.listen(PORT, () => console.log(`running on port ${PORT}`));
