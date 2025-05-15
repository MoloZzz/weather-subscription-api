import { DynamicModule, Module } from '@nestjs/common';
import { PostgresqlService } from './postgresql.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export interface IDbOptions {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging: boolean;
}

@Module({
    providers: [PostgresqlService],
})
export class PostgresqlModule {
    static register(
        entities: Function[],
        migrations: Function[],
        subscribers: Function[],
        dbOptions?: IDbOptions,
    ): DynamicModule {
        return {
            module: PostgresqlModule,
            imports: [
                TypeOrmModule.forRootAsync({
                    useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
                        type: 'postgres',
                        host: dbOptions?.host ?? configService.get<string>('POSTGRES_HOST'),
                        port: dbOptions?.port ?? configService.get<number>('POSTGRES_PORT'),
                        username: dbOptions?.username ?? configService.get<string>('POSTGRES_USER'),
                        password: dbOptions?.password ?? configService.get<string>('POSTGRES_PASS'),
                        database: dbOptions?.database ?? configService.get<string>('POSTGRES_DB_NAME'),
                        logging: dbOptions?.logging ?? configService.get<string>('POSTGRES_IS_LOGGING_ENABLED') === 'true',
                        migrationsTableName: '_migrations',
                        logger: 'advanced-console',
                        migrations,
                        entities,
                        subscribers,
                        migrationsRun: true,
                        synchronize: false,
                        namingStrategy: new SnakeNamingStrategy(),
                    }),
                    inject: [ConfigService],
                }),
            ],
            exports: [TypeOrmModule],
        };
    }
}
