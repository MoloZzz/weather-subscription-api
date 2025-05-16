import { MigrationInterface, QueryRunner } from 'typeorm';

export class UniqueCities1747433217788 implements MigrationInterface {
    name = 'UniqueCities1747433217788';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TYPE "public"."subscriptions_frequency_enum" RENAME TO "subscriptions_frequency_enum_old"`,
        );
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_frequency_enum" AS ENUM('weekly', 'daily')`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "frequency" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "subscriptions" ALTER COLUMN "frequency" TYPE "public"."subscriptions_frequency_enum" USING "frequency"::"text"::"public"."subscriptions_frequency_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "frequency" SET DEFAULT 'daily'`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_frequency_enum_old"`);
        await queryRunner.query(`ALTER TABLE "cities" ADD CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cities" DROP CONSTRAINT "UQ_a0ae8d83b7d32359578c486e7f6"`);
        await queryRunner.query(`CREATE TYPE "public"."subscriptions_frequency_enum_old" AS ENUM('hourly', 'daily')`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "frequency" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "subscriptions" ALTER COLUMN "frequency" TYPE "public"."subscriptions_frequency_enum_old" USING "frequency"::"text"::"public"."subscriptions_frequency_enum_old"`,
        );
        await queryRunner.query(`ALTER TABLE "subscriptions" ALTER COLUMN "frequency" SET DEFAULT 'daily'`);
        await queryRunner.query(`DROP TYPE "public"."subscriptions_frequency_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."subscriptions_frequency_enum_old" RENAME TO "subscriptions_frequency_enum"`,
        );
    }
}
