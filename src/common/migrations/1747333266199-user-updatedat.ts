import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserUpdatedAt1747333266199 implements MigrationInterface {
    name = 'UserUpdatedAt1747333266199';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
    }
}
