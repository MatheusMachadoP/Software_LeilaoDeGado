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
exports.Transacao = void 0;
const typeorm_1 = require("typeorm");
const Lance_1 = require("./Lance");
const HistoricoTransacao_1 = require("./HistoricoTransacao");
let Transacao = class Transacao {
};
exports.Transacao = Transacao;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Object)
], Transacao.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Lance_1.Lance, { nullable: true }) // Um lance pode não estar associado a uma transação
    ,
    (0, typeorm_1.JoinColumn)({ name: 'lance_id' }),
    __metadata("design:type", Lance_1.Lance)
], Transacao.prototype, "lance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Transacao.prototype, "enderecoCarteira", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Object)
], Transacao.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Object)
], Transacao.prototype, "dataHora", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Transacao.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }) // Opcional: Tipo da transação
    ,
    __metadata("design:type", String)
], Transacao.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HistoricoTransacao_1.HistoricoTransacao, historico => historico.transacao),
    __metadata("design:type", Object)
], Transacao.prototype, "historicos", void 0);
exports.Transacao = Transacao = __decorate([
    (0, typeorm_1.Entity)()
], Transacao);