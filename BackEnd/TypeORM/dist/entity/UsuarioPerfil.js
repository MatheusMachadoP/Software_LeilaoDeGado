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
exports.UsuarioPerfil = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const Perfil_1 = require("./Perfil");
let UsuarioPerfil = class UsuarioPerfil {
};
exports.UsuarioPerfil = UsuarioPerfil;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Object)
], UsuarioPerfil.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, usuario => usuario.perfis),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", Object)
], UsuarioPerfil.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Perfil_1.Perfil, (perfil) => perfil.usuarios),
    (0, typeorm_1.JoinColumn)({ name: 'perfil_id' }),
    __metadata("design:type", Object)
], UsuarioPerfil.prototype, "perfil", void 0);
exports.UsuarioPerfil = UsuarioPerfil = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['usuario', 'perfil']) // Garante a unicidade da combinação usuário-perfil
], UsuarioPerfil);
