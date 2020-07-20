import { GQL } from "../helpers/graphql";

import { prisma } from "../../src/utils/prisma";

import { Board, AuthPayload } from "../../src/graphql/types";

import { createTestUser } from "../helpers/user";

const createBoardMutation = `
    mutation CreateBoard($input: CreateBoardInput!) {
        createBoard(input: $input) {
            id
            name
            author {
                id
                name
            }
        }
    }
`;

const updateBoardMutation = `
    mutation UpdateBoard($id: Float!, $input: UpdateBoardInput!) {
        updateBoard(id: $id, input: $input) {
            id 
            name
            author {
                id
            }
        }
    }    
`;

describe("BoardResolver tests", () => {
    
    let createdBoard: Board;
    let auth: AuthPayload;

    it("Should create board, return it and create a database record", async () => {
        const { user, access_token } = await createTestUser();

        auth = { access_token, user };

        const response = await GQL<{ createBoard: Board }>({
            source: createBoardMutation,
            variableValues: { input: { name: "My board" } },
            headers: {
                authorization: `Bearer ${access_token}`
            }
        });

        expect(response.data).toBeTruthy();
        expect(response.data.createBoard).toBeTruthy();

        const { id, name, author } = response.data.createBoard;

        createdBoard = response.data.createBoard;

        expect(author.id).toBe(user.id);
        expect(name).toBe("My board");

        const board = await prisma.board.findOne({
            where: { id }
        });

        expect(board).toBeTruthy(); 
    });

    it("Should update board name and return board", async () => {
    
        const response = await GQL<{ updateBoard: Board }>({
            source: updateBoardMutation,
            variableValues: { id: createdBoard.id, input: { name: "New board name" } },
            headers: {
                authorization: `Bearer ${auth.access_token}`
            }
        });

        expect(response.data).toBeTruthy();
        expect(response.data.updateBoard).toBeTruthy();

        const { id, name, author } = response.data.updateBoard;        

        expect(createdBoard.id).toBe(id);
        expect(createdBoard.name).not.toBe(name);        
        expect(createdBoard.author.id).toBe(author.id);

        const board = await prisma.board.findOne({
            where: { id }
        });

        expect(board).toBeTruthy();
        expect(board?.name).toBe(name);
        expect(board?.name).not.toBe(createdBoard.name);
    });  
});