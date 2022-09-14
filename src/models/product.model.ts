import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../utils/connect'

const Product = db.define('products',{
    
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    product_key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permissions: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    product_photo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    redirect_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    developer_id: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    timestamps : false
  });

Product.sync();

export default Product;