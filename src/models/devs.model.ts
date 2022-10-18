import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import db from "../utils/connect";
import Product from "./product.model";

const Dev = db.define(
  "devs",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    developer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

// Product.belongsTo(Dev)
Dev.hasMany(Product, {
  foreignKey: "developer_id",
});

Product.belongsTo(Dev)
Dev.sync();

export default Dev;
