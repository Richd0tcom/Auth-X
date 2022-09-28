import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const db = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

// const db  = async ()=>{
//   try {
//       await sequelize.authenticate();
//       console.log('Connection has been established successfully.');
//   } catch (error) {
//       console.error('Unable to connect to the database:', error);
//   }
// }

export default db;
