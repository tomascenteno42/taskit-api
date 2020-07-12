import { InputType, Field } from "type-graphql";

import { TaskStatus } from "@prisma/client";

@InputType()
export class UpdateTaskInput {
    @Field({ nullable: true })
    content?: string;

    @Field({ nullable: true })
    status?: TaskStatus;
}