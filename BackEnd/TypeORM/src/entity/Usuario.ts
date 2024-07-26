import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Leilao } from './Leilao';
import { Lance } from './Lance';
import { UsuarioPerfil } from './UsuarioPerfil';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    nomeCompleto: string | undefined;

    @Column({ unique: true })
    email: string | undefined;

    @Column({ nullable: true })
    telefoneCelular?: string;

    @Column({ unique: true })
    cpf: string | undefined;

    @Column()
    senha: string | undefined; // Certifique-se de armazenar hashes de senha!

    @Column({ nullable: true })
    enderecoCarteira?: string;

    @Column({ nullable: true })
    foto?: string;

    @OneToMany(() => Leilao, leilao => leilao.criador)
    leiloesCriados: Leilao[] | undefined;

    @OneToMany(() => Lance, lance => lance.usuario)
    lances: Lance[] | undefined;

    @OneToMany(() => UsuarioPerfil, usuarioPerfil => usuarioPerfil.usuario)
    perfis: UsuarioPerfil[] | undefined;
}
