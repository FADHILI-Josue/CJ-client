import crypto from 'crypto';

const SALT = process.env.PASSWORD_SALT!;

export const hashPassword = (password: string): string => {
    return crypto.createHmac('sha512', SALT).update(password).digest('hex');
};

export const comparePassword = (password: string, hash: string): boolean => {
    return hashPassword(password) === hash;
};