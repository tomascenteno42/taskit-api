import Fastify from "fastify";
import GQL from "fastify-gql";

import dotenv from "dotenv";

import { schema } from "@graphql/schema";

import { context } from "@utils/context";

export const bootstrap = async () => {
    dotenv.config();

    const app = Fastify();

    app.register(GQL, {
        schema,
        context,
        jit: 1
    });

    app.listen({ port: process.env.PORT as any }, () => {
        console.log(`Sever started on port ${process.env.PORT}`)
    });
};