import Koa from "koa";
import { configDotenv } from "dotenv";
configDotenv();
const app = new Koa();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`);
});
