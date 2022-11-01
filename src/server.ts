import db from "./utils/connect";
import dotenv from "dotenv";
import crypto from "crypto";
import log from "./utils/logger";
import app from "./app";

// export const redisClient = createClient({ legacyMode: true });

// export type RedisClientType = typeof redisClient;

// redisClient.on("error", (err) => console.log("Redis Client Error", err));

// redisClient
//   .connect()
//   .then(() => console.log("Redis Connected"))
//   .catch((err) => console.log("redis error", err));

dotenv.config();

const PORT = process.env.PORT || 1337;

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

app.listen(PORT, () => {
  log.info("we up");
});
