import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';

export const register = [
    body('email').isEmail().normalizeEmail(),
    body('fullName').trim().isLength({ min: 2 }),
    body('password').isLength({ min: 6 }),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, fullName, password } = req.body;
        const deviceId = req.headers['device-id'] as string;

        if (!deviceId) {
            return res.status(400).json({ message: 'Device ID required' });
        }

        try {
            await AuthService.register(email, fullName, password, deviceId);
            logger.info(`User registered: ${email}`);
            res.status(201).json({
                message: 'Registration successful. Your device is pending verification by an administrator.',
            });
        } catch (error: any) {
            logger.error(`Registration failed: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    },
];

export const login = [
    body('email').isEmail().normalizeEmail(),
    body('password').exists(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const deviceId = req.headers['device-id'] as string;

        if (!deviceId) {
            return res.status(400).json({ message: 'Device ID required' });
        }

        try {
            const result = await AuthService.login(email, password, deviceId);
            logger.info(`User logged in: ${email}`);
            res.json(result);
        } catch (error: any) {
            logger.warn(`Login failed: ${error.message}`);
            res.status(401).json({ message: error.message });
        }
    },
];