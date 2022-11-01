import { Request, Response } from "express";
import { CreateUserInput } from "../schema/user.schema";
import UserService from "../services/UserService";

import log from "../utils/logger";

export async function userLoginHandler(req: Request, res: Response) {
  const service = new UserService();
  try {
    const { email, password } = req.body;

    const user = await service.login(email, password);
    if (typeof user == "string") {
      return res.status(404).json({
        status: "failed",
        msg: "user not found",
      });
    }
    req.session.isAuth = true;
    req.session.user = req.body.email;
    console.log(req.session);
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (e: any) {
    log.error(e);
    return res.status(500).json({
      status: "failed",
      data: e,
    });
  }
}

export async function registerUserHandler(
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response
) {
  try {
    const service = new UserService();
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

export async function userUpdateHandler(req: Request, res: Response) {
  try {
    const service = new UserService();
    const { email, name, bio, photo_url } = req.body;

    const user = await service.updateUserDetails(email, name, bio, photo_url);
    return res.send(user);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
