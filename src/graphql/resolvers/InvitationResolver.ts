import { Resolver, Mutation, Arg, Ctx, Query, Authorized } from "type-graphql";

import { ForbiddenError, toApolloError, ValidationError } from "apollo-server-core";

import { Invitation, Board } from "@graphql/types";

import { Context } from "@utils/context";

@Resolver()
export class InvitationResolver {

    @Authorized()
    @Query(returns => [Invitation])
    async invitations(@Ctx() ctx: Context) {
        const invitations = await ctx.prisma.invitation.findMany({
            where: { userId: ctx.user.id }
        });

        return invitations;
    }

    @Authorized()
    @Mutation(returns => Invitation)
    async inviteUserToBoard(@Arg("user") userId: number, @Arg("board") boardId: number, @Ctx() ctx: Context) {

        if (userId === ctx.user.id) {
            throw new ValidationError("You cannot invite yourself.");
        }

        const board = await ctx.prisma.board.findOne({
            where: {
                id: boardId
            },
            include: {
                users: true,
                invitations: true
            }
        });

        if (!board || board.authorId !== ctx.user.id) {
            throw new ForbiddenError("You dont have access to that board.");
        }

        const invitedUser = await ctx.prisma.user.findOne({
            where: {
                id: userId
            }
        });        

        if (!invitedUser) {
            throw toApolloError({ message: "That user doesnt seem to exist.", name: "NOT_FOUND" }, "NOT_FOUND");
        }

        const [ userAlreadyInBoard ] = board.users.filter((user) => user.id === invitedUser.id);

        if (userAlreadyInBoard) {
            throw new ValidationError("The user is already subscribed to the board.");
        }

        const [ userAlreadyInvited ] = board.invitations.filter(invitation => invitation.userId === invitedUser.id);

        if (userAlreadyInvited) {
            throw new ValidationError("The user is already invited to the board.");
        }
        
        const invitation = await ctx.prisma.invitation.create({
            data: {
                board: {
                    connect: {
                        id: board.id
                    }
                },
                user: {
                    connect: {
                        id: invitedUser.id
                    }
                },
                createdAt: new Date()
            },
            include: {
                board: true,
                user: true
            }
        });

        return invitation;
    }

    @Authorized()
    @Mutation(returns => Board)
    async acceptInvitation(@Arg("id") id: number, @Ctx() ctx: Context) {
        const [invitation] = await ctx.prisma.invitation.findMany({
            where: {
                id,
                userId: ctx.user.id
            }
        });
        
        if (!invitation) {
            throw new ForbiddenError("The invitation to that board seems to be invalid.")
        }

        await ctx.prisma.invitation.delete({
            where: { id }
        });

        const board = await ctx.prisma.board.update({
            where: { id: invitation.boardId },
            data: {
                users: {
                    connect: { id: invitation.userId }
                }
            },
            include: {
                author: true,
                tasks: true,
                users: true
            }
        });

        return board;
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async declineInvitation(@Arg("id") id: number, @Ctx() ctx: Context) {
        const [invitation] = await ctx.prisma.invitation.findMany({
            where: {
                id,
                userId: ctx.user.id
            }
        });
        
        if (!invitation) {
            throw new ForbiddenError("The invitation to that board seems to be invalid.")
        }

        await ctx.prisma.invitation.delete({
            where: { id }
        });

        return true;
    }
}