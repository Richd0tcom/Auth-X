import express from "express";
import session from "express-session";
import { redisClient } from "../server";
import RS from "connect-redis";
import cors from "cors";
import router from "./routes"


const RedisStore = RS(session);

declare module "express-session" {
  interface SessionData {
    isAuth: boolean;
    user: string;
    isDev: boolean;
    devId: string;
  }
}


const app = express();

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

app.use(router)

export default app;