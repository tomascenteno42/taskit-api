import { Resolver, Mutation, Arg, Ctx, Query, Authorized } from "type-graphql";

import { UserInputError, AuthenticationError } from "apollo-server-core";

import { AuthPayload } from "@graphql/types/AuthPayload";
import { User } from "@graphql/types/User";

import { RegisterInput } from "@graphql/inputs/RegisterInput";
import { LoginInput } from "@graphql/inputs/LoginInput";

import { Context } from "@utils/context";
import { inputError } from "@utils/error";
import { Hash, PasswordsMatch } from "@utils/hash";
import { SignAuthPayload } from "@utils/auth";

@Resolver()
export class AuthResolver {
    @Mutation(returns => AuthPayload)
    async register(@Arg("input") input: RegisterInput, @Ctx() ctx: Context) {

        const foundUser = await ctx.prisma.user.findOne({
            where: {
                email: input["email"]
            }
        });

        if (foundUser) {
            throw new UserInputError("Validation error!", inputError({ path: "email", message: "That email is already in use!" }));
        }

        const user = await ctx.prisma.user.create({
            data: {
                name: input["name"],
                email: input["email"],
                password: Hash(input["password"]),
                createdAt: new Date()
            }
        });

        return SignAuthPayload(user);
    }

    @Mutation(returns => AuthPayload)
    async login(@Arg("input") input: LoginInput, @Ctx() ctx: Context) {
        const user = await ctx.prisma.user.findOne({
            where: {
                email: input["email"]
            }
        });

        if (!user || (user && !PasswordsMatch(input["password"], user.password))) {
            throw new AuthenticationError("There was an error logging in. Check your credentials.");
        }

        return SignAuthPayload(user);
    }

    @Authorized()
    @Query(returns => User)
    async me(@Ctx() ctx: Context) {
        return ctx.user;
    }
}