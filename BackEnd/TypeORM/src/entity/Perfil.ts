// Perfil.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioPerfil } from './UsuarioPerfil';

@Entity()
export class Perfil {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ type: 'text' }) // ou @Column({ type: 'varchar', length: 255 }) 
    nome?: string; 

    @Column({ nullable: true })
    descricao?: string;

    @OneToMany(() => UsuarioPerfil, usuarioPerfil => usuarioPerfil.perfil)
    usuarios?: UsuarioPerfil[];
}
