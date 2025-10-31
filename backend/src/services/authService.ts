import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hashing';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthService {
    static async register(email: string, fullName: string, password: string, deviceId: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = hashPassword(password);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    fullName,
                    password: hashedPassword,
                },
            });

            await tx.account.create({
                data: {
                    userId: user.id,
                },
            });

            await tx.device.create({
                data: {
                    userId: user.id,
                    deviceId,
                    status: 'PENDING',
                },
            });

            return user;
        });

        return result;
    }

    static async login(email: string, password: string, deviceId: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const device = await prisma.device.findFirst({
            where: {
                userId: user.id,
                deviceId,
                status: 'VERIFIED',
            },
        });

        if (!device) {
            throw new Error('Device not verified');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        return { token, user: { id: user.id, email: user.email, fullName: user.fullName } };
    }
}