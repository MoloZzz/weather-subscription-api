import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CityService } from 'src/city/city.service';
import { WeatherResponseDto } from 'src/common/dtos';
import { ICoordinates } from 'src/common/interfaces';
import { OpenWeatherService } from 'src/integrations/open-weather/open-weather.service';

@Injectable()
export class WeatherService {
    constructor(
        private readonly cityService: CityService,
        private readonly openWeatherService: OpenWeatherService,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    //used optoins to allow for either cityName or coords
    async getWeather(options: { cityName?: string; coords?: ICoordinates }): Promise<WeatherResponseDto> {
        let lat: string, lon: string;
        let cacheKey: string;

        if (options.cityName) {
            const city = await this.cityService.findOrCreateByName(options.cityName);
            lat = city.lat;
            lon = city.lon;
            cacheKey = `weather:city:${options.cityName.toLowerCase()}`;
        } else if (options.coords) {
            lat = options.coords.lat;
            lon = options.coords.lon;
            cacheKey = `weather:coords:${lat}:${lon}`;
        } else {
            throw new BadRequestException('Either cityName or coords must be provided');
        }

        const cached = await this.cacheManager.get<WeatherResponseDto>(cacheKey);
        if (cached) return cached;

        const weatherData = await this.openWeatherService.getWeatherDataByCoordinates(lat, lon);
        const result: WeatherResponseDto = {
            description: weatherData.weather[0].description,
            temperature: weatherData.main.temp,
            humidity: weatherData.main.humidity,
        };

        await this.cacheManager.set(cacheKey, result, 600_000); // TTL 10 min
        return result;
    }
}
