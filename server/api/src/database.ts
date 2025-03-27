import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({path: "../.env"});
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: parseInt(process.env.PORT as string),
});
export default pool;
