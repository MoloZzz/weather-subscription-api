import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';

@Entity('cities')
export class CityEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    lat: string;

    @Column()
    lon: string;

    @OneToMany(() => SubscriptionEntity, (sub) => sub.city)
    subscriptions: SubscriptionEntity[];
}
