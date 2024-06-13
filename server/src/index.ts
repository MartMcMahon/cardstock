import express from "express";
import cors from "cors";
import pool from "./database";

const app = express();
const port = 3000;

const corsOptions = {
  origin: true,
};
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/user/:uid", async (req, res) => {
  try {
    const { uid, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (uid, email) VALUES ($1, $2);",
      [uid, email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/user/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE uid = $1", [
      uid,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/card/:card_id", async (req, res) => {
  try {
    const { card_id } = req.params;
    const result = await pool.query(
      `SELECT cards.*, cardidentifiers.scryfallid
FROM cards
INNER JOIN cardidentifiers ON cards.uuid = cardidentifiers.uuid
WHERE cards.uuid = $1;`,
      [card_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/buy/:uid", async (req, res) => {
  try {
    const { uid, uuid, amount, cost } = req.params;
    const date = Math.floor(Date.now() / 1000);
    const res = await pool.query(
      "INSERT INTO transactions (uid, uuid, amount, cost, date) VALUES ($1, $2, $3, $4, $5);",
      [uid, uuid, amount, cost, date]
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/card/:card_id/scryfall", async (req, res) => {
  try {
    const { card_id } = req.params;
    const result = await pool.query(
      "SELECT (scryfallid) FROM cardidentifiers WHERE uuid = $1",
      [card_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/price_history/:card_id", async (req, res) => {
  try {
    const { card_id } = req.params;
    const result = await pool.query(
      "SELECT * FROM price_history WHERE mtg_json_id = $1",
      [card_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

const getTransactionsForUser = async (uid: string) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE uid = $1",
      [uid]
    );
    return result.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

