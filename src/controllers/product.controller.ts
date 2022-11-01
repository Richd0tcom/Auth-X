import DevService from "../services/DevService";
import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import log from "../utils/logger";

export async function registerProductHandler(req: Request, res: Response) {
  const service = new DevService();
  try {
    const { name } = req.body;
    if (req.session.isDev) {
      const devId = req.session.devId;
      const product = await service.createProduct(name, devId as string);

      if (typeof product == "string") {
        return res.status(400).json({
          status: "failed",
          data: product,
        });
      }

      return res.status(200).json({
        status: "success",
        data: product,
      });
    } else {
      return res
        .status(400)
        .send("you are not authorized to modify this resource");
    }
  } catch (e: any) {
    log.error(e);
    return res.status(400).json({
      status: "failed",
      data: e,
    });
  }
}

export async function updateUrlHandler(req: Request, res: Response) {
  const service = new DevService();
  try {
    const { redirect_url, product_id } = req.body;

    const product = await service.updateRedirectUrl(product_id, redirect_url);
    if (typeof product == "string") {
      return res.status(400).json({ msg: "failed to update redirect url" });
    }
    return res.status(201).json({ msg: "url updated" });
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getProductsHandler(req: Request, res: Response) {
  const dev = req.params.devid;
  const service = new DevService();
  try {
    const products = await service.getProducts(dev);
  } catch (error) {}
}
