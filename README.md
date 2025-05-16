# An API service that allow you to subscribe to regular weather forecast updates in the selected city

## Basic user logic
- User calls the [post] /api/subscription/subscribe request passing email, notification frequency and city.
- Receives a message with a token to the entered email.
- Confirms the action by passing this token with a request [get] api/subscription/confirm.
- Can stop receiving messages by passing the received token with a request to [get] api/subscription/unsubscribe
- After unsubscribe, user can subscribe again using basic request. ([post] /api/subscription/subscribe)
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
```
## Env
```
PORT=4000
API_DOCS_ENABLED=true

OPEN_WEATHER_BASE_URL=https://api.openweathermap.org
OPEN_WEATHER_API_KEY=
OPEN_WEATHER_RESPONSE_LANGUAGE=ua

POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PORT=5432
POSTGRES_PASS=
POSTGRES_DB_NAME=weather-subscription
POSTGRES_IS_LOGGING_ENABLED=false

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=
```

## Start working
### Running common containers
```bash
# This command starts containers with Postgres, RabbitMQ, and Redis
$ docker compose -f docker-compose.common.yml up -d
```