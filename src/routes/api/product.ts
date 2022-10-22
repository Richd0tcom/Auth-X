import express, { Express, Request, Response } from "express";
import { getProductsHandler, registerProductHandler, updateUrlHandler } from "../../controllers/product.controller";
import DevService from "../../services/DevService";

const router = express.Router();

router.post("/dev/createproduct", registerProductHandler);

router.post("/dev/updateurl", updateUrlHandler)

router.get("/dev/getproducts/:devid", getProductsHandler)
module.exports =  router;
