import express, { Request, Response } from "express";
import Redis from "ioredis";
import cors from "cors";

const app = express();
const redis = new Redis();

app.use(cors());
app.use(express.json());

app.post("/set", async (req: Request, res: Response) => {
  const { key, value } = req.body;
  try {
    await redis.set(key, value);
    res.send("Key set");
  } catch (err: any) {
    res.status(500).send(err.toString());
  }
});

app.get("/get", async (req: Request, res: Response) => {
  const { key } = req.query;
  try {
    const value = await redis.get(key as string);
    res.send(`Value: ${value}`);
  } catch (err: any) {
    res.status(500).send(err.toString());
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
