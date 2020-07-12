import { ObjectType, registerEnumType, Field, ID } from "type-graphql";

import { TaskStatus } from "@prisma/client";

import { User } from "./User";
import { Board } from "./Board";

registerEnumType(TaskStatus, {
    name: "TaskStatus"
});

@ObjectType()
export class Task{
    @Field(type => ID)
    id!: string;
    
    @Field()
    content!: string;

    @Field(type => TaskStatus)
    status!: TaskStatus;

    @Field(type => User)
    author!: User;

    @Field(type => Board)
    board!: Board;
}