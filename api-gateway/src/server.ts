import app from "./app";
import { PORT } from "./config/envConfig";

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
