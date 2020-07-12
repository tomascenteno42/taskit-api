import { InputType, Field } from "type-graphql";

@InputType()
export class CreateTaskInput {
    @Field()
    content!: string;
}