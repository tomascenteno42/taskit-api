declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;

        JWT_SECRET: string;

        DATABASE_TEST_URL: string;
    }
}