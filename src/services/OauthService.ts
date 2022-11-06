import jwt from "jsonwebtoken";
import crypto from "crypto";

import { ProductType } from "../models/product.model";
import { RedisClientType, redisClient } from "../app";

export class OAuthStoreService {
  constructor() {
    // this.del = redisClient.del;
    this.storeOauthCode = this.storeOauthCode.bind(this);
    this.getOauthCode = this.getOauthCode.bind(this);
  }

  public async storeOauthCode(token: IOauthCode) {
    return await redisClient.set(token.value, JSON.stringify(token));
  }

  public async getOauthCode(tokenValue: any): Promise<IOauthCode | null> {
    const res = await redisClient.get(tokenValue);

    const code = JSON.parse(res as string);
    return code;
  }
}

export type UserId = string;
export type Scope = string;
export type ProjectId = string;
export type ProjectName = string;
export type AccessTokenValue = string;
export type AuthorizationCodeValue = string;

const TTL = 3600;

export interface IAccessToken {
  user: UserId;
  tlInSeconds: number;
  createdAt: number;
  projectId: ProjectId;
}
export interface IOauthCode {
  projectId: ProjectId;
  userId: UserId;
  scope: Scope;
  redirectUrl: string;
  createdAt: number;
  value: AuthorizationCodeValue;
}
export interface OAuthCodeResponse {
  userId: UserId;
  projectId: ProjectId;
  createdAt: number;
  redirectUrl: string;
}

export interface AccessTokenRequest {
  userId: UserId;
}

export const generateAccessToken = function (
  user: UserId,
  projectId: ProjectId
) {
  //modify
  return jwt.sign(
    {
      ttlInSeconds: TTL,
      createdAt: new Date().getTime(),
      user,
      projectId,
    },
    "secret"
  );
};
export const verifyAccessToken = async function (
  token: string
): Promise<IAccessToken | "Invalid signature"> {
  try {
    return jwt.verify(token, "secret") as IAccessToken;
  } catch (error) {
    return "Invalid signature";
  }
};

export const generateOAuthCode = function (
  projectId: ProjectId,
  redirectUrl: string,
  userId: UserId
) {
  return {
    userId,
    projectId,
    createdAt: new Date().getTime(),
    redirectUrl,
    value: crypto.randomBytes(128).toString("hex"),
  };
};
