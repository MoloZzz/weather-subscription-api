import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CityEntity } from './city.entity';
import { UserEntity } from './user.entity';
import { SubscribeFreq } from '../enums';

@Entity('subscriptions')
export class SubscriptionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity, (subscriber) => subscriber.subscriptions, { onDelete: 'CASCADE' })
    subscriber: UserEntity;

    @ManyToOne(() => CityEntity, (city) => city.subscriptions, { onDelete: 'CASCADE' })
    city: CityEntity;

    @Column({ type: 'enum', enum: SubscribeFreq, default: 'daily' })
    frequency: SubscribeFreq;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
