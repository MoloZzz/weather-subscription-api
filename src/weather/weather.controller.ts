import { Controller, Get, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { WeatherResponseDto, CityParamDto } from 'src/common/dtos';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
    constructor(private readonly weatherService: WeatherService) {}

    @Get(':city')
    @ApiOperation({ summary: 'Get current weather for a city' })
    @ApiOkResponse({
        description: 'Successful operation - current weather forecast returned',
        type: WeatherResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid request' })
    @ApiNotFoundResponse({ description: 'City not found' })
    async getWeather(@Param() param: CityParamDto): Promise<WeatherResponseDto> {
        return this.weatherService.getWeather(param.city);
    }
}
