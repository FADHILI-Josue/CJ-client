import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';
import { accountService, AccountDetails, Transaction } from '../services/accountService';

const Dashboard = () => {
  const [accountData, setAccountData] = useState<AccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [transactionAmount, setTransactionAmount] = useState('');
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      const data = await accountService.getAccountDetails();
      setAccountData(data);
    } catch (error: any) {
      toast.error('Failed to load account data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransaction = async (type: 'deposit' | 'withdraw') => {
    const amount = parseFloat(transactionAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (type === 'withdraw' && accountData && amount > accountData.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsTransactionLoading(true);
    try {
      if (type === 'deposit') {
        await accountService.deposit(amount);
        toast.success('Deposit successful!');
      } else {
        await accountService.withdraw(amount);
        toast.success('Withdrawal successful!');
      }
      setTransactionAmount('');
      await loadAccountData(); // Refresh data
    } catch (error: any) {
      toast.error(error.response?.data?.message || `${type} failed`);
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Credit Jambo</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.fullName}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Account Balance Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">$</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Account Balance
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${accountData?.balance.toFixed(2) || '0.00'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Form */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Make a Transaction
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleTransaction('deposit')}
                      disabled={isTransactionLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {isTransactionLoading ? 'Processing...' : 'Deposit'}
                    </button>
                    <button
                      onClick={() => handleTransaction('withdraw')}
                      disabled={isTransactionLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      {isTransactionLoading ? 'Processing...' : 'Withdraw'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Transaction History
                </h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {accountData?.transactions.map((transaction: Transaction) => (
                  <li key={transaction.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'DEPOSIT' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <span className={`text-sm font-medium ${
                            transaction.type === 'DEPOSIT' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {transaction.type === 'DEPOSIT' ? '+' : '-'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.type}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </li>
                ))}
                {(!accountData?.transactions || accountData.transactions.length === 0) && (
                  <li className="px-4 py-8 text-center text-gray-500">
                    No transactions yet
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;