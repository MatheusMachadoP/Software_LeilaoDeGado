import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Usuario } from '../entity/Usuario';

const validateUsuario = (req: Request, res: Response, next: NextFunction) => {
    (async () => {
        try {
            // Convert the request body to a Usuario instance
            const usuario = plainToClass(Usuario, req.body);

            // Validate the Usuario instance
            const errors = await validate(usuario);

            if (errors.length > 0) {
                // Format validation errors
                const formattedErrors = errors.map((error) => ({
                    field: error.property,
                    issues: error.constraints,
                }));

                res.status(400).json({
                    message: 'Validation error',
                    errors: formattedErrors,
                });
                return;
            }

            // Proceed if validation is successful
            next();
        } catch (error) {
            console.error('Error validating user:', error);
            next(error); // Pass the error to the error-handling middleware
        }
    })();
};

export default validateUsuario;
