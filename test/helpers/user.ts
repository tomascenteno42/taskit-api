import faker from "faker";

import { prisma } from "../../src/utils/prisma";

import { SignAuthPayload } from "../../src/utils/auth";

export const createTestUser = async ()  => {

    const user = await prisma.user.create({
        data: {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            createdAt: new Date()
        }
    });
    
    return SignAuthPayload(user);
}
