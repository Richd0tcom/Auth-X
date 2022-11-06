import db from "./utils/connect";
import dotenv from "dotenv";
import log from "./utils/logger";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 1337;

db.authenticate()
  .then(() => log.info("Database connected..."))
  .catch((err) => log.error("Error: " + err));

app.listen(PORT, () => {
  log.info("we up");
});
