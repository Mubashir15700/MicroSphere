import mongoose from "mongoose";
import app from "./app";
import { PORT, MONGO_URI } from "./config/envConfig";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});
