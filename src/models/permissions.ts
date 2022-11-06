import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../utils/connect";
import log from "../utils/logger";

const Permission = db.define(
  "permissions",
  {
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
Permission.removeAttribute("id");
Permission.sync().then(() => log.info("permissions table synced"));

export default Permission;
