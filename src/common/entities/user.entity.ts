import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SubscriptionEntity } from './subscription.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: false })
    isConfirmed: boolean;

    @Column({ nullable: true })
    confirmationToken: string;

    @Column({ type: 'timestamp', nullable: true })
    confirmationExpiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => SubscriptionEntity, (sub) => sub.subscriber)
    subscriptions: SubscriptionEntity[];
}
