import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Usuario } from './Usuario';
import { Perfil } from './Perfil';

@Entity()
@Unique(['usuario', 'perfil']) // Garante a unicidade da combinação usuário-perfil
export class UsuarioPerfil {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @ManyToOne(() => Usuario, usuario => usuario.perfis)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario | undefined;

    @ManyToOne(() => Perfil, (perfil: { usuarios: any; }) => perfil.usuarios)
    @JoinColumn({ name: 'perfil_id' })
    perfil: Perfil;
}
