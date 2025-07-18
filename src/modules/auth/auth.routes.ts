import { Router } from 'express';
import { getMe, login, signup } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/me', authMiddleware, getMe)

export default authRouter;
