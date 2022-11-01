import express, { Express, Request, Response } from "express";
import validate from "../../middleware/validateResource";
import {
  registerUserHandler,
  userLoginHandler,
  userUpdateHandler,
} from "../../controllers/user.controller";
import { createUserSchema } from "../../schema/user.schema";
const router = express.Router();

router.post("/register", validate(createUserSchema), registerUserHandler);
router.post("/login", userLoginHandler);

router.put("/updateuser", userUpdateHandler);

router.post("/logout", async (req: Request, res: Response) => {
  try {
    req.session.isAuth = false;
    req.session.user = req.body.email;
    req.session.destroy(() => {
      console.log("session cleared");
      console.log(req.session);
      return res.status(200).json({
        status: "success",
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
    });
  }
});

module.exports = router;
