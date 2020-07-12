import { Resolver, Mutation, Authorized, Arg, Ctx } from "type-graphql";

import { ForbiddenError } from "apollo-server-core";

import { Board } from "@graphql/types/Board";

import { UpdateBoardInput } from "@graphql/inputs/Board/UpdateBoardInput";
import { CreateBoardInput } from "@graphql/inputs/Board/CreateBoardInput";

import { Context } from "@utils/context";

@Resolver()
export class BoardResolver {

    @Authorized()
    @Mutation(returns => Board)
    async createBoard(@Arg("input") input: CreateBoardInput, @Ctx() ctx: Context) {
        const board = await ctx.prisma.board.create({
            data: {
                name: input["name"],
                author: {
                    connect: {
                        id: ctx.user.id
                    }
                },
                createdAt: new Date()
            },
            include: { author: true, users: true, tasks: true }
        });

        return board;        
    }

    @Authorized()
    @Mutation(returns => Board)
    async updateBoard(@Arg("id") boardId: number, @Arg("input") input: UpdateBoardInput, @Ctx() ctx: Context) {
        const [boardToUpdate] = await ctx.prisma.task.findMany({
            where: {
                id: boardId,
                authorId: ctx.user.id
            }
        });

        if (!boardToUpdate) {
            throw new ForbiddenError("You cannot update that task.");
        }

        const board = await ctx.prisma.board.update({
            where: { id: boardToUpdate.id },
            data: input,
            include: {
                author: true,
                invitations: true,
                tasks: true,
                users: true
            },
        });

        return board;
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async deleteBoard(@Arg("id") boardId: number,@Ctx() ctx: Context) {
        const deleted = await ctx.prisma.board.deleteMany({
            where: {
                id: boardId,
                authorId: ctx.user.id
            }
        });

        if (deleted.count === 0) {
            throw new ForbiddenError("You cannot delete that task.");
        }

        return true
    }
}