import express from "express";
import { Express, Request, Response, NextFunction } from "express";
const router = express.Router();



/*ping*/
router.get("/ss", async (req: Request, res: Response) => {
    res.sendStatus(200);
  }); 

/* user and developer endpoints */
router.use("/api/v1/users", require("./api/user"));
router.use("/api/v1/dev", require("./api/dev"));
router.use("/api/v1/product", require("./api/product"));



/*
/*Oauth2.0 endpoints */
router.use("/api/v1/oauth", require("./oauth2.0/oauth"))
export default router;