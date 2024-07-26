import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Lance } from './Lance';
import { HistoricoTransacao } from './HistoricoTransacao';

@Entity()
export class Transacao {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @ManyToOne(() => Lance, { nullable: true }) // Um lance pode não estar associado a uma transação
    @JoinColumn({ name: 'lance_id' })
    lance?: Lance;

    @Column()
    enderecoCarteira: string | undefined;

    @Column('decimal', { precision: 10, scale: 2 })
    valor: number | undefined;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataHora: Date | undefined;

    @Column()
    status: string | undefined; // 'Pendente', 'Confirmada', 'Falhou', etc.

    @Column({ nullable: true }) // Opcional: Tipo da transação
    tipo?: string; 

    @OneToMany(() => HistoricoTransacao, historico => historico.transacao)
    historicos: HistoricoTransacao[] | undefined;
}
