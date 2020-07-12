import { InputType, Field } from "type-graphql";

@InputType()
export class UpdateBoardInput {
    @Field()
    name!: string;
}