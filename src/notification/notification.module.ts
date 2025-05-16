import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { EmailModule } from 'src/integrations/email/email.module';
import { WeatherModule } from 'src/weather/weather.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [SubscriptionModule, EmailModule, WeatherModule, ScheduleModule.forRoot()],
    providers: [NotificationService],
})
export class NotificationModule {}
