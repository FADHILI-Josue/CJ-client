import { PrismaClient } from '@prisma/client';
import { AccountDetailsDto } from '../models/account.dto';

const prisma = new PrismaClient();

export class AccountService {
    static async getAccountDetails(userId: string) {
        const account = await prisma.account.findUnique({
            where: { userId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!account) {
            throw new Error('Account not found');
        }

        return new AccountDetailsDto(account);
    }

    static async deposit(userId: string, amount: number) {
        if (amount <= 0) {
            throw new Error('Deposit amount must be positive');
        }

        const result = await prisma.$transaction(async (tx) => {
            const account = await tx.account.update({
                where: { userId },
                data: {
                    balance: { increment: amount },
                },
            });

            const transaction = await tx.transaction.create({
                data: {
                    accountId: account.id,
                    amount,
                    type: 'DEPOSIT',
                },
            });

            return { account, transaction };
        });

        return result;
    }

    static async withdraw(userId: string, amount: number) {
        if (amount <= 0) {
            throw new Error('Withdrawal amount must be positive');
        }

        const result = await prisma.$transaction(async (tx) => {
            const account = await tx.account.findUnique({
                where: { userId },
            });

            if (!account) {
                throw new Error('Account not found');
            }

            if (account.balance.toNumber() < amount) {
                throw new Error('Insufficient balance');
            }

            const updatedAccount = await tx.account.update({
                where: { userId },
                data: {
                    balance: { decrement: amount },
                },
            });

            const transaction = await tx.transaction.create({
                data: {
                    accountId: updatedAccount.id,
                    amount,
                    type: 'WITHDRAWAL',
                },
            });

            return { account: updatedAccount, transaction };
        });

        return result;
    }
}