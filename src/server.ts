import express from "express";
import routes from "./routes";
import db from "./utils/connect";
import session from "express-session";
import dotenv from "dotenv";
import { createClient } from "redis";
import RS from "connect-redis";
import { oauths } from "./oauthRoutes";
import log from "./utils/logger";
import cors from "cors";

export const redisClient = createClient({ legacyMode: true });

export type RedisClientType = typeof redisClient;

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient
  .connect()
  .then(() => console.log("Redis Connected"))
  .catch((err) => console.log("redis error", err));

const RedisStore = RS(session);

declare module "express-session" {
  interface SessionData {
    isAuth: boolean;
    user: string;
    isDev: boolean;
    devId: string;
  }
}

dotenv.config();

const PORT = process.env.PORT || 1337;
const app = express();

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

app.use(
  cors({
    origin: "*",
  })
);
// json parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
);

routes(app);
oauths(app);

app.listen(PORT, () => {
  log.info("we up");
});
