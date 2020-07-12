import { InputType, Field } from "type-graphql";

@InputType()
export class CreateBoardInput {
    @Field()
    name!: string;
}