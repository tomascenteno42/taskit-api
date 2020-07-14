import { ObjectType, registerEnumType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Board } from "./Board";

export enum TaskStatus {
    COMPLETED = "COMPLETED",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING = "PENDING",
}

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