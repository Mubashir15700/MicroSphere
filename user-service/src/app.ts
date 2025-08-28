import express from "express";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());

app.use("/", userRoutes);

app.use(errorHandler);

export default app;
