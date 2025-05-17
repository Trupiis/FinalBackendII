import dotenv from "dotenv";
import path from "path";
import __dirname from "./utils.js";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  SECRET_KEY: process.env.SECRET_KEY
};
