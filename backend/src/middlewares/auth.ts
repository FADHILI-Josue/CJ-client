import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: string };
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export const requireDeviceVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const deviceId = req.headers['device-id'] as string;

    if (!deviceId || !req.user) {
        return res.status(400).json({ message: 'Device ID required' });
    }

    try {
        const device = await prisma.device.findFirst({
            where: {
                userId: req.user.id,
                deviceId: deviceId,
                status: 'VERIFIED',
            },
        });

        if (!device) {
            return res.status(403).json({ message: 'Device not verified' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};