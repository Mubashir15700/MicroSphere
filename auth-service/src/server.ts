import app from "./app";
import { PORT } from "./config/envConfig";

app.listen(PORT, () => {
  console.log(`Auth service listening on port ${PORT}`);
});
