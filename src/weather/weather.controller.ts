import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CityParamDto } from 'src/common/dtos/city-param.dto';
import { WeatherResponseDto } from 'src/common/dtos/weather-response.dto';

@ApiTags("weather")
@Controller('weather')
export class WeatherController {
    @Get(':city')
    @ApiOperation({ summary: 'Get current weather for a city' })
    @ApiOkResponse({
        description: 'Successful operation - current weather forecast returned',
        type: WeatherResponseDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid request' })
    @ApiNotFoundResponse({ description: 'City not found' })
    async getWeather(@Param() param: CityParamDto): Promise<WeatherResponseDto> {
        console.log(param.city);
        return {
            temperature: 25,
            humidity: 60,
            description: 'Sunny',
        };
    }
}
