import express from "express";
import bodyParser from "body-parser";
import taskRoutes from "./routes/taskRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", taskRoutes);

app.use(errorHandler);

export default app;
