# An API service that allow you to subscribe to regular weather forecast updates in the selected city

## Basic user logic
- User calls the [post] /api/subscription/subscribe request passing email, notification frequency and city.
- Receives a message with a token to the entered email.
- Confirms the action by passing this token with a request [get] api/subscription/confirm.
- Can repeat this action to get second, third... subscription, but only for new cities
- Can stop receiving messages by passing the received token with a request to [get] api/subscription/unsubscribe
- After unsubscribe, user can subscribe again using basic request. ([post] /api/subscription/subscribe)

## Recomendations
- use body instead of 3 params in /subscribe
- separate frontend and backend 
- use [post] type for requests /confirm, /unsubscribe 
- use email for unsubscribe instead of token
- token can be used only for confirmation(not to save in main db, better to save in redis for 10-15 min) 

## Architecture & Design Principles (optional reading)
This project is built using the following software architecture patterns and best practices:

- Modular Structure: Clearly separated modules for weather, subscription, mailing, and scheduling services.
- Separation of Concerns (SoC): Each service is responsible for a single aspect of the application (e.g., weather fetching, email delivery, user subscription, etc).
- Single Responsibility Principle (SRP): All classes, functions, and modules are designed with a specific and well-defined responsibility.
- Dependency Injection (DI): Built-in NestJS DI allows easy testing and flexibility in swapping implementations.
- DRY Principle: Common logic is reused via providers and utility services.
- Validation Layer: All incoming data is validated using DTOs and class-validator decorators.
- Transactional Safety: Critical operations (e.g., confirming a subscription) are performed within database transactions.
- Scalability & Maintainability: Clean abstraction layers and service boundaries make it easy to scale and maintain.

## Swagger Overview (optional reading)

- [GET] /weather – Get current weather data.
- [POST] /subscribe – Subscribe to weather updates.
- [GET] /confirm/{token} – Confirm email subscription.
- [GET] /unsubscribe/{token} – Unsubscribe using a secure token.

## Technology Stack (optional reading)
| Layer / Area       | Technology                                    |
| ------------------ | --------------------------------------------- |
| Framework          | [NestJS](https://nestjs.com/)                 |
| Language           | TypeScript                                    |
| Database           | PostgreSQL + TypeORM                          |
| Scheduling         | `@nestjs/schedule` + `cron`                   |
| Email Sending      | Nodemailer                                    |
| Weather API         | [WeatherAPI.com](https://openweathermap.org/) |
| API Documentation  | Swagger (via `@nestjs/swagger`)               |
| Validation         | `class-validator`, `class-transformer`        |
| Environment Config | `@nestjs/config`                              |

## Scheduling Weather Emails (optional reading)
Uses *@nestjs/schedule* for cron jobs.

After confirmation:

The system schedules a cron job for the user’s email.

Jobs are dynamic based on user-selected frequency.

The job fetches the weather and sends an email.

## Email System (optional reading)
Built using *Nodemailer*.

Email templates include unsubscribe links and weather summaries.

Tokens in links are cryptographically generated and unique per subscription.

## Best Practices Used (optional reading)
- OOP
- SOLID
- Modularity (based on single responsibily principe): Feature-based module splitting (e.g., WeatherModule, SubscriptionModule, MailModule).
- Configurable: .env-driven API keys and credentials using @nestjs/config.
- Error Handling: Granular error responses (400, 404, 409) with descriptive messages.
- Input validation and serialization.
- Scalable: New notification channels (e.g., Telegram, SMS) can be added without major changes.

## Core Logic by Routes

### 🔹 `GET /weather?city=Kyiv`

Logic:

- Extracts the city name from the query.
- Checks if the city exists in the database (`CityEntity`). If not:
  - Fetches coordinates from OpenWeather API.
  - Saves city name, latitude, and longitude.
- Checks if weather data for these coordinates exists in Redis cache.
  - If yes → returns cached data.
  - If no → fetches from OpenWeather API, caches in Redis (e.g., for 10 minutes).
- Returns weather response (`temperature`, `humidity`, `description`).

Uses:

- `cityService.findOrCreateByName(name)`
- `openWeatherService.getCurrentWeather(lat, lon)`
- `redisService.get()` / `set()` with TTL
- DTO: `WeatherResponseDto`

---

### 🔹 `POST /subscribe`

Logic:

- Accepts `email`, `city`, and `frequency`.
- Validates input data.
- Finds or creates(after request to open-weather-api) the city in the database.
- Generates `confirmation_token` and `confirmation_expaires_at`.
- Saves subscription to the DB with status `is_active: false`.
- Sends confirmation email with token.

Uses:

- `emailService.sendConfirmationEmail()`
- `crypto` or `uuid` for token generation
- DB entity: `SubscriptionEntity`
- Unique constraint on `email + city` to prevent duplicates

---

### 🔹 `GET /confirm/{token}`

Logic:

- Validates confirmation token (find by confirmation_token and checking confirmation_expires_at).
- If valid → updates user status to `confirmed`, subscriptions to `is_active: true`.
- Returns success or `400 / 404`.

---

### 🔹 `GET /unsubscribe/{token}`

Logic:

- Finds user by `confirmation_token`.
- Finds subscriptions by subscriber_id → removes (or can be changed to marking subscriptions as `is_active: false`).
- Returns confirmation message.

---

## Email Service

- Templates for:
  - Subscription confirmation
  - Daily/hourly forecast delivery
  - Unsubscribe confirmation
- Works via SMTP adapter and can be easily changed to external email provider API.

---

## Weather Delivery (CRON Jobs)

- Uses `@nestjs/schedule` to manage jobs.
- Two scheduled jobs:
  - Every hour → for `frequency = 'hourly'`
  - Every day at `08:00` → for `frequency = 'daily'`
- For each active subscription:
  - Fetches weather (coordinates can be cached for 10 min).
  - Generates a concise weather summary email.
  - Sends email to the user.

---

## Edge Case Handling

- City name variations (e.g., `"Kyiv"` / `"Kiev"`) → creating like different request for quick access(normalisation + denormalization).
- Duplicate subscriptions → handled with `409 Conflict`.
- Tokens → support TTL(time to live aproach).
- Frequently used requests → caching by redis.

---

## 🐳 Docker & Production

- **Multi-stage Docker build**:
  - `builder`: compiles TypeScript to `dist/`
  - `runner`: production-only `node_modules` + compiled code
- Redis used as a separate container.
- External mail service supported via `.env`:
  - `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS`, etc.
- `docker-compose.prod.yml` includes:
  - `app`, `redis`, `postgres`, and `scheduler` (can be a separate process)

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

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=
SMTP_PASS=

POSTGRES_HOST=postgres
POSTGRES_USER=postgres
POSTGRES_PORT=5432
POSTGRES_PASS=NotForProduction
POSTGRES_DB_NAME=weather-subscription
POSTGRES_IS_LOGGING_ENABLED=false

REDIS_HOST=redis
REDIS_PORT=6379
REDIS_TTL=600
```

## Start working
### Running common containers
```bash
# This command starts containers with Postgres, RabbitMQ, and Redis
$ docker compose -f docker-compose.common.yml up -d

# Development build with watch mode
$ docker compose -f docker-compose.dev.yml up --build

```
