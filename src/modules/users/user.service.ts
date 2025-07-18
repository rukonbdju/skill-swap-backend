import * as repo from './user.repository';

export const getProfile = (userId: number) => {
    return repo.findUserById(userId);
};
