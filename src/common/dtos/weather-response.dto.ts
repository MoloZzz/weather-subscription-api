import { ApiProperty } from '@nestjs/swagger';

export class WeatherResponseDto {
    @ApiProperty({ example: 0, description: 'Температура в градусах Цельсія' })
    temperature: number;

    @ApiProperty({ example: 0, description: 'Вологість у відсотках' })
    humidity: number;

    @ApiProperty({ example: 'string', description: 'Короткий опис погоди' })
    description: string;
}
