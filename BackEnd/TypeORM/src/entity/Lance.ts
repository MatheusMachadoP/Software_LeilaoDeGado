import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Leilao } from './Leilao';
import { Usuario } from './Usuario';

@Entity()
export class Lance {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column('decimal', { precision: 10, scale: 2 })
    valor: number | undefined;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    dataHora: Date | undefined;

    @ManyToOne(() => Leilao, (leilao: any) => leilao.lances)
    @JoinColumn({ name: 'leilao_id' })
    leilao: Leilao | undefined;

    @ManyToOne(() => Usuario, usuario => usuario.lances)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario | undefined;
}