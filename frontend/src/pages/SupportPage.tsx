import { useState } from 'react';
import { toast } from 'sonner';
import Layout from '../components/Layout';

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  category: string;
}

const SupportPage = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      subject: 'Unable to access account',
      message: 'I cannot log into my account after password reset.',
      status: 'resolved',
      createdAt: '2024-01-15',
      category: 'Account Access'
    },
    {
      id: '2',
      subject: 'Transaction not showing',
      message: 'My recent deposit is not reflected in my balance.',
      status: 'in-progress',
      createdAt: '2024-01-20',
      category: 'Transactions'
    }
  ]);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    category: 'General'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const categories = [
    'General',
    'Account Access',
    'Transactions',
    'Security',
    'Technical Issues',
    'Billing'
  ];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would submit to backend
      const ticket: SupportTicket = {
        id: Date.now().toString(),
        subject: newTicket.subject,
        message: newTicket.message,
        status: 'open',
        createdAt: new Date().toISOString().split('T')[0],
        category: newTicket.category
      };

      setTickets(prev => [ticket, ...prev]);
      setNewTicket({ subject: '', message: '', category: 'General' });
      setShowForm(false);
      toast.success('Support ticket submitted successfully');
    } catch (error: any) {
      toast.error('Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600">Get help and support for your account</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {showForm ? 'Cancel' : 'New Ticket'}
          </button>
        </div>

        {/* Quick Help */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Help</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium text-gray-900">📞 Contact Support</h4>
              <p className="text-sm text-gray-600 mt-1">Call us at +1-800-123-4567</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium text-gray-900">📧 Email Support</h4>
              <p className="text-sm text-gray-600 mt-1">support@creditjambo.com</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium text-gray-900">💬 Live Chat</h4>
              <p className="text-sm text-gray-600 mt-1">Available 24/7</p>
            </div>
          </div>
        </div>

        {/* New Ticket Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Submit New Support Ticket</h3>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Subject *</label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message *</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Please provide detailed information about your issue..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Support Tickets */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Your Support Tickets ({tickets.length})
            </h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {ticket.subject}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {ticket.message}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400">
                            {ticket.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            Created: {ticket.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                    <span className="text-gray-400">→</span>
                  </div>
                </div>
              </li>
            ))}
            {tickets.length === 0 && (
              <li className="px-4 py-8 text-center text-gray-500">
                No support tickets found
              </li>
            )}
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium">
                How do I reset my password?
              </summary>
              <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
                Click on "Forgot Password" on the login page and follow the instructions sent to your email.
              </div>
            </details>

            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium">
                How long do transactions take to process?
              </summary>
              <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
                Deposits are usually instant. Withdrawals may take 1-3 business days depending on your bank.
              </div>
            </details>

            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium">
                How do I add a new device?
              </summary>
              <div className="px-4 py-3 border-t border-gray-200 text-sm text-gray-600">
                Log in from the new device. You'll need to verify it through the admin panel before it becomes active.
              </div>
            </details>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;