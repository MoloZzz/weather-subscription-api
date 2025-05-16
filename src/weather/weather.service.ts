import { BadRequestException, Injectable } from '@nestjs/common';
import { CityService } from 'src/city/city.service';
import { WeatherResponseDto } from 'src/common/dtos';
import { ICoordinates } from 'src/common/interfaces';
import { OpenWeatherService } from 'src/integrations/open-weather/open-weather.service';

@Injectable()
export class WeatherService {
    constructor(
        private readonly cityService: CityService,
        private readonly openWeatherService: OpenWeatherService,
    ) {}

    //used optoins to allow for either cityName or coords
    async getWeather(options: { cityName?: string; coords?: ICoordinates }): Promise<WeatherResponseDto> {
        let lat: string, lon: string;

        if (options.cityName) {
            const city = await this.cityService.findOrCreateByName(options.cityName);
            lat = city.lat;
            lon = city.lon;
        } else if (options.coords) {
            lat = options.coords.lat;
            lon = options.coords.lon;
        } else {
            throw new BadRequestException('Either cityName or coords must be provided');
        }

        const weatherData = await this.openWeatherService.getWeatherDataByCoordinates(lat, lon);

        return {
            description: weatherData.weather[0].description,
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
        };
    }
}
