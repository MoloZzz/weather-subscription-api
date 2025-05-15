import { Injectable } from '@nestjs/common';
import { SubscribeDto, SubscriptionResponseDto } from 'src/common/dtos';

@Injectable()
export class SubscriptionService {
    constructor() {}

    async subscribe(dto: SubscribeDto): Promise<SubscriptionResponseDto> {
        return {
            email: dto.email,
            city: dto.city,
            frequency: dto.frequency,
            confirmed: false,
        };
    }

    async unsubscribe(token: string) {
        return { message: `Unsubscribed successfully` };
    }

    async confirm(token: string) {
        return { message: `Subscription confirmed successfully` };
    }
}
