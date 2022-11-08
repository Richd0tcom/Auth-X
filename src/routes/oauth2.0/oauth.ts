import express, { Request, Response } from "express";
import UserService from "../../services/UserService";
import { Project } from "../../app";
import * as oauthService from "../../services/OauthService";
import projectMiddle from "../../middleware/validateProject";
import { isValid } from "../../middleware/authenticate";
import log from "../../utils/logger";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const oAuthCodeService = new oauthService.OAuthStoreService();

router.get("/login", projectMiddle, async (req: Request, res: Response) => {
  //projectMiddle is a middleware for verifying the project

  req.session.project = req.project;

  res.render("login");
});
router.get("/", async (req, res) => {
  return res.render("login");
});

//Next they fill in their details
router.post("/login", async (req: Request, res: Response) => {
  // we declare what resources we want to access
  const userservice = new UserService();
  const email = req.body.email;
  const password = req.body.password;

  try {
    const resp = await userservice.login(email, password);

    if (typeof resp == "string") {
      return res.status(400).json({
        status: "failed",
        data: resp,
      });
    }
    req.session.isAuth = true;
    req.session.user = req.body.email;

    // const projectId = req.project.id;
    // const scope = "profile";
    // const redirectUrl = "http://localhost:3000/api/v1/code";

    const url = `${process.env.BASE_API_URL}/api/v1/oauth/validate`

    res.redirect(url); // redirect to the consent page
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      data: error,
    });
  }
});

// when the users clicks login with oauth we send them here
router.get("/validate", projectMiddle, async (req: Request, res: Response) => {
  //projectMiddle is a middleware for verifying the project
  try {
    const service = new UserService();
    req.session.project = req.project;
    const { name, id, redirect_url } = req.session.project as Project;
    const pk = req.query.projectKey;
    if (!req.session.isAuth) {
      // if they are not logged in then redirect to the login page
      return res.redirect(
        `${process.env.BASE_API_URL}/api/v1/oauth/login?projectKey=${pk}&redirectURL=${redirect_url}`
      );
    }
    const userId = req.session.user as string;
    const r = await service.getSingleUser(userId);
    const meta = typeof r != "string" ? r : null;
    const isPermitted = await service.checkPermissions(userId, id);
    if (isPermitted) {
      const code = oauthService.generateOAuthCode(
        id,
        redirect_url,
        userId
      ) as oauthService.IOauthCode;

      const resp = await oAuthCodeService.storeOauthCode(code);

      if (req.session.user === code.userId) {
        // need to make sure the user is who they claim to be
        // return res.redirect(code.redirectUrl + `?code=${code.value}`);
        req.session.save();
        return res.redirect(`${redirect_url}?code=${code.value}`);
      }
    }

    // const user = await service.getSingleUser(userId as string)// use this name to display on the template.

    // const code= oauth.generateOAuthCode(id, redirect_url, userId)
    //this endpoint will contain a simple server rendered html page with the consent form and will make a post request to /validate
    res.render("consent", {
      project_name: name,
      user_name: meta?.name,
      user_photo: meta?.photo,
    });
  } catch (error) {
    log.error("Error at /validate:", error);
  }
});

// when the users gives their consent we expect the form to land here
router.post("/validate", async (req: Request, res: Response) => {
  const service = new UserService();
  const { name, id, redirect_url } = req.session.project as Project;
  const userId = req.session.user as string;

  const code = oauthService.generateOAuthCode(
    id,
    redirect_url,
    userId
  ) as oauthService.IOauthCode;

  const resp = await oAuthCodeService.storeOauthCode(code);
  await service.addPermission(userId, id);

  if (req.session.user === code.userId) {
    // need to make sure the user is who they claim to be
    // return res.redirect(code.redirectUrl + `?code=${code.value}`);
    req.session.save();
    return res.redirect(`${redirect_url}?code=${code.value}`);
  } else {
    res.send("check again o");
  }
});
router.get("/token", async (req: Request, res: Response) => {
  const service = new oauthService.OAuthStoreService();
  try {
    const resp = await service.getOauthCode(req.query.code as string);
    if (!resp) return res.status(404).end("Code not found");

    if (resp.userId && resp.projectId) {
      const token = oauthService.generateAccessToken(
        resp.userId,
        resp.projectId
      );
      return res.status(200).json({ token: token });
    } else {
      return res.status(401).json({ msg: "please login" });
    }
  } catch (error) {
    return res.status(401).json({ msg: "sometin wong", err: error });
  }
});
//protected oauth routes
router.get("/users", isValid(), async (req: Request, res: Response) => {
  const userservice = new UserService();
  try {
    const userId = req.session.user as string;
    const data = await userservice.getSingleUser(userId);
    if (typeof data != "string") {
      return res.status(200).json({
        users: data,
      });
    }
    return res.status(400).json({ msg: "could not find user" });
  } catch (error) {
    res.status(500).json({
      msg: "something went wong",
      data: error,
    });
  }
});

module.exports = router;
