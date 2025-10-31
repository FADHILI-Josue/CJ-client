import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { accountService, Transaction } from '../services/accountService';
import Layout from '../components/Layout';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const accountData = await accountService.getAccountDetails();
      setTransactions(accountData.transactions || []);
    } catch (error: any) {
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesType = filterType === 'all' || transaction.type.toLowerCase() === filterType;
      const matchesSearch = searchTerm === '' ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.toString().includes(searchTerm);
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalDeposits = transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'WITHDRAW')
    .reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">View and manage all your account transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">+</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Deposits
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${totalDeposits.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">-</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Withdrawals
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      ${totalWithdrawals.toFixed(2)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">#</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Transactions
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {transactions.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'deposit', 'withdraw'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize ${
                    filterType === type
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Transactions ({filteredTransactions.length})
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
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
                        {new Date(transaction.date).toLocaleDateString()} at{' '}
                        {new Date(transaction.date).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      transaction.type === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'DEPOSIT' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {transaction.id.slice(-8)}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {filteredTransactions.length === 0 && (
              <li className="px-4 py-8 text-center text-gray-500">
                No transactions found matching your criteria
              </li>
            )}
          </ul>
        </div>

        {/* Export Options */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Export Transactions</h3>
          <div className="flex gap-4">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Export as PDF
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Export as CSV
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionsPage;