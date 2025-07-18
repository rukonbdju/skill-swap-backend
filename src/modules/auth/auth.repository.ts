import { pool } from "../../config/db.config";

export const findUserByEmail = async (email: string) => {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0];
};
export const findUserById = async (userId: string) => {
    const res = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return res.rows[0];
};

export const createUser = async (userInfo: { name: string, email: string, passwordHash: string }) => {
    const res = await pool.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *`,
        [userInfo, userInfo.email, userInfo.passwordHash]
    );
    return res.rows[0];
};
