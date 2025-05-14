import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [`.env`],
            validationSchema: Joi.object({
                API_DOCS_ENABLED: Joi.string().optional(),
                PORT: Joi.number().required(),
            }),
        }),
        WeatherModule,
        SubscriptionModule,
    ],
    controllers: [],
    providers: [AppService],
})
export class AppModule {}
