import * as jwt from "jsonwebtoken";

import { User } from "@prisma/client"

export type TokenData = {
    uid: User["id"];
}

export const SignUserToken = (id: User["id"]) => {
    return jwt.sign({ uid: id }, process.env.JWT_SECRET as jwt.Secret)
}

export const DecodeUserToken = (token: string): TokenData => {
    return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as TokenData
}