import express, { Express, Request, Response } from "express";
import UserService from "../../services/UserService";
import { RedisClientType, redisClient, Project } from "../../app";
import * as oauth from "../../services/OauthService";
import { OAuthCodeService } from "../../services/OauthService";
import projectMiddle from "../../middleware/validateProject";
import { isValid } from "../../middleware/authenticate";
const router = express.Router();

const OAuthCodeSer = new OAuthCodeService();


router.get(
  "/login",
  projectMiddle,
  async (req: Request, res: Response) => {
    //projectMiddle is a middleware for verifying the project

    req.session.project = req.project;

    res.status(200).json({msg: "LFG!!"})
    
  }
);
router.get('/', async (req, res) => {
  return res.render("index")
})

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
    console.log(req.session);

    // const projectId = req.project.id;
    // const scope = "profile";
    // const redirectUrl = "http://localhost:3000/api/v1/code";

    const url = `http://localhost:1337/api/v1/oauth/validate?projectKey=1YvaUlECuHCfFp3PNJNE/S8TWblZ4/w//PcV8fdoCEw=&redirectURL=localhost:1337/api/v1/oauth/`;

    res.redirect(url); // redirect to the consent page
    // return res.status(200).json({
    //   status: "success",
    //   data: resp,
    // });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "failed",
      data: error,
    });
  }
});

// when the users clicks login with oauth we send them here
router.get("/validate", projectMiddle, async (req: Request, res: Response) => {
  //projectMiddle is a middleware for verifying the project
    req.session.project = req.project
    const { name, id, redirect_url } = req.session.project as Project;
  
 
  const userId = req.session.user;
  if (!req.session.isAuth) {// if they are not logged in then redirect to the login page
    return res.redirect(`http://localhost:1337/api/v1/oauth/login?projectKey=${"1YvaUlECuHCfFp3PNJNE/S8TWblZ4/w//PcV8fdoCEw="}&redirectURL=${"localhost:1337/api/v1/oauth/"}`);
  }
  // const code= oauth.generateOAuthCode(id, redirect_url, userId)
  //this endpoint will contain a simple server rendered html page with the consent form and will make a post request to /validate
  res.send("Omo");
});

// when the users gives their consent we expect the form to land here
router.post("/validate", async (req: Request, res: Response) => {
  const { name, id, redirect_url } = req.session.project as Project;
  const userId = req.session.user as string;

  const code = oauth.generateOAuthCode(
    id,
    redirect_url,
    userId
  ) as oauth.OauthCode;

  const resp = await OAuthCodeSer.storeOauthCode(code);

  if (req.session.user === code.userId) {
    // need to make sure the user is who they claim to be
    // return res.redirect(code.redirectUrl + `?code=${code.value}`);
    console.log(code)
    console.log(resp)
    return res.redirect("http://localhost:1337/api/v1/oauth/")
  } else{
    res.send("check again o")
  }
});
router.get("/token", async (req: Request, res: Response) => {
  const service = new OAuthCodeService()
 
  const resp = await service.getOauthCode(req.query.code as string);
  console.log(resp)
  console.log(req.session)
  if (!resp) return res.status(404).end("Code not found");

  if (req.session.user == resp.userId && req.session.project?.id == resp.projectId) {
    const token = oauth.generateAccessToken(resp.userId, resp.projectId);
    return res.status(200).json({ token: token });
  } 
  return res.status(401).json({msg: "sometin wong"})
});
//protected oauth routes
router.get(
  "/users",
  isValid(),
  async (req: Request, res: Response) => {
    const userservice = new UserService();
    try {
      const userId = req.session.user as string
      const data = await userservice.getSingleUser(userId);

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "something went wong",
        data: error,
      });
    }
  }
);

module.exports = router;
