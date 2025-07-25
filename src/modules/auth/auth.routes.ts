import { Router } from 'express';
import { getMe, login, logout, signup } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/test', (req, res) => {
    res.send("<h3>Auth route is working!!!</h3>")
});
authRouter.get('/me', authMiddleware, getMe)
authRouter.post('/logout', logout)

export default authRouter;
