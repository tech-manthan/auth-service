import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

const {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
  REFRESH_TOKEN_SECRET,
  JWKS_URI,
  PRIVATE_KEY,
} = process.env;

const CONFIG = Object.freeze({
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  ACCESS_MAX_AGE,
  REFRESH_MAX_AGE,
  REFRESH_TOKEN_SECRET,
  JWKS_URI,
  PRIVATE_KEY,
});

export default CONFIG;
