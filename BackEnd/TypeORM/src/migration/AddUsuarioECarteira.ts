import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsuariosECarteiras1632679009070 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nome_completo TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                telefone TEXT UNIQUE NOT NULL,
                cpf TEXT UNIQUE NOT NULL,
                senha TEXT NOT NULL,
                remember_me BOOLEAN DEFAULT FALSE
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS carteiras (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
                chave_publica TEXT NOT NULL,
                nome TEXT NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS carteiras;`);
        await queryRunner.query(`DROP TABLE IF EXISTS usuarios;`);
    }
}
