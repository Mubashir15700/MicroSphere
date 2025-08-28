import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

function verifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth-service:3001",
    changeOrigin: true,
  })
);

app.use(
  "/users",
  verifyToken,
  createProxyMiddleware({
    target: "http://user-service:3002",
    changeOrigin: true,
  })
);

app.use(
  "/tasks",
  verifyToken,
  createProxyMiddleware({
    target: "http://task-service:3003",
    changeOrigin: true,
  })
);

app.use(
  (err: any, req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({
      error: true,
      message: err.message || "Internal Server Error",
    });
  }
);

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
