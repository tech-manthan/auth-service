import dotenv from "dotenv";

dotenv.config();

const { PORT, NODE_ENV } = process.env;

const CONFIG = Object.freeze({
  PORT,
  NODE_ENV,
});

export default CONFIG;
