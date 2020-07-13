/// <reference path="../../src/types/env.d.ts" /> 

import jwt from "jsonwebtoken";

import faker from "faker";

import { AuthPayload, User } from "../../src/graphql/types";

import { GQL } from "../helpers/graphql";

import { prisma } from "../../src/utils/prisma";

const RegisterMutation = `
    mutation Register($input: RegisterInput!) {
        register(
            input: $input
        ) {
            access_token
            user {
                name
                email
            }
        }
    }
`;

const LoginMutation = `
    mutation Login($input: LoginInput!) {
        login(
            input: $input
        ) {
            access_token
            user {
                name
                email
            }
        }
    }
`;

const MeQuery = `
    query {
        me {
            name
            email
        }
    }
`;

describe("AuthResolver tests", () => {
    
    const input = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
        email: faker.internet.email(),
        password: faker.internet.password(),
    }

    it(`Should register user ${input.email} successfully and return valid token`, async () => {
        const response = await GQL<{ register: AuthPayload }>({
            source: RegisterMutation,
            variableValues: { input }
        });

        const { access_token, user } = response.data.register;

        expect(access_token).toBeTruthy()
        expect(typeof access_token === "string").toBe(true);
        expect(jwt.verify(access_token, process.env.JWT_SECRET)).toBeTruthy();

        expect(user).toMatchObject({
            name: input.name,
            email: input.email
        });
    });

    it(`Created a database record for user ${input.email}`, async () => {
        const user = await prisma.user.findOne({ where: { email: input.email } });

        expect(user).not.toBe(null)
        expect(user).toBeTruthy()
    });

    let token: string;

    it(`Should login user ${input.email} successfully and return valid token`, async () => {
        const response = await GQL<{ login: AuthPayload }>({
            source: LoginMutation,
            variableValues: {
                input: {
                    email: input.email,
                    password: input.password
                }
            }
        });

        const { access_token, user } = response.data.login;

        token = access_token;

        expect(access_token).not.toBe(null)
        expect(typeof access_token === "string").toBe(true);
    
        expect(jwt.verify(access_token, process.env.JWT_SECRET)).toBeTruthy();

        expect(user).toMatchObject({
            name: input.name,
            email: input.email
        });
    });

    it("Should be able to authenticate and retrieve user data (me query)", async () => {
        const response = await GQL<{ me: User }>({
            source: MeQuery,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        const { me } = response.data;

        expect(me).toBeTruthy();
        expect(me).toMatchObject({
            name: input.name,
            email: input.email
        });
    });

    it("Should fail query if invalid token is sent", async () => {
        const response = await GQL<{ me: User }>({
            source: MeQuery,
            headers: {
                authorization: "Bearer 12345abcdef"
            }
        });

        const { data, errors } = response;

        expect(data).toBeFalsy();

        expect(errors).toBeTruthy()
        expect(errors.length).toBeGreaterThan(0);
        
    });
});