import {MigrationInterface, QueryRunner} from 'typeorm';

export class SeedPermisionLevels1565142480864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      INSERT INTO "permission_level"
      VALUES (1, 'User'), (2, 'Manager'), (3, 'Admin');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      DELETE FROM "permission_level"
      WHERE id IN [1, 2, 3]
    `);
  }
}
