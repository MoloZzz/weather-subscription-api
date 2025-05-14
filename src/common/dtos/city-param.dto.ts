import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CityParamDto {
    @ApiProperty({
        example: 'city',
        description: 'City name for weather forecast',
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    city: string;
}
