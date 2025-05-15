import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findOrCreate(email: string): Promise<UserEntity> {
        const existing = await this.findByEmail(email);
        if (existing) return existing;

        const newUser = this.userRepository.create({
            email,
            isConfirmed: false,
            confirmationToken: uuidv4(),
            confirmationExpiresAt: dayjs().add(15, 'minutes').toDate(), // 15 minutes confirmation time
        });

        return this.userRepository.save(newUser);
    }

    async updateConfirmationToken(email: string): Promise<UserEntity> {
        const user = await this.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');

        user.confirmationToken = uuidv4();
        user.confirmationExpiresAt = dayjs().add(10, 'minutes').toDate();

        return this.userRepository.save(user);
    }

    async confirmEmail(email: string, token: string): Promise<void> {
        const user = await this.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        if (user.isConfirmed) return;

        const now = new Date();

        if (user.confirmationToken !== token) {
            throw new ConflictException('Invalid confirmation code');
        }

        if (!user.confirmationExpiresAt || user.confirmationExpiresAt < now) {
            throw new ConflictException('Confirmation code expired');
        }

        user.isConfirmed = true;
        user.confirmationToken = null;
        user.confirmationExpiresAt = null;

        await this.userRepository.save(user);
    }
}
