import dotenv from "dotenv";

import { prisma } from "../../src/utils/prisma";

dotenv.config();

afterAll(() => {
    prisma.disconnect();
});