import express from 'express';
import routes from './routes';
import db from './utils/connect';
import dotenv from 'dotenv';

dotenv.config()

const PORT = process.env.PORT  || 1337
const app = express();

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

// json parsing middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));


routes(app);

app.listen(PORT, ()=>{
    console.log('we up')
})