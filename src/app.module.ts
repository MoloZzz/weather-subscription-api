import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { WeatherModule } from './weather/weather.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfigModule } from '@nestjs/config';
import { OpenWeatherModule } from './integrations/open-weather/open-weather.module';

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
            }),
        }),
        WeatherModule,
        SubscriptionModule,
        OpenWeatherModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
