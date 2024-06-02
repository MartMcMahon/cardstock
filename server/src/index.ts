import express from "express";
import pool from "./database";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
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
