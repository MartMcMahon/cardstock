const WebSocket = require("ws");

const app = require("express")();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
const mongo = require("mongodb");

const uri = "mongodb://localhost/cardstock?retryWrites=true&w=majority";
const client = new mongo.MongoClient(uri);

// const printDB = async () => {
//   await client.connect();
//   const users = client.db("cardstock").collection("users");
//   console.log("users: ", users);
// };

const getUser = async (id) => {
  await client.connect();
  const users = client.db("cardstock").collection("users");
  const user = await users.findOne({ id });
  return user;
};

const login = async (username, passHash) => {
  // TODO: security logic
  return getUser(username).then((user) => {
    if (user.passHash === passHash) {
      return { user_id: user.id, username: user.username, token: "token" };
    } else {
      return { error: "Invalid password" };
    }
  });
};

const auth = async (username, token) => {
  await client.connect();
  const users = client.db("cardstock").collection("users");
  let user = await users.findOne({ id: username });
  if ( !user ) {
    user = {id: "", token: ""};
  }
  if (user.token === token) {
    return user;
  }
  return { error: "Invalid token" };
};

const registerUser = async (id, username, passHash) => {
  await client.connect();
  const users = client.db("cardstock").collection("users");
  const user = await users.findOne({ id });
  if (user) {
    return { error: "User already exists" };
  }
  await users.insertOne({ id, username, passHash, token: "token" });
  return { id, username, passHash };
};

const buyCard = async (user_id, card_id, amount) => {
  await client.connect();
  const users = client.db("cardstock").collection("users");
  const user = await users.findOne({ id: user_id });
  if (!user) {
    return { error: "User not found" };
  }
  const position = user.cards[card_id];
  position[amount] += 1;
  // TODO: update avg price

  // user.cards[card_id]  amount });

  const card = await user.cards.findOne({ id: card_id });
  if (!card) {
    return { error: "Card not found" };
  }
  if (card.amount < amount) {
    return { error: "Not enough cards" };
  }
  await user.cards.updateOne({ id: cardId }, { $inc: { amount: -amount } });
  return { id: card_id, amount };
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
  single(ws, { action: "connected" });
  ws.on("message", (message) => {
    console.log("received: %s", message);
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

      case "loginWithCreds":
        login(msg.usernameInput, msg.passwordInput).then((user) => {
          single(ws, { action: "auth", user });
        });
        break;

      case "loginWithToken":
        auth(msg.username, msg.token).then((user) => {
          single(ws, { action: "auth", user });
        });
        break;

      case "registerNewUser":
        registerUser(msg.user_id, msg.username, msg.passHash).then((user) => {
          single(ws, { action: "registerSuccess", data: user });
        });

      // case "fetchUser":
      //   if (users[msg.data.id] === undefined) {
      //     let user = { id: msg.data.id, cash: 1000, stocks: {} };
      //     users[msg.data.id] = user;
      //   }
      //   single(ws, { action: "userRes", data: users[msg.data.id] });
      //   break;

      case "setUser":
        users[msg.id] = msg.data;
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
