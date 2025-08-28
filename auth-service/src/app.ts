import express from "express";
import authRoutes from "./routes/authRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());
app.use(authRoutes);
app.use(errorHandler);

export default app;
