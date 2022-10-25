import express from "express";
import session from "express-session";
// import { redisClient } from "./server";
import Redis from "ioredis";
import RS from "connect-redis";
import cors from "cors";
import router from "./routes"
import path from "path";
import log from "./utils/logger";


const RedisStore = RS(session);

declare module "express-session" {
  interface SessionData {
    isAuth: boolean;
    user: string;
    isDev: boolean;
    devId: string;
    project: Project;
  }
}
export type Project = {
  name: string;
  id: string;
  redirect_url: string;
}
export const redisClient = new Redis();
console.log(redisClient.status)

export type RedisClientType = typeof redisClient;

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", ()=> log.info("Connected to Redis Server"))

// redisClient
//   .connect()
//   .then(() => console.log("Redis Connected"))
//   .catch((err) => console.log("redis error", err));

const app = express();
 
app.use(
  cors({
    origin: "*",
  })
);
// json parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')))
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));
app.use(
  session({
    store: new RedisStore({
      client: redisClient,
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);


app.use(router)

export default app;