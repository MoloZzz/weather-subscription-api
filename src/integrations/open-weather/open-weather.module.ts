import { Module } from '@nestjs/common';
import { OpenWeatherService } from './open-weather.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        HttpModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                baseURL: configService.get<string>('OPEN_WEATHER_BASE_URL'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [OpenWeatherService],
    exports: [OpenWeatherService],
})
export class OpenWeatherModule {}
