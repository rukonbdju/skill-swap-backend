import bcrypt from 'bcrypt';
import * as repo from './auth.repository';
import { SignupInput, LoginInput } from './auth.types';
import { UserProfile } from '../users/user.types';
import { ApiError } from '../../utils/ApiError';

export const signup = async (input: SignupInput): Promise<UserProfile> => {
    const { name, email, password } = input
    if (password.length < 6) throw new ApiError(401, 'Minimum length of password is 6.')
    const existingUser = await repo.findUserByEmail(email);
    if (existingUser) throw new ApiError(401, 'User already exist.');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await repo.createUser({ name, email, passwordHash });
    return user
};

export const login = async (input: LoginInput): Promise<UserProfile> => {
    const { email, password } = input
    const user = await repo.findUserByEmail(email);
    if (!user) throw new ApiError(404, 'User not found');
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new ApiError(403, 'Invalid password');
    return user;
};

export const getMe = async (userId: string): Promise<UserProfile> => {
    const user = await repo.findUserById(userId)
    if (!user) throw new ApiError(404, 'User not found')
    return user;
}

