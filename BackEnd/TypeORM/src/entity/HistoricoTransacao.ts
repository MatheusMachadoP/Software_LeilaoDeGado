import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transacao } from './Transacao';

@Entity()
export class HistoricoTransacao {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @ManyToOne(() => Transacao, transacao => transacao.historicos)
    @JoinColumn({ name: 'transacao_id' })
    transacao: Transacao | undefined;

    @Column()
    carteiraOrigem: string | undefined;

    @Column()
    carteiraDestino: string | undefined;

    @Column('decimal', { precision: 10, scale: 4 })
    valor: number | undefined;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataHora: Date | undefined;
}
