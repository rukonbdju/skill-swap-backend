
import { pool } from '../../config/db.config';
import { UserProfile } from './user.types';

export const findUserById = async (id: number): Promise<UserProfile | null> => {
    const res = await pool.query(
        `SELECT id, name, email, bio, created_at FROM users WHERE id = $1`,
        [id]
    );
    return res.rows[0] || null;
};
