import express from "express";
import cors from "cors";
import proxyRoutes from "./routes/proxyRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

app.use(proxyRoutes);

app.use(errorHandler);

export default app;
