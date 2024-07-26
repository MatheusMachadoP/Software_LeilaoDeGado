import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './Usuario';

@Entity()
export class Logs {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @ManyToOne(() => Usuario, { nullable: true }) // Uma ação pode não estar associada a um usuário
    @JoinColumn({ name: 'usuario_id' })
    usuario?: Usuario;

    @Column()
    acao: string | undefined;

    @Column({ nullable: true })
    descricao?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataHora: Date | undefined;
}
