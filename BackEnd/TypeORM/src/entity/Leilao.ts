import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Usuario } from './Usuario';
import { Lance } from './Lance';

@Entity()
export class Leilao {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column()
    nomeAtivo: string | undefined;

    @Column({ nullable: true })
    raca?: string;

    @Column()
    dataInicio: Date | undefined;

    @Column('decimal', { precision: 10, scale: 2 })
    valorInicial: number | undefined;

    @Column('interval')
    duracao: string | undefined;

    @Column({ nullable: true })
    descricao?: string;

    @Column({ nullable: true })
    foto?: string;

    @ManyToOne(() => Usuario, usuario => usuario.leiloesCriados)
    @JoinColumn({ name: 'criador_id' })
    criador: Usuario | undefined;

    @Column({ default: 'Aberto' })
    status: string | undefined;

    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'vencedor_id' })
    vencedor?: Usuario;

    @OneToMany(() => Lance, (lance: any) => lance.leilao) // forwardRef para evitar circular dependency
    lances: Lance[] = []; // Inicializa com um array vazio

    @Column({ type: 'timestamp', nullable: true })
    dataTermino?: Date;

    @BeforeInsert()
    @BeforeUpdate()
    calcularDataTermino() {
        if (this.dataInicio && this.duracao) {
            const [amount, unit] = this.duracao.split(' ');
            this.dataTermino = addInterval(this.dataInicio, { [unit]: parseInt(amount) });
        }
    }
}
function addInterval(dataInicio: Date, arg1: { [x: string]: number; }): Date {
    throw new Error('Function not implemented.');
}

