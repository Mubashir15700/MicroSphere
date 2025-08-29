import { Router, Request, Response } from "express";
import { User } from "../models/userModel";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// Create new user (used by auth-service)
router.post("/users", async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Error creating user" });
  }
});

// Get user by email (used by auth-service)
router.get(
  "/users/email/:email",
  async (req: Request, res: Response) => {
    try {
      const user = await User.findOne({ email: req.params.email });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error fetching user" });
    }
  }
);

// Get all users (exclude passwords)
router.get("/", verifyToken, async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error fetching users" });
  }
});

// Get user by ID (exclude password)
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error fetching user" });
  }
});

export default router;
