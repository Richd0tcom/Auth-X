import DevService from "../services/DevService";
import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";

import log from "../utils/logger";

export async function developerLoginHandler(req: Request, res: Response) {
  const service = new DevService();
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
  const service = new DevService();
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
