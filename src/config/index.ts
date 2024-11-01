import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const { PORT, NODE_ENV, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } =
  process.env;

const CONFIG = Object.freeze({
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
});

export default CONFIG;
