import { FastifyRequest, FastifyReply } from 'fastify';

import { ServerResponse, IncomingMessage } from 'http';

import { User } from '@prisma/client';

import { prisma } from "@utils/prisma";

export const context = (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>) => ({
    prisma,
    request,
    reply
});

export type Context = ReturnType<typeof context> & { user: User };
