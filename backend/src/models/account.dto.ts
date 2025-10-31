import { Account, Transaction } from '@prisma/client';

export class AccountDetailsDto {
    balance: number;
    lastUpdated: Date;
    transactions: TransactionDto[];

    constructor(account: Account & { transactions: Transaction[] }) {
        this.balance = account.balance.toNumber();
        this.lastUpdated = account.updatedAt;
        this.transactions = account.transactions.map(t => new TransactionDto(t));
    }
}

class TransactionDto {
    id: string;
    amount: number;
    type: string;
    date: Date;

    constructor(transaction: Transaction) {
        this.id = transaction.id;
        this.amount = transaction.amount.toNumber();
        this.type = transaction.type;
        this.date = transaction.createdAt;
    }
}