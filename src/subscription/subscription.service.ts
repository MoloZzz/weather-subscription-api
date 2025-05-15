import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityService } from 'src/city/city.service';
import { SubscribeDto, SubscriptionResponseDto } from 'src/common/dtos';
import { SubscriptionEntity } from 'src/common/entities/subscription.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectRepository(SubscriptionEntity)
        private readonly subscriptionRepository: Repository<SubscriptionEntity>,
        private readonly cityService: CityService,
        private readonly userService: UserService,
    ) {}

    async subscribe(dto: SubscribeDto): Promise<SubscriptionResponseDto> {
        const city = await this.cityService.findOrCreateByName(dto.city);
        const subscriber = await this.userService.findOrCreate(dto.email);
        const subscription = await this.subscriptionRepository.save({
            city,
            frequency: dto.frequency,
            subscriber,
            isActive: false,
        });

        return {
            email: subscriber.email,
            city: city.name,
            frequency: subscription.frequency,
            confirmed: subscription.isActive,
        };
    }

    async confirm(token: string) {
        const user = await this.userService.confirmEmail(token);
        await this.subscriptionRepository.update({ subscriber: { id: user.id } }, { isActive: true });
        return { message: 'Subscription confirmed successfully' };
    }

    async unsubscribe(token: string) {
        const user = await this.userService.findByToken(token);
        if (!user) {
            throw new NotFoundException('Invalid token');
        }
        await this.subscriptionRepository.delete({ subscriber: { id: user.id } });
        await this.userService.deactivateToken(token);
        return { message: 'Unsubscribed successfully' };
    }
}
