import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Usuario } from './Usuario';
import { Lance } from './Lance';
import { addHours, addMinutes } from 'date-fns';

export enum StatusLeilao {
  ABERTO = 'Aberto',
  FECHADO = 'Fechado',
  CANCELADO = 'Cancelado',
}

@Entity()
export class Leilao {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'text', name: 'nome_ativo' })
  nomeAtivo?: string;

  @Column({ nullable: true })
  raca?: string;

  @Column({ type: 'timestamp', name: 'data_inicio' })
  dataInicio!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'valor_inicial' })
  valorInicial!: number;

  @Column({ type: 'int', nullable: true, name: 'horas_duracao' })
  horasDuracao?: number;

  @Column({ type: 'int', nullable: true, name: 'minutos_duracao' })
  minutosDuracao?: number;

  @Column({ nullable: true })
  descricao?: string;

  @Column({ nullable: true })
  foto?: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.leiloesCriados, { eager: true })
  @JoinColumn({ name: 'criador_id' })
  criador?: Usuario;

  @Column({
    type: 'enum',
    enum: StatusLeilao,
    default: StatusLeilao.ABERTO,
  })
  status!: StatusLeilao;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'vencedor_id' })
  vencedor?: Usuario;

  @OneToMany(() => Lance, (lance) => lance.leilao)
  lances!: Lance[];

  @Column({ type: 'timestamp', nullable: true, name: 'data_termino' })
  dataTermino?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calcularDataTermino() {
    if (this.dataInicio) {
      let dataTermino = new Date(this.dataInicio);

      if (this.horasDuracao) {
        dataTermino = addHours(dataTermino, this.horasDuracao);
      }
      if (this.minutosDuracao) {
        dataTermino = addMinutes(dataTermino, this.minutosDuracao);
      }

      this.dataTermino = dataTermino;
    }
  }
}