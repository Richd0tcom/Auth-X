import PasswordSevice from "./PasswordService";
import Dev from "../models/devs.model";
import Product from "../models/product.model";
import crypto from "crypto";
import log from "../utils/logger";

class DevService {
  constructor() {}

  async register(reqEmail: string, reqName: string, reqPassword: string) {
    const exists = await Dev.findAll({
      where: {
        email: reqEmail,
      },
    });
    console.log("exists", exists);
    if (exists.length > 0) return "User already exists";

    const hashedPassword = await PasswordSevice.hash(reqPassword);

    const dev_id = `dev-${crypto.randomUUID()}`;

    const newDev = await Dev.create({
      name: reqName,
      email: reqEmail,
      password: hashedPassword,
      developer_id: dev_id,
    });
    console.log("new Developer", newDev);
    return newDev;
  }

  async login(email: string, password: string) {
    const exists = await Dev.findAll({
      where: {
        email: email,
      },
    });

    if (exists.length < 1) return "User does not exist";

    const pword = exists[0].getDataValue("password");
    const decoded = await PasswordSevice.compareHash(password, pword);

    if (!decoded) return "email or password mismatch";

    const name = exists[0].getDataValue("name");
    const eemail = exists[0].getDataValue("email");
    const dev_id = exists[0].getDataValue("developer_id");

    const projects = await Product.findAll({
      where: {
        developer_id: dev_id,
      },
    });

    return {
      name: name,
      email: eemail,
      dev_id: dev_id,
      projects: projects,
    };
  }

  async createProduct(productName: string, devId: string) {
    const productId = `prjct-${crypto.randomUUID()}`;
    const pk = crypto
      .createHmac("sha256", process.env.SESSION_SECRET as string)
      .update(productId)
      .digest("base64");
    try {
      const project = Product.create({
        product_name: productName,
        product_id: productId,
        product_key: pk,
        developer_id: devId,
      });

      return project;
    } catch (error) {
      console.error(error);
    }
  }

  deleteProduct = async function (productId: string, devId: string) {
    try {
      const re = await Product.findOne({
        where: {
          product_id: productId,
          developer_id: devId,
        },
      });

      if (re) {
        const s = await re.destroy();
        return s;
      }
    } catch (error) {
      log.error(error);
    }
  };
  updateRedirectUrl = async function (productId: string, url: string) {
    try {
      const re = await Product.findOne({
        where: {
          product_id: productId,
        },
      });

      if (re) {
        const s = await re.update({ redirect_url: url });
        return s;
      } else {
        return "could not update product url"
      }
    } catch (error) {
      log.error(error);
    }
  };

  //TO-DO 
  // products should have a column that shows the list of users that have signed up.
  // users should have a column that shows the list of apps they have signed up for. (UPDATE: can only be done in postgresql)
}

export default DevService;
