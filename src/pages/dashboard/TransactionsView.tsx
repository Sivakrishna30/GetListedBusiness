import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Transaction, PaymentMethod } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import {
  CreditCard,
  Plus,
  Download,
  Filter,
  DollarSign,
  TrendingUp,
  Receipt,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface TransactionsViewProps {
  businessId: string;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ businessId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Income Entry Form
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('DIRECT_SALE');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await api.listTransactions(businessId, {
        type: selectedType !== 'ALL' ? selectedType : undefined,
      });
      setTransactions(data);
    } catch (err: any) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [businessId, selectedType]);

  const handleRecordIncome = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid positive payment amount.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await api.recordIncome({
        businessId,
        category,
        amount: numAmount,
        paymentMethod,
        date,
        customerName: customerName.trim() || undefined,
        description: description.trim() || undefined,
        referenceNumber: referenceNumber.trim() || undefined,
      });

      setIsModalOpen(false);
      setAmount('');
      setCustomerName('');
      setDescription('');
      setReferenceNumber('');
      await fetchTransactions();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    if (!transactions.length) {
      alert('No transaction records to export.');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Customer', 'Amount (INR)', 'Payment Method', 'Status', 'Ref No', 'Description'];
    const rows = transactions.map(t => [
      `"${t.date}"`,
      `"${t.type}"`,
      `"${t.category}"`,
      `"${(t.customerName || '').replace(/"/g, '""')}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${t.status}"`,
      `"${(t.referenceNumber || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Transactions_${businessId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalIncomeAmount = transactions
    .filter(t => t.type === 'INCOME' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Financial Ledger & Transactions</h2>
            <span className="text-2xs font-semibold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Ledger
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Traceable money movement records (cash, UPI, cards) decoupled from booking reservations to prevent revenue inflation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto shrink-0">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setErrorMsg(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Record Income</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Total Realized Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            ₹{totalIncomeAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-2xs text-stone-400 mt-1">{transactions.length} total transaction entries</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Filter by Type</span>
            <Filter className="w-4 h-4 text-stone-400" />
          </div>
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-800 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-700"
          >
            <option value="ALL">All Types</option>
            <option value="INCOME">Income / Revenue</option>
            <option value="REFUND">Refunds</option>
            <option value="EXPENSE">Expense Disbursals</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-center">
          <span className="text-xs font-medium text-stone-500">Separation of Concerns</span>
          <p className="text-2xs text-stone-600 mt-1 leading-relaxed">
            Booking confirmation does not fabricate revenue. Revenue only reflects actual verified cash/UPI payments.
          </p>
        </div>
      </div>

      {/* Transactions Container */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Money Movement Records
          </h3>
          <span className="text-2xs text-stone-500 font-medium">
            Showing {transactions.length} transactions
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-medium">Loading ledger...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-stone-800">No transactions recorded yet</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Record over-the-counter sales, cash deposits, or advance booking receipts.
            </p>
            <button
              onClick={() => {
                setErrorMsg(null);
                setIsModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Income</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card View (< sm / 640px) */}
            <div className="block sm:hidden divide-y divide-stone-100">
              {transactions.map(tx => (
                <div key={tx.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {tx.date}
                    </span>
                    <span className="text-base font-extrabold text-stone-900">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-stone-800 text-xs truncate">
                      {tx.customerName || 'Walk-in Customer'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-2xs font-mono bg-teal-50 text-teal-800 border border-teal-200 shrink-0">
                      {tx.paymentMethod}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-2xs">
                    <span className="px-2 py-0.5 rounded text-2xs font-medium bg-stone-100 text-stone-700">
                      {tx.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{tx.status}</span>
                    </span>
                  </div>

                  {tx.description && (
                    <p className="text-2xs text-stone-500 bg-stone-50 p-1.5 rounded truncate">
                      {tx.description}
                    </p>
                  )}
                  {tx.referenceNumber && (
                    <span className="text-3xs text-stone-400 font-mono block">Ref: {tx.referenceNumber}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table View (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-2xs font-bold text-stone-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Customer / Payer</th>
                    <th className="py-2.5 px-4">Method</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          {tx.category}
                        </span>
                        {tx.description && (
                          <div className="text-2xs text-stone-400 mt-0.5 truncate max-w-xs">{tx.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-900 font-medium">
                        {tx.customerName || 'Walk-in Customer'}
                        {tx.referenceNumber && (
                          <div className="text-2xs text-stone-400 font-mono">Ref: {tx.referenceNumber}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-2xs font-mono bg-teal-50 text-teal-800 border border-teal-200">
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{tx.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Record Income Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Direct Income / Payment">
        <form onSubmit={handleRecordIncome} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Income Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="DIRECT_SALE">Counter / Direct Sale</option>
                <option value="BOOKING_PAYMENT">Booking Payment (Cash/UPI)</option>
                <option value="MEMBERSHIP_FEE">Membership Fee</option>
                <option value="EQUIPMENT_RENTAL">Rental / Consumables</option>
                <option value="OTHER_INCOME">Other Miscellaneous Income</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Amount Received (INR) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 1200"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
                <option value="CARD">Debit / Credit Card</option>
                <option value="NET_BANKING">Net Banking / Transfer</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Customer Name (Optional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Receipt / UPI Ref (Optional)
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={e => setReferenceNumber(e.target.value)}
                placeholder="e.g. UPI/2026/89912"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Badminton court 1-hour slot + drink"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 shadow-2xs"
            >
              {submitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
