import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import { User } from "../src/models/userModel";

describe("User Service", () => {
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "securepass123",
  };

  let token: string;
  let userId: string;

  const MONGO_URI_TEST = process.env.MONGO_URI_TEST || "";

  beforeAll(async () => {
    await mongoose.connect(MONGO_URI_TEST);
  });

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const res = await request(app).post("/users").send(testUser);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.email).toBe(testUser.email);
    });

    it("should fail to create user with existing email", async () => {
      await request(app).post("/users").send(testUser);
      const res = await request(app).post("/users").send(testUser);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /users/email/:email", () => {
    it("should return user by email", async () => {
      await request(app).post("/users").send(testUser);
      const res = await request(app).get(`/users/email/${testUser.email}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app).get("/users/email/unknown@example.com");
      expect(res.status).toBe(404);
    });
  });

  describe("GET / (all users, protected)", () => {
    beforeEach(async () => {
      const user = await request(app).post("/users").send(testUser);
      userId = user.body.id;
      // simulate token signing (should match your JWT secret)
      const jwt = require("jsonwebtoken");
      token = jwt.sign(
        { id: userId, email: testUser.email },
        process.env.JWT_SECRET || "jwt_secret_key",
        { expiresIn: "1h" }
      );
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(401);
    });

    it("should return all users with token", async () => {
      const res = await request(app)
        .get("/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /:id (protected)", () => {
    beforeEach(async () => {
      const user = await request(app).post("/users").send(testUser);
      userId = user.body.id;
      const jwt = require("jsonwebtoken");
      token = jwt.sign(
        { id: userId, email: testUser.email },
        process.env.JWT_SECRET || "jwt_secret_key",
        { expiresIn: "1h" }
      );
    });

    it("should return user by ID", async () => {
      const res = await request(app)
        .get(`/${userId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.email).toBe(testUser.email);
    });

    it("should return 404 if user not found", async () => {
      const invalidId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/${invalidId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(404);
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get(`/${userId}`);
      expect(res.status).toBe(401);
    });
  });
});
