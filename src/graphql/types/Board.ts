import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Task } from "./Task";
import { Invitation } from "./Invitation";

@ObjectType()
export class Board {
    @Field(type => ID)
    id!: string;
    
    @Field()
    name!: string;

    @Field(type => User)
    author!: User;

    @Field(type => [User])
    users!: User[];

    @Field(type => [Task])
    tasks!: Task[];

    @Field(type => [Invitation])
    invitations!: Invitation[];
}