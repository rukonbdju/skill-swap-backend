import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.config';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    const errors = err.errors || null;

    return res.status(status).json({
        success: false,
        message,
        errors,
        stack: ENV.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
