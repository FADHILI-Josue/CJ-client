import apiClient from './api';

export interface AccountDetails {
    balance: number;
    lastUpdated: Date;
    transactions: Transaction[];
}

export interface Transaction {
    id: string;
    amount: number;
    type: string;
    date: string;
}

export interface TransactionResponse {
    message: string;
    balance: number;
    transaction: Transaction;
}

export const accountService = {
    async getAccountDetails(): Promise<AccountDetails> {
        const response = await apiClient.get('/account/me');
        return response.data;
    },

    async deposit(amount: number): Promise<TransactionResponse> {
        const response = await apiClient.post('/account/deposit', { amount });
        return response.data;
    },

    async withdraw(amount: number): Promise<TransactionResponse> {
        const response = await apiClient.post('/account/withdraw', { amount });
        return response.data;
    },
};