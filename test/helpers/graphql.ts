import "reflect-metadata";

import { DefaultHeaders } from "fastify";

import { graphql } from "graphql";

import { Maybe } from "type-graphql";

import { schema } from "../../src/graphql/schema";

import { context } from "../../src/utils/context";

interface GraphQLCallOptions {
    source: string;
    variableValues?: Maybe<{
        [key: string]: any;
    }>;
    headers?: DefaultHeaders;
}

const contextFactory = (headers?: DefaultHeaders) => {
    const ctx = context({ headers } as any, { }  as any);

    return ctx;
}

export const GQL = <T>(options: GraphQLCallOptions) => {
    return graphql({
        schema,
        source: options.source,
        variableValues: options.variableValues,
        contextValue: contextFactory(options.headers),
    }) as any as Promise<{ data: T, errors: any[] }>;
}