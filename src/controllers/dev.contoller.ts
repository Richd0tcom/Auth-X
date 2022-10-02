import DevService from "../services/DevService";
import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";



import log from "../utils/logger";

export async function developerLoginHandler(req: Request, res: Response) {
    const service = new DevService()
  try {
    const { email, password } = req.body;

    const user = await service.login(email, password);
    if (typeof user == "string") {
      return res.status(400).json({
        status: "failed",
        data: user,
      });
    }
    req.session.isDev = true;
    req.session.devId = user.dev_id;
    console.log(req.session);
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(400).json({
      status: "failed",
      data: e,
    });
  }
}

export async function registerDeveloperHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
    const service = new DevService()
  try {
    const { email, name, password } = req.body;

    const user = await service.register(email, name, password);

    if (typeof user == "string") {
      return res.status(400).json({
        status: "failed",
        data: user,
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(400).json({
      status: "failed",
      data: e,
    });
  }
}

export async function registerProductHandler(
    req: Request,
    res: Response
  ) {
      const service = new DevService()
    try {
      const { name } = req.body;
      if(req.session.isDev){

        const devId = req.session.devId
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
    const service = new DevService()
  try {
    const { redirect_url, product_id } = req.body;

    const product = await service.updateRedirectUrl(product_id, redirect_url);
    return res.send(product);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
