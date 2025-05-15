import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubscruptionUniqueUpdate1747339822709 implements MigrationInterface {
    name = 'SubscruptionUniqueUpdate1747339822709';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "subscriptions" ADD CONSTRAINT "UQ_86ac806c08e4433a39bff633342" UNIQUE ("subscriber_id", "city_id")`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "UQ_86ac806c08e4433a39bff633342"`);
    }
}
