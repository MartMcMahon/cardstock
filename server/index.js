const WebSocket = require("ws");

const app = require("express")();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const mongo = require("mongodb");

const uri =
  "mongodb+srv://admin:admin@localhost/cardstock?retryWrites=true&w=majority";
const client = new mongo.MongoClient(uri);

const getUser = async (id) => {
  await client.connect();
  const users = client.db("cardstock").collection("users");
  const user = await users.findOne({ id });
  return user;
};

const registerUser = async (id, username, passHash) => {
  await client.connect();
  const users = client.db("cardstock").collection("users");
  const user = await users.findOne({ id });
  if (user) {
    return { error: "User already exists" };
  }
  await users.insertOne({ id, username, passHash });
  return { id, username, passHash };
};

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
    console.log("received: %s", message)
    let msg = JSON.parse(message);

    switch (msg.action) {
      case "ping":
        single(ws, { action: "pong" });
        break;

      case "getUser":
        getUser(msg.data.id).then((user) => {
          single(ws, { action: "userRes", data: user });
        });
        break;

      case "registerUser":
        registerUser(msg.data.id, msg.data.username, msg.data.passHash).then(
          (user) => {
            single(ws, { action: "registerRes", data: user });
          }
        );

      // case "fetchUser":
      //   if (users[msg.data.id] === undefined) {
      //     let user = { id: msg.data.id, cash: 1000, stocks: {} };
      //     users[msg.data.id] = user;
      //   }
      //   single(ws, { action: "userRes", data: users[msg.data.id] });
      //   break;

      case "setUser":
        users[msg.data.id] = msg.data;
        break;
      case "buy":
        console.log("buying", msg.cardId);
        break;
      case "sell":
        break;
      case "current_price":
        break;
      default:
        console.log("Unknown message type: " + msg.action);
    }
    console.log("users: ", users);
  });
});

function buyAsset() {
  // buy asset
}

const PORT = 8000;
app.get("/", (_req, res) => res.send("hello!"));
server.listen(PORT, () => console.log(`running on port ${PORT}`));
