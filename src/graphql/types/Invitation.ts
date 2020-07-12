import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { Board } from "./Board";

@ObjectType()
export class Invitation {
    @Field(type => ID)
    id!: string;
    
    @Field(type => User)
    user!: User;

    @Field(type => Board)
    board!: Board;
}