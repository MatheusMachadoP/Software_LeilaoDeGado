import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Leilao } from "./Leilao";
import { Lance } from "./Lance";
import { UsuarioPerfil } from "./UsuarioPerfil";

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ type: 'text'})
    nome_completo!: string;

    @Column({ type: 'text' })
    email!: string;

    @Column({ type: 'text', nullable: true})
    telefone_celular!: string;

    @Column({ type: 'text'})
    cpf!: string;

    @Column({ type: 'text'})
    senha!: string;

    @Column({ type: 'text', nullable: true })
    endereco_carteira!: string;

    @Column({ type: 'text', nullable: true })
    foto!: string;

    @OneToMany(() => Leilao, leilao => leilao.criador)
    leiloesCriados: Leilao[] | undefined;

    @OneToMany(() => Lance, lance => lance.usuario)
    lances: Lance[] | undefined;

    @OneToMany(() => UsuarioPerfil, usuarioPerfil => usuarioPerfil.usuario)
    perfis: UsuarioPerfil[] | undefined;
}
