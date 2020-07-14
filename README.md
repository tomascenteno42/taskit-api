# TaskIT GraphQL API [![Tomascenteno42](https://circleci.com/gh/tomascenteno42/taskit-api.svg?style=svg)](https://github.com/tomascenteno42/taskit-api)
Welcome to the TaskIT GraphQL API github repository. 

## Building

Build for production

```bash
$ npm run build:production
```

Build for development

```bash
$ npm run build:development
```

## Starting the API

You can start the nodemon and webpack development server by running the following command

```bash
$ npm run start:dev
```

To start the api in production mode run the following command (Required the code to be built)

```bash
$ npm run start:production
```

## Database

Run migrations

```bash
$ npx prisma migrate up --experimental
```

Save a new migration

```bash
$ npx prisma migrate save --experimental
```

## Prisma

Generate client

```bash
$ npx prisma generate
```