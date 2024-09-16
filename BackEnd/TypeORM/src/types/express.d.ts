import { Usuario } from '../entity/Usuario';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Usuario;
  }
}
