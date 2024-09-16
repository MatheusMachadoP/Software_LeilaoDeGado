"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUsuario = void 0;
const class_validator_1 = require("class-validator");
const Usuario_1 = require("../entity/Usuario");
const class_transformer_1 = require("class-transformer");
const validateUsuario = async (req, res, next) => {
    try {
        // Converte os dados da requisição em uma instância da classe Usuario
        const usuario = (0, class_transformer_1.plainToClass)(Usuario_1.Usuario, req.body);
        // Realiza a validação dos dados com base nos decorators da classe Usuario
        const errors = await (0, class_validator_1.validate)(usuario);
        if (errors.length > 0) {
            // Se houver erros, envia uma resposta com os erros
            return res.status(400).json({ errors });
        }
        // Se não houver erros, passa para o próximo middleware ou rota
        next();
    }
    catch (error) {
        next(error); // Passa o erro para o middleware de tratamento de erros
    }
};
exports.validateUsuario = validateUsuario;
