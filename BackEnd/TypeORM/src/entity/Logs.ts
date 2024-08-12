import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './Usuario';

@Entity()
export class Logs {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @ManyToOne(() => Usuario, { nullable: true }) 
    @JoinColumn({ name: 'usuario_id' })
    usuario?: Usuario;

    @Column({ type: 'text' }) // ou @Column({ type: 'varchar', length: 255 }) 
    acao?: string; // Certifique-se de que acao é do tipo string

    @Column({ nullable: true })
    descricao?: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataHora: Date | undefined;
}
