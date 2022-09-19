import { Express, Request, Response } from "express";
import { getSingleUser } from "./services/UserService";

import * as oauth from "./services/OauthService";

import projectMiddle from "./middleware/validateProject";
import { isValid } from "./middleware/authenticate";

export function oauths(app: Express) {
  app.get("/api/oauth/token", async (req: Request, res: Response) => {
    const userId = req.session.user as string;
    const pid = req.project.id;
    const token = oauth.generateAccessToken(userId, pid);
    res.json({ token: token });
  });

  app.get("/validate", projectMiddle, async (req: Request, res: Response) => {
    //projectMiddle is a middleware for verifying the project

    const { name, id, redirect_url } = req.project;
    const userId = req.session.user;

    // const code= oauth.generateOAuthCode(id, redirect_url, userId)

    res.end();
  });

  // when the users gives their consent we expect the form to land here
  app.post("/validate", isValid(), async (req: Request, res: Response) => {
    const { name, id, redirect_url } = req.project;
    const userId = req.session.user as string;

    const code = oauth.generateOAuthCode(id, redirect_url, userId);
    if (req.session.user) {
      // need to make sure the user is who they claim to be
      return res.redirect(code.redirectUrl + `?code=${code.value}`);
    }
  });

  //protected oauth routes
  app.get("/api/v1/users/:id", async (req: Request, res: Response) => {

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
