import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";
const USER_SERVICE_URL = "http://user-service:3002";

app.use(express.json());

app.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ message: "Name, email and password required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await axios.post(`${USER_SERVICE_URL}/users`, {
      name,
      email,
      password: hashedPassword,
    });

    const user = response.data;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      return res
        .status(400)
        .json({ message: "User already exists or invalid data" });
    }
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/users/email/${email}`
    );
    const user = response.data;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(500).json({ message: error.message });
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
