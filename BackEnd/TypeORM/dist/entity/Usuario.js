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
exports.Usuario = void 0;
const typeorm_1 = require("typeorm");
const Leilao_1 = require("./Leilao");
const Lance_1 = require("./Lance");
const UsuarioPerfil_1 = require("./UsuarioPerfil");
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Object)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "nome_completo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "telefone_celular", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Usuario.prototype, "senha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "endereco_carteira", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Usuario.prototype, "foto", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Leilao_1.Leilao, leilao => leilao.criador),
    __metadata("design:type", Object)
], Usuario.prototype, "leiloesCriados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Lance_1.Lance, lance => lance.usuario),
    __metadata("design:type", Object)
], Usuario.prototype, "lances", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UsuarioPerfil_1.UsuarioPerfil, usuarioPerfil => usuarioPerfil.usuario),
    __metadata("design:type", Object)
], Usuario.prototype, "perfis", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)()
], Usuario);
