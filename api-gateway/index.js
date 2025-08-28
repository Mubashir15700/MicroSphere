const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";

function verifyToken(req, res, next) {
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

app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});
