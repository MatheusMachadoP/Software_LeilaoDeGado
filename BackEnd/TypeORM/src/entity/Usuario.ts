import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Carteira } from "./Carteira";

// usando "!" vou dizer ao typescript que vou inicializar em algum momento

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome_completo!: string;

  @Column()
  email!: string;

  @Column()
  telefone!: string;

  @Column()
  cpf!: string;

  @Column()
  senha!: string;

  @Column({ default: false })
  remember_me!: boolean;

  @OneToMany(() => Carteira, carteira => carteira.usuario)
  carteiras!: Carteira[];
}
