import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3002;
export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://mongo:27017/userDB";
