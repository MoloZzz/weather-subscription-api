import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { WeatherModule } from './weather/weather.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfigModule } from '@nestjs/config';
import { OpenWeatherModule } from './integrations/open-weather/open-weather.module';
import { entities } from './common/entities';
import { migrations } from './common/migrations';
import { PostgresqlModule } from './libs/postgresql/postgresql.module';
import { CityModule } from './city/city.module';
import { UserModule } from './user/user.module';
import { EmailModule } from './integrations/email/email.module';
import { NotificationModule } from './notification/notification.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`.env`],
            validationSchema: Joi.object({
                API_DOCS_ENABLED: Joi.string().optional(),
                PORT: Joi.number().required(),
                OPEN_WEATHER_BASE_URL: Joi.string().required(),
                OPEN_WEATHER_API_KEY: Joi.string().required(),
                POSTGRES_USER: Joi.string().required(),
                POSTGRES_DB_NAME: Joi.string().required(),
                POSTGRES_IS_LOGGING_ENABLED: Joi.string().optional(),
                POSTGRES_HOST: Joi.string().required(),
                POSTGRES_PORT: Joi.string().required(),
                POSTGRES_PASS: Joi.string().required(),
                SMTP_HOST: Joi.string().required(),
                SMTP_PORT: Joi.string().required(),
                SMTP_USER: Joi.string().required(),
                SMTP_PASS: Joi.string().required(),
                SMTP_SECURE: Joi.boolean().required(),
            }),
        }),
        CacheModule.register({
            ttl: 600,
            isGlobal: true,
        }),
        WeatherModule,
        SubscriptionModule,
        OpenWeatherModule,
        PostgresqlModule.register(entities, migrations, []),
        CityModule,
        UserModule,
        EmailModule,
        NotificationModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
