import { ApiProperty } from '@nestjs/swagger';
import { SubscribeFreq } from '../enums/subscribe-freq.enum';

export class SubscriptionResponseDto {
    @ApiProperty({ description: 'Email address' })
    email: string;

    @ApiProperty({ description: 'City for weather updates' })
    city: string;

    @ApiProperty({ description: 'Frequency of updates', enum: SubscribeFreq })
    frequency: SubscribeFreq;

    @ApiProperty({ description: 'Whether the subscription is confirmed' })
    confirmed: boolean;
}
