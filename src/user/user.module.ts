import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/common/entities/user.entity';
import { EmailModule } from 'src/integrations/email/email.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
