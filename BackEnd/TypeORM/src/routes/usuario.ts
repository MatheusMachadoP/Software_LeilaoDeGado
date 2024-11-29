import express, { Router, Request, Response, NextFunction } from 'express';
import { updateWalletAddress, removeWalletAddress } from '../controllers/usuario';
import authenticateJWT from '../middlewares/authenticateJWT';

const router = express.Router();



export default router;