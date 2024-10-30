import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Transacao } from './Transacao';

@Entity()
export class HistoricoTransacao {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @ManyToOne(() => Transacao, transacao => transacao.historicos)
    @JoinColumn({ name: 'transacao_id' })
    transacao: Transacao | undefined;

    @Column({ type: 'text' }) // ou @Column({ type: 'varchar', length: 255 }) 
    carteiraOrigem?: string; // Certifique-se de que carteiraOrigem é do tipo string

    @Column({ type: 'text' }) // ou @Column({ type: 'varchar', length: 255 }) 
    carteiraDestino?: string; // Certifique-se de que carteiraDestino é do tipo string

    @Column('decimal', { precision: 10, scale: 4 })
    valor: number | undefined;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataHora: Date | undefined;
}