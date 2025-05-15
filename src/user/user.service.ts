import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as dayjs from 'dayjs';
import { EmailService } from 'src/integrations/email/email.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly emailService: EmailService,
    ) {}

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findOrCreate(email: string): Promise<UserEntity> {
        const existing = await this.findByEmail(email);
        if (existing) return existing;

        const user = this.userRepository.create({
            email,
            isConfirmed: false,
            confirmationToken: uuidv4(),
            confirmationExpiresAt: dayjs().add(15, 'minutes').toDate(), // 15 minutes confirmation time
        });

        await this.emailService.sendConfirmationEmail(user.email, user.confirmationToken);

        return this.userRepository.save(user);
    }

    async findByToken(token: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: { confirmationToken: token },
            relations: ['subscriptions'],
        });
    }

    async save(user: UserEntity): Promise<UserEntity> {
        return this.userRepository.save(user);
    }
}
