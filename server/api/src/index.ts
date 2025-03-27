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

app.post("/buy/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    const { uid, amount, cost } = req.body;
    // const date = Math.floor(Date.now() / 1000);
    const now = new Date(Date.now());
    const trade_date = now.toISOString();
    const _tx_query = await pool.query(
      "INSERT INTO transactions (uid, uuid, amount, cost, trade_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [uid, uuid, amount, cost, trade_date]
    );
    // const card_pos_query = await pool.query(
    //   `UPDATE users SET
    // card_positions = jsonb_set(
    // jsonb_set(card_positions, '{${uuid}, amount}', '${amount}', true
    // ), '{${uuid}, cost}', '${cost}', true)
    // WHERE uid = '${uid}';`
    // );
    // console.log("updated users", card_pos_query, amount);
    // res.json(card_pos_query.rows);
    // } catch (err) {
    //   console.error(err);
    //   res.status(500).send("Server error");
    // }
    return res.json(_tx_query.rows);
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
};

app.get("/tx/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await getTransactionsForUser(uid);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

