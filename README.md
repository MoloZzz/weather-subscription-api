# An API service that allow you to subscribe to regular weather forecast updates in the selected city

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## TypeORM instructions
* Create a new entity in [directory](src/common/entities)
* Add a new entity to [import array](src/common/entities/index.ts)
* Generate a new migration for this entity

```bash
$ yarn run typeorm:migration:generate src/common/migrations/{name}
# example
$ yarn run typeorm:migration:generate src/common/migrations/create-users


* Add a new migration to [import array](src/common/migrations/index.ts)
* Additional useful commands

```bash
# create a new empty migration
$ yarn run typeorm:migration:create .src/common/migrations/{name}
# for register
$ yarn run typeorm:migration:register:create .src/common/migrations/{name}

