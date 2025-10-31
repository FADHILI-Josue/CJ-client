import { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AccountService } from '../services/accountService';
import { AuthRequest } from '../middlewares/auth';
import { logger } from '../utils/logger';

export const getAccount = async (req: AuthRequest, res: Response) => {
    try {
        const accountDetails = await AccountService.getAccountDetails(req.user!.id);
        res.json(accountDetails);
    } catch (error: any) {
        logger.error(`Get account failed: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const deposit = [
    body('amount').isFloat({ min: 0.01 }),
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount } = req.body;

        try {
            const result = await AccountService.deposit(req.user!.id, amount);
            logger.info(`Deposit: ${amount} for user ${req.user!.id}`);
            res.json({
                message: 'Deposit successful',
                balance: result.account.balance.toNumber(),
                transaction: result.transaction,
            });
        } catch (error: any) {
            logger.error(`Deposit failed: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    },
];

export const withdraw = [
    body('amount').isFloat({ min: 0.01 }),
    async (req: AuthRequest, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { amount } = req.body;

        try {
            const result = await AccountService.withdraw(req.user!.id, amount);
            logger.info(`Withdrawal: ${amount} for user ${req.user!.id}`);
            res.json({
                message: 'Withdrawal successful',
                balance: result.account.balance.toNumber(),
                transaction: result.transaction,
            });
        } catch (error: any) {
            logger.error(`Withdrawal failed: ${error.message}`);
            res.status(400).json({ message: error.message });
        }
    },
];