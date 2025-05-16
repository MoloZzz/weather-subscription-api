import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { OpenWeatherModule } from 'src/integrations/open-weather/open-weather.module';
import { CityModule } from 'src/city/city.module';

@Module({
    imports: [OpenWeatherModule, CityModule],
    controllers: [WeatherController],
    providers: [WeatherService],
    exports: [WeatherService],
})
export class WeatherModule {}
