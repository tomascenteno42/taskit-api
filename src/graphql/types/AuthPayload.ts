import { ObjectType, Field } from "type-graphql";

import { User as PrismaUser } from "@prisma/client";

import { User } from "./User";

@ObjectType()
export class AuthPayload {
    @Field()
    access_token!: string;

    @Field(type => User)
    user!: PrismaUser;
}