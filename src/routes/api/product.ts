import express, { Express, Request, Response } from "express";
import { rmSync } from "fs";
import DevService from "../../services/DevService";

const router = express.Router();

router.post("/dev/createproduct", async (req: Request, res: Response) => {
    const devService = new DevService();
    const pname = req.body.product_name;
    const dvId = req.session.devId;

    try {
      if (req.session.isDev) {
        const resp = await devService.createProduct(pname, dvId as string);

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
      } else {
        return res
          .status(400)
          .send("you are not authorized to modify this resource");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "failed something went wong",
        data: error,
      });
    }
  });

  router.post("/dev/updateurl", async (req: Request, res: Response)=>{
    const devService = new DevService();
    const url = req.body.redirect_url;
    const productId = req.body.product_id;

    try {
      const updateUrl = await devService.updateRedirectUrl(productId, url);
      if (typeof updateUrl == "string"){
        return res.status(400).json({msg: "failed to update redirect url"})
      }
      return res.status(201).json({msg:"url updated"})

    } catch (errors) {
      return res.status(500).json({msg :"something went wong"})
    }
  })
module.exports =  router;
