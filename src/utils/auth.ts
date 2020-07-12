import { AuthChecker } from "type-graphql";

import { AuthenticationError } from "apollo-server-core";

import { User } from "@prisma/client"

import { AuthPayload } from "@graphql/types/AuthPayload";

import { SignUserToken, DecodeUserToken } from "@utils/token";
import { Context } from "@utils/context";

export const SignAuthPayload = (user: User): AuthPayload => {
    return {
        access_token: SignUserToken(user.id),
        user
    }
}

export const authChecker: AuthChecker<Context> = async ({ context }) => {
    const Authorization = context.request.headers["authorization"];
    const token = Authorization?.replace("Bearer ", "");

    if (token) {
        try {
            const { uid } = DecodeUserToken(token);

            const user = await context.prisma.user.findOne({
                where: {
                    id: uid
                },
                include: {
                    boards: true,
                    invitations: true,
                    subscribed_boards: true,
                    tasks: true
                }
            });

            if (!user) {
                throw new Error();
            }

            context.user = user;

            return true;
        } catch (error) {
            throw new AuthenticationError("Invalid token");
        }
    } else {
        throw new AuthenticationError("Please send a valid token");
    }
}