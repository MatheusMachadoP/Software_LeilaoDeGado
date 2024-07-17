import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuario } from "./Usuario";
// usando "!" vou dizer ao typescript que vou inicializar em algum momento

@Entity()
export class Carteira {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chave_publica!: string;

  @Column()
  nome!: string;

  @ManyToOne(() => Usuario, usuario => usuario.carteiras)
  usuario!: Usuario;
}
