import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WeatherResponseDto } from 'src/common/dtos';
import { SubscriptionEntity } from 'src/common/entities/subscription.entity';
import { SubscribeFreq } from 'src/common/enums';
import { EmailService } from 'src/integrations/email/email.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly subscriptionsService: SubscriptionService,
        private readonly emailService: EmailService,
        private readonly weatherService: WeatherService,
    ) {}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async pushDailyNotifications() {
        this.logger.log('Sending daily notifications...');

        const subscriptions = await this.subscriptionsService.findActiveByFrequency(SubscribeFreq.daily);
        await this.sendNotifications(subscriptions);
    }

    @Cron(CronExpression.EVERY_WEEK)
    async pushWeeklyNotifications() {
        this.logger.log('Sending weekly notifications...');

        const subscriptions: SubscriptionEntity[] = await this.subscriptionsService.findActiveByFrequency(SubscribeFreq.weekly);
        await this.sendNotifications(subscriptions);
    }

    private async sendNotifications(subscriptions: SubscriptionEntity[]) {
        for (const sub of subscriptions) {
            try {
                const { lat, lon } = sub.city;
                const weather: WeatherResponseDto = await this.weatherService.getWeather({ coords: { lat, lon } });
                await this.emailService.sendWeatherData(sub.subscriber.email, weather, sub.city.name);
                this.logger.log(`Sent to ${sub.subscriber.email}`);
            } catch (err) {
                this.logger.error(`Failed to send to ${sub.subscriber.email}`, err.stack);
            }
        }
    }
}
