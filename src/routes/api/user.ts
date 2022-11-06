import express, { Express, Request, Response } from "express";
import validate from "../../middleware/validateResource";
import {
  registerUserHandler,
  userLoginHandler,
  userUpdateHandler,
} from "../../controllers/user.controller";
import { createUserSchema } from "../../schema/user.schema";
import log from "../../utils/logger";
const router = express.Router();

router.post("/register", validate(createUserSchema), registerUserHandler);
router.post("/login", userLoginHandler);

router.put("/updateuser", userUpdateHandler);

router.post("/logout", async (req: Request, res: Response) => {
  try {
    req.session.isAuth = false;
    req.session.user = req.body.email;
    req.session.destroy(() => {
      log.info("session cleared");

      return res.status(200).json({
        status: "success",
      });
    });
  } catch (error) {
    log.error(error);
    return res.status(400).json({
      status: "failed",
    });
  }
});

module.exports = router;
