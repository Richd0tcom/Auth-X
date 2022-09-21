import { Express, Request, Response } from "express";
import { getSingleUser, login } from "./services/UserService";
import { RedisClientType, redisClient } from "./server";
import * as oauth from "./services/OauthService";
import { OAuthCodeService } from "./services/OauthService";
import projectMiddle from "./middleware/validateProject";
import { isValid } from "./middleware/authenticate";



 const OAuthCodeSer = new OAuthCodeService(redisClient)


export function oauths(app: Express) {

    // when the users clicks login with oauth we send them here
    app.get("/oauth/login", projectMiddle, async (req: Request, res: Response) => {
        //projectMiddle is a middleware for verifying the project
    
        const { name, id, redirect_url } = req.project;
        const userId = req.session.user;
    
        // const code= oauth.generateOAuthCode(id, redirect_url, userId)
    
        res.end({name});
      });
    
      //Next they fill in their details
    app.post("/oauth/login", async (req: Request, res: Response) => {
    // we declare what resources we want to access
        
    const email = req.body.email;
    const password = req.body.password;

    try {

        const resp = await login(email, password)

        if(typeof resp == "string"){
            return res.status(400).json({
                status: "failed",
                data: resp,
            })
        }
        req.session.isAuth = true
        req.session.user = req.body.email
        console.log(req.session)


        const projectId = req.project.id;
        const scope = "profile";
        const redirectUrl = "http://localhost:3001/api/v1/code";


        const url = `http://localhost:3000/validate?projectId=${projectId}&scope=${scope}&redirectUrl=${redirectUrl}`;

        res.redirect(url);// redirect to the consent page
        return res.status(200).json({
            status: "success",
            data: resp,
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            status: "failed",
            data: error,
        })
    }
    
    });

  app.get("/validate", projectMiddle, async (req: Request, res: Response) => {
    //projectMiddle is a middleware for verifying the project

    const { name, id, redirect_url } = req.project;
    const userId = req.session.user;

    // const code= oauth.generateOAuthCode(id, redirect_url, userId)

    res.end({name});
  });

  // when the users gives their consent we expect the form to land here
  app.post("/validate", async (req: Request, res: Response) => {

    const { name, id, redirect_url } = req.project;
    const userId = req.session.user as string;

    const code = oauth.generateOAuthCode(id, redirect_url, userId) as oauth.OauthCode ;

    await OAuthCodeSer.storeOauthCode(code) 

    if (req.session.user === code.userId) {
      // need to make sure the user is who they claim to be
      return res.redirect(code.redirectUrl + `?code=${code.value}`);
    }
  });
  app.get("/api/oauth/token", async (req: Request, res: Response) => {
    const resp = await OAuthCodeSer.getOauthCode(req.query.code as string)
    if(!resp) return res.status(404).end("Code not found");

    if(req.session.user == resp.userId && req.project.id==resp.projectId){
        const token = oauth.generateAccessToken(resp.userId, resp.projectId);
        return res.json({ token: token });
    }
    
  });
  //protected oauth routes
  app.get("/api/v1/users/:id", isValid(), async (req: Request, res: Response) => {

    try {
        const authToken = req.headers.authorization;
    if (!authToken) return res.status(400).end("Missing auth token");

    const tokenValue = authToken.split(" ")[1] as oauth.AccessTokenValue;
    const token = await oauth.verifyAccessToken(tokenValue) as oauth.AccessToken;
    if (!token) return res.status(404).end("404");

    const data = await getSingleUser(token.userId)

    res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "something went wong",
            data: error
        })
    }
    
  });
}
