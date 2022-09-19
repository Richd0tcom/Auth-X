import jwt from "jsonwebtoken"
import crypto from "crypto"
import { ProductType } from "../models/product.model";

export type UserId = string;
export type Scope = string;
export type ProjectId = string;
export type ProjectName = string;
export type AccessTokenValue = string;

const TTL = 3600

export interface AccessToken {
    userId: UserId;
    tlInSeconds: number;
    createdAt: number;
    projectId: ProjectId
}
export interface OAuthCode {
    value: string
}
export interface OAuthCodeResponse {

        userId: UserId,
        projectId: ProjectId,
        createdAt: number,
        redirectUrl: string
     
}

// export interface AccessTokenResponse {
//     ttlInSeconds: number;
//     type: "Bearer";
//     accessToken: AccessTokenValue;
// }

export interface AccessTokenRequest {
    userId: UserId;
}

export const generateAccessToken = function(user: UserId, projectId: ProjectId){//modify
    return jwt.sign({
        ttlInSeconds: TTL,
        createdAt: new Date().getTime(),
        user,
        projectId,
    },"secret")
}
export const verifyAccessToken = function(token: string){
    return jwt.verify(token,"secret")
}
// export const getAccessTokenResponse = (accessToken: AccessTokenValue) => {//modify
//     return {
//       ttlInSeconds: TTL,
//       type: "Bearer",
//       accessToken
//     }
//   }

export const generateOAuthCode = function(projectId: ProjectId, redirectUrl: string, userId: UserId){
    return {
        userId,
        projectId,
        createdAt: new Date().getTime(),
        redirectUrl,
        value: crypto.randomBytes(128).toString("base64")
    } 
}
// export const AuthorizationCode = (projectId: ProjectId, redirectUrl: string, userId: UserId) => {
//     return {
//       userId,
//       projectId,
//       createdAt: new Date().getTime(),
//       value: crypto.randomBytes(128).toString("hex"),
//       redirectUrl
//     }
//   }

export function verifyOAuthcode(codeValue: any) {
   
}

