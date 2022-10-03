import jwt from "jsonwebtoken";
import crypto from "crypto";

import { ProductType } from "../models/product.model";
import { createClient } from "redis";
import { RedisClientType, redisClient } from "../app";

import { promisify } from "util";

export class OAuthCodeService {
  constructor(redisClient: RedisClientType) {
    // this.del = redisClient.del;
    this.storeOauthCode = this.storeOauthCode.bind(this);
    this.getOauthCode = this.getOauthCode.bind(this);
  }

  public storeOauthCode(token: OauthCode) {
    return redisClient.set(token.value, JSON.stringify(token));
  }

  public async getOauthCode(tokenValue: string): Promise<OauthCode | null> {
    const json = (await redisClient.get(tokenValue)) as string;
    return JSON.parse(json) as OauthCode;
  }
}

export type UserId = string;
export type Scope = string;
export type ProjectId = string;
export type ProjectName = string;
export type AccessTokenValue = string;
export type AuthorizationCodeValue = string;

const TTL = 3600;

export interface AccessToken {
  userId: UserId;
  tlInSeconds: number;
  createdAt: number;
  projectId: ProjectId;
}
export interface OauthCode {
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
export const verifyAccessToken = function (token: string) {
  return jwt.verify(token, "secret");
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
    value: crypto.randomBytes(128).toString("base64"),
  };
};
