import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { SubscribeFreq } from '../enums/subscribe-freq.enum';

export class SubscribeDto {
    @ApiProperty({ description: 'Email address to subscribe' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'City for weather updates' })
    @IsNotEmpty()
    city: string;

    @ApiProperty({ description: 'Frequency of updates (hourly or daily)', enum: SubscribeFreq })
    @IsEnum(SubscribeFreq)
    frequency: SubscribeFreq;
}
