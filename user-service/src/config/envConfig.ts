import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3002;
export const MONGO_URI =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_URI_TEST || "mongodb://localhost:27017/userDB_test"
    : process.env.MONGO_URI || "mongodb://mongo:27017/userDB";
export const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";
