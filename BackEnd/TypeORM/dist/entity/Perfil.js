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
exports.Perfil = void 0;
// Perfil.ts
const typeorm_1 = require("typeorm");
const UsuarioPerfil_1 = require("./UsuarioPerfil");
let Perfil = class Perfil {
};
exports.Perfil = Perfil;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Perfil.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }) // ou @Column({ type: 'varchar', length: 255 }) 
    ,
    __metadata("design:type", String)
], Perfil.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Perfil.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UsuarioPerfil_1.UsuarioPerfil, usuarioPerfil => usuarioPerfil.perfil),
    __metadata("design:type", Array)
], Perfil.prototype, "usuarios", void 0);
exports.Perfil = Perfil = __decorate([
    (0, typeorm_1.Entity)()
], Perfil);
