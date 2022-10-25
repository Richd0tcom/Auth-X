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

    res.render("login")
    
  }
);
router.get('/', async (req, res) => {
  return res.render("login")
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

    const url = `http://localhost:1337/api/v1/oauth/validate?projectKey=1YvaUlECuHCfFp3PNJNE_S8TWblZ4_w__PcV8fdoCEw=&redirectURL=localhost:1337/api/v1/oauth/`;

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
  try {
     
    req.session.project = req.project
    const { name, id, redirect_url } = req.session.project as Project;
    const pk = req.query.projectKey
    if (!req.session.isAuth) {// if they are not logged in then redirect to the login page
      return res.redirect(`http://localhost:1337/api/v1/oauth/login?projectKey=${pk}&redirectURL=${redirect_url}`);
    }
    // const service = new UserService()
  

    const userId = req.session.user;
    // const user = await service.getSingleUser(userId as string)// use this name to display on the template.
  
 
  
  
  // const code= oauth.generateOAuthCode(id, redirect_url, userId)
  //this endpoint will contain a simple server rendered html page with the consent form and will make a post request to /validate
  res.render("index", {
    project_name: name
  });
  } catch (error) {
    console.log("Error at /validate:",error)
  }
   
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
     console.log(req.session)
    req.session.save()
    return res.redirect(`http://127.0.0.1:5173?code=${code.value}`)
  } else{
    res.send("check again o")
  }
});
router.get("/token", async (req: Request, res: Response) => {

  const service = new OAuthCodeService()
 try {
  const resp = await service.getOauthCode(req.query.code as string);
  console.log(resp)
  console.log(req.session)
  if (!resp) return res.status(404).end("Code not found");

  if (resp.userId && resp.projectId) {
    const token = oauth.generateAccessToken(resp.userId, resp.projectId);
    return res.status(200).json({ token: token });
  }else{
    return res.status(401).json({msg: "please login"})
  }
 } catch (error) {
  console.log("I failed here")
  return res.status(401).json({msg: "sometin wong", err: error})
 }
  
  
});
//protected oauth routes
router.get(
  "/users",
  isValid(),
  async (req: Request, res: Response) => {
    const userservice = new UserService();
    try {
      const userId = req.session.user as string
      console.log(userId)
      const data = await userservice.getSingleUser(userId);
      console.log(data)
      if (typeof data != "string"){
        return res.status(200).json({
          users: data
        });
      }
      return res.status(400).json({msg: "could not find user"})
      
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
