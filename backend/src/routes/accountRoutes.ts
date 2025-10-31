import { Router } from 'express';
import { getAccount, deposit, withdraw } from '../controllers/accountController';
import { authenticateToken, requireDeviceVerification } from '../middlewares/auth';

const router = Router();

// Apply authentication and device verification to all account routes
router.use(authenticateToken);
router.use(requireDeviceVerification);

/**
 * @swagger
 * /account/me:
 *   get:
 *     summary: Get account details and transaction history
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Device not verified
 */
router.get('/me', getAccount);

/**
 * @swagger
 * /account/deposit:
 *   post:
 *     summary: Deposit money into account
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *     responses:
 *       200:
 *         description: Deposit successful
 *       400:
 *         description: Invalid amount
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Device not verified
 */
router.post('/deposit', deposit);

/**
 * @swagger
 * /account/withdraw:
 *   post:
 *     summary: Withdraw money from account
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *     responses:
 *       200:
 *         description: Withdrawal successful
 *       400:
 *         description: Invalid amount or insufficient balance
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Device not verified
 */
router.post('/withdraw', withdraw);

export default router;