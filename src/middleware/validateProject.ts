import Product from "../models/product.model";
import { Request, Response, NextFunction } from "express";

declare module "express-serve-static-core" {
  interface Request {
    project?: any;
  }
}

const projectMiddle = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const projectKey = req.query.projectKey;
  const redirectURL = req.query.redirectURL;
  // const scope = req.query.scope;

  try {
    const project = await Product.findOne({
      where: {
        product_key: projectKey,
      },
    });

    if (!project) {
      return new Error("project does not exist");
    } else if (project.getDataValue("redirect_url") != redirectURL) {
      return new Error("redirect_url incorrect mismatch");
    }

    req.project = {
      name: project.getDataValue("product_name"),
      id: project.getDataValue("product_id"),
      redirect_url: redirectURL,
    };
    next();
  } catch (error: any) {
    if (error.code) {
      res.status(error.code).send(error);
    } else {
      res.status(500).send({ message: "Unknown Error" });
    }
  }
};

export default projectMiddle;
