import { Injectable } from '@nestjs/common';
import { WeatherResponseDto } from 'src/common/dtos/weather-response.dto';

@Injectable()
export class WeatherService {
    constructor() {}

    async getWeather(city: string): Promise<WeatherResponseDto> {
        return {
            temperature: 25,
            humidity: 60,
            description: 'Sunny',
        };
    }
}
