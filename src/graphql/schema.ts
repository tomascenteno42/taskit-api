import { buildSchemaSync } from "type-graphql";

import resolvers from "@graphql/resolvers";

import { authChecker } from "@utils/auth";

export const schema = buildSchemaSync({
    resolvers,
    validate: false,
    authChecker
});