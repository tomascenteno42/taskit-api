import { NonEmptyArray } from "type-graphql"

import { AuthResolver } from "./AuthResolver"
import { BoardResolver } from "./BoardResolver";
import { InvitationResolver } from "./InvitationResolver";
import { TaskResolver } from "./TaskResolver";

export default [
    AuthResolver,
    BoardResolver,
    InvitationResolver,
    TaskResolver
] as NonEmptyArray<Function>