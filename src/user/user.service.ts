import { BadRequestException, Injectable } from '@nestjs/common';
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

    async findOrCreate(email: string): Promise<UserEntity> {
        let user = await this.findByEmail(email);
        if (user) return user;

        return await this.userRepository.save({
            email,
            isConfirmed: false,
        });
    }

    async setUserConfirmation(user: UserEntity): Promise<void> {
        user.confirmationToken = uuidv4();
        user.confirmationExpiresAt = dayjs().add(15, 'minutes').toDate();
        await this.userRepository.save(user);
        if (user.isConfirmed) {
            await this.emailService.sendLetter(user.email, 'You are already confirmed', `Your new token - ${user.confirmationToken}, old is not valid`);
            return;
        }else{
            await this.emailService.sendConfirmationEmail(user.email, user.confirmationToken);
        };
    }

    async save(user: UserEntity): Promise<UserEntity> {
        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async findByToken(token: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({
            where: { confirmationToken: token },
            relations: ['subscriptions'],
        });
    }

    async deactivateToken(token: string): Promise<void> {
        await this.userRepository.update({ confirmationToken: token }, { confirmationToken: null, confirmationExpiresAt: null });
    }

    async confirmEmail(token: string): Promise<UserEntity> {
        const user = await this.userRepository.findOne({
            where: { confirmationToken: token },
            relations: ['subscriptions'],
        });

        if (!user || !user.confirmationExpiresAt || user.confirmationExpiresAt < new Date()) {
            throw new BadRequestException('Confirmation token is invalid or expired');
        }

        if(user.isConfirmed) {
            throw new BadRequestException('Email is already confirmed');
        }

        user.isConfirmed = true;
        return await this.userRepository.save(user);
    }
}
