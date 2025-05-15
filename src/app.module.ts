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
            }),
        }),
        WeatherModule,
        SubscriptionModule,
        OpenWeatherModule,
        PostgresqlModule.register(entities, migrations, []),
        CityModule,
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
