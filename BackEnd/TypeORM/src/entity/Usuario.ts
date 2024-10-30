import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Leilao } from "./Leilao";
import { Lance } from "./Lance";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    nome_completo!: string;

    @Column({ type: 'text', unique: true })
    email!: string;

    @Column({ type: 'text', nullable: true })
    telefone_celular?: string;

    @Column({ type: 'text', unique: true })
    cpf!: string;

    @Column({ type: 'text' })
    senha!: string;

    @Column({ type: 'text', nullable: true })
    endereco_carteira?: string;

    @Column({ type: 'text', nullable: true })
    foto?: string;

    @Column({ type: 'text' })
    tipo_usuario!: 'Leiloeiro' | 'Licitante';

    @OneToMany(() => Leilao, (leilao) => leilao.criador)
    leiloesCriados!: Leilao[];

    @OneToMany(() => Lance, (lance) => lance.usuario)
    lances!: Lance[];
}
