"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leilao = exports.StatusLeilao = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Lance_1 = require("./Lance");
const date_fns_1 = require("date-fns");
var StatusLeilao;
(function (StatusLeilao) {
    StatusLeilao["ABERTO"] = "Aberto";
    StatusLeilao["EM_ANDAMENTO"] = "Em Andamento";
    StatusLeilao["FINALIZADO"] = "Finalizado";
})(StatusLeilao || (exports.StatusLeilao = StatusLeilao = {}));
let Leilao = class Leilao {
    calcularDataTermino() {
        if (this.dataInicio && this.duracao) {
            const [amount, unit] = this.duracao.split(' ');
            this.dataTermino = (0, date_fns_1.add)(this.dataInicio, { [unit]: parseInt(amount) });
        }
    }
};
exports.Leilao = Leilao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Object)
], Leilao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", Object)
], Leilao.prototype, "nomeAtivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Leilao.prototype, "raca", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Object)
], Leilao.prototype, "dataInicio", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], Leilao.prototype, "valorInicial", void 0);
__decorate([
    (0, typeorm_1.Column)('interval'),
    __metadata("design:type", Object)
], Leilao.prototype, "duracao", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Leilao.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Leilao.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, usuario => usuario.leiloesCriados),
    (0, typeorm_1.JoinColumn)({ name: 'criador_id' }),
    __metadata("design:type", Object)
], Leilao.prototype, "criador", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StatusLeilao,
        default: StatusLeilao.ABERTO,
    }),
    __metadata("design:type", Object)
], Leilao.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'vencedor_id' }),
    __metadata("design:type", Usuario_1.Usuario)
], Leilao.prototype, "vencedor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Lance_1.Lance, (lance) => lance.leilao),
    __metadata("design:type", Object)
], Leilao.prototype, "lances", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Leilao.prototype, "dataTermino", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Leilao.prototype, "calcularDataTermino", null);
exports.Leilao = Leilao = __decorate([
    (0, typeorm_1.Entity)()
], Leilao);
