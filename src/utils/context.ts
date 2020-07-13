import { FastifyRequest, FastifyReply } from 'fastify';

import { ServerResponse, IncomingMessage } from 'http';

import { User, PrismaClient } from '@prisma/client';

import { prisma } from "@utils/prisma";

export const context = (request: FastifyRequest<IncomingMessage>, reply: FastifyReply<ServerResponse>, oPrisma?: PrismaClient) => ({
    prisma: oPrisma || prisma,
    request,
    reply
});

export type Context = ReturnType<typeof context> & { user: User };
