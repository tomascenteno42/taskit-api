import { ObjectType, Field, ID } from "type-graphql";

import { Invitation } from "./Invitation";
import { Board } from "./Board";

@ObjectType()
export class User {
    @Field()
    id!: number;
    
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field(type => [Board])
    boards!: Board[];
    
    @Field(type => [Board])
    subscribed_boards!: Board[];

    @Field(type => [Invitation])
    invitations!: Invitation[];
}