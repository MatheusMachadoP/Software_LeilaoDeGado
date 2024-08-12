import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate, JoinColumn } from 'typeorm';
import { Usuario } from './Usuario';
import { Lance } from './Lance';
import { add } from 'date-fns';

export enum StatusLeilao {
  ABERTO = 'Aberto',
  EM_ANDAMENTO = 'Em Andamento',
  FINALIZADO = 'Finalizado'
}

@Entity()
export class Leilao {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: 'text' })
  nomeAtivo: string | undefined; 

  @Column({ nullable: true })
  raca?: string;

  @Column({ type: 'timestamp' })
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

  @Column({
    type: 'enum',
    enum: StatusLeilao,
    default: StatusLeilao.ABERTO,
  })
  status: StatusLeilao | undefined;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'vencedor_id' })
  vencedor?: Usuario;

  @OneToMany(() => Lance, (lance: any) => lance.leilao) 
  lances: Lance[] | undefined; 

  @Column({ type: 'timestamp', nullable: true })
  dataTermino?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calcularDataTermino() {
    if (this.dataInicio && this.duracao) {
      const [amount, unit] = this.duracao.split(' ');
      this.dataTermino = add(this.dataInicio, { [unit]: parseInt(amount) });
    }
  }
}