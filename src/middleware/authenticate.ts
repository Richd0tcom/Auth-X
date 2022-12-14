import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import Dev from "../models/devs.model";
import jwt, { JwtPayload } from "jsonwebtoken";

import * as oauthService from "../services/OauthService";

//write middleware for checking if acces token is valid
export const isValid =
  (...scopes: oauthService.Scope[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;

    if (!auth) {
      return res.status(401).json({ msg: "Missing accessToken" });
    }

    const tokenValue = auth.split(" ")[1] as oauthService.AccessTokenValue;
    const token = (await oauthService.verifyAccessToken(
      tokenValue
    )) as oauthService.IAccessToken;

    if (!token || typeof token == "string") {
      return res.status(404).json({ msg: "could not verify token" });
    }

    req.session.user = token.user;
    // if (hasExpired(token))
    //   return res.status(401).json({ msg: "Token expired" });

    // const tokenScopes = token.scope.split(" ");
    // const hasScope = scopes
    //   .filter(scope => !isTemplate(scope))
    //   .every(scope => tokenScopes.includes(scope));

    // const canAccessResource = scopes.every((scope, i, self) => {
    //   if(!isTemplate(scope)) return true;
    //   const resourceName = self[i - 1];
    //   const resourceIdIndex = tokenScopes.indexOf(resourceName) + 1; // assume <resource> <id>
    //   const resourceId = tokenScopes[resourceIdIndex];
    //   const paramId = req.params[scope.replace(":", "")]; // remove ":" so template name matches param

    //   // if both param id and token id are defined and they are the same
    //   return (resourceId && paramId) && resourceId === paramId;
    // });

    // if(hasScope && canAccessResource) {
    //   return next();
    // }

    // return res.status(401).json({msg: "Token does not contain needed scope"});

    return next();
  };

const isTemplate = (str: string) => {
  return /^:/.test(str);
};

export const hasExpired = (token: oauthService.IAccessToken) => {
  const now = Date.now();
  const expiresAt = token.createdAt + token.tlInSeconds * 1000;
  return now > expiresAt;
};
