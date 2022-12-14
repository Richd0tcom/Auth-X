import express, { Express, Request, Response } from "express";

import DevService from "../../services/DevService";
import validate from "../../middleware/validateResource";
import {
  registerUserHandler,
  userLoginHandler,
  userUpdateHandler,
} from "../../controllers/user.controller";
import { createUserSchema } from "../../schema/user.schema";
import log from "../../utils/logger";
const router = express.Router();

router.post("/dev/register", async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const devService = new DevService();
    const resp = await devService.register(email, name, password);

    if (typeof resp == "string") {
      return res.status(400).json({
        status: "failed",
        data: resp,
      });
    }

    return res.status(200).json({
      status: "success",
      data: resp,
    });
  } catch (error) {
    log.error(error);
    return res.status(400).json({
      status: "failed",
      data: error,
    });
  }
});

router.post("/dev/login", async (req: Request, res: Response) => {
  const devService = new DevService();
  const email = req.body.email;
  const password = req.body.password;

  try {
    const resp = await devService.login(email, password);

    if (typeof resp == "string") {
      return res.status(400).json({
        status: "failed",
        data: resp,
      });
    }
    req.session.isDev = true;
    req.session.devId = resp.dev_id;

    return res.status(200).json({
      status: "success",
      data: resp,
    });
  } catch (error) {
    log.error(error);
    return res.status(400).json({
      status: "failed something went wong",
      data: error,
    });
  }
});

module.exports = router;
