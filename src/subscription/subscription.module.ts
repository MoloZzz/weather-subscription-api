import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { SubscriptionEntity } from 'src/common/entities/subscription.entity';
import { CityModule } from 'src/city/city.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, SubscriptionEntity]), CityModule, UserModule],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService],
})
export class SubscriptionModule {}
