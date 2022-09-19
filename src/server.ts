import express from 'express';
import routes from './routes';
import db from './utils/connect';
import session from 'express-session'
import dotenv from 'dotenv';
import { createClient } from 'redis';
import RS from 'connect-redis';
import crypto from 'crypto'
import { oauths} from "./oauthRoutes"



const redisClient = createClient({ legacyMode: true})

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().then(()=>console.log("Redis Connected")).catch((err)=> console.log('redis error', err));

const RedisStore = RS(session)

declare module "express-session" {
    interface SessionData {
      isAuth: boolean,
      user: string,
      isDev: boolean,
      devId: string,
    }
  }

dotenv.config()

const PORT = process.env.PORT  || 1337
const app = express();

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

// json parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    store: new RedisStore({
        client: redisClient
    }),
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized:false

}))


routes(app);
oauths(app);

app.listen(PORT, ()=>{
    console.log('we up')
    const hash = crypto
      .createHmac("sha256", process.env.SESSION_SECRET as string)
      .update(crypto.randomUUID())
      .digest("base64");

      console.log(hash)
})


