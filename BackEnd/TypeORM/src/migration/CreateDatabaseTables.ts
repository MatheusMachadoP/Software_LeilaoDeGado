import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDatabaseTablesXXXXXXXXXXXXXX implements MigrationInterface {
  name = "CreateDatabaseTablesXXXXXXXXXXXXXX";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE status_leilao AS ENUM ('Aberto', 'Em Andamento', 'Finalizado');

      CREATE TABLE perfil (
        id SERIAL PRIMARY KEY,
        nome TEXT UNIQUE NOT NULL,
        descricao TEXT
      );

      INSERT INTO perfil (nome) VALUES ('Licitante'), ('Leiloeiro');

      CREATE TABLE usuario (
        id SERIAL PRIMARY KEY,
        nome_completo TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        telefone_celular TEXT,
        cpf TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        endereco_carteira TEXT,
        foto TEXT
      );

      CREATE TABLE usuario_perfil (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuario(id),
        perfil_id INTEGER REFERENCES perfil(id),
        UNIQUE (usuario_id, perfil_id)
      );

      CREATE TABLE leilao (
        id SERIAL PRIMARY KEY,
        nome_ativo TEXT NOT NULL,
        raca TEXT,
        data_inicio TIMESTAMP NOT NULL,
        valor_inicial DECIMAL(10,2) NOT NULL,
        duracao INTERVAL NOT NULL,
        descricao TEXT,
        foto TEXT,
        criador_id INTEGER REFERENCES usuario(id),
        status status_leilao NOT NULL DEFAULT 'Aberto',
        vencedor_id INTEGER REFERENCES usuario(id),
        data_termino TIMESTAMP
      );

      CREATE TABLE lance (
        id SERIAL PRIMARY KEY,
        valor DECIMAL(10,2) NOT NULL,
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        leilao_id INTEGER REFERENCES leilao(id),
        usuario_id INTEGER REFERENCES usuario(id),
        UNIQUE (leilao_id, usuario_id)
      );

      CREATE OR REPLACE FUNCTION valida_lance() RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.usuario_id = (SELECT criador_id FROM leilao WHERE id = NEW.leilao_id) THEN
          RAISE EXCEPTION 'O criador do leilão não pode fazer lances no próprio leilão';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER valida_lance_trigger
      BEFORE INSERT ON lance
      FOR EACH ROW EXECUTE FUNCTION valida_lance();

      CREATE TABLE transacao (
        id SERIAL PRIMARY KEY,
        lance_id INTEGER REFERENCES lance(id),
        endereco_carteira TEXT NOT NULL,
        valor DECIMAL(10,2) NOT NULL,
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL,
        tipo TEXT
      );

      CREATE TABLE historico_transacao (
        id SERIAL PRIMARY KEY,
        transacao_id INTEGER REFERENCES transacao(id),
        carteira_origem TEXT NOT NULL,
        carteira_destino TEXT NOT NULL,
        valor DECIMAL(10,4) NOT NULL,
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE logs (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER REFERENCES usuario(id),
        acao TEXT,
        descricao TEXT,
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE logs;
      DROP TABLE historico_transacao;
      DROP TABLE transacao;
      DROP TABLE lance;
      DROP TABLE leilao;
      DROP TABLE usuario_perfil;
      DROP TABLE usuario;
      DROP TABLE perfil;
      DROP TYPE status_leilao;
    `);
  }
}
