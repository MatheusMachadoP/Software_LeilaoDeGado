import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioPerfil } from './UsuarioPerfil';

@Entity()
export class Perfil {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ unique: true })
    nome: string | undefined;

    @Column({ nullable: true }) // Opcional: Descrição do perfil
    descricao?: string;

    @OneToMany(() => UsuarioPerfil, usuarioPerfil => usuarioPerfil.perfil)
    usuarios: UsuarioPerfil[] | undefined;
}
