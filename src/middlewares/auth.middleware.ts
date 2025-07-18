import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.config';
import { generateToken, verifyAccessToken, verifyRefreshToken } from '../modules/auth/auth.utils';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
        tryRefreshToken(req, res, next);
        return;
    }
    try {
        const decoded = verifyAccessToken(accessToken) as { userId: string };
        (req as any).user = decoded;
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            tryRefreshToken(req, res, next);
            return;
        }
        res.status(401).json({ message: 'Unauthorized access' });
        return;
    }
};

const tryRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) return res.status(401).json({ message: 'Unauthorized - No token' });

    try {
        const decoded = verifyRefreshToken(refreshToken) as { userId: string };

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateToken(decoded)

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV !== "development",
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV !== "development",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid refresh token' });
    }
};

