import Fastify from "fastify";
import GQL from "fastify-gql";

import dotenv from "dotenv";

import { buildSchema } from "type-graphql";

import resolvers from "@graphql/resolvers";

import { context } from "@utils/context";
import { authChecker } from "@utils/auth";

export const bootstrap = async () => {
    dotenv.config();

    const app = Fastify();

    app.register(GQL, {
        schema: await buildSchema({
            resolvers,
            validate: false,
            authChecker
        }),
        context,
        jit: 1
    });

    app.listen({ port: process.env.PORT as any }, () => {
        console.log(`Sever started on port ${process.env.PORT}`)
    });
};