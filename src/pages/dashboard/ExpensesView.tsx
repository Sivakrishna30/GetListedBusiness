import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Expense, ExpenseCategory, PaymentMethod } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import {
  Receipt,
  Plus,
  Filter,
  Trash2,
  Download,
  AlertCircle,
  Calendar,
  Building,
  DollarSign,
  TrendingDown,
  RefreshCw,
} from 'lucide-react';

interface ExpensesViewProps {
  businessId: string;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ businessId }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Expense Form State
  const [amount, setAmount] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('RENT');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [paidTo, setPaidTo] = useState<string>('');
  const [receiptRef, setReceiptRef] = useState<string>('');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await api.listExpenses(businessId, {
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
      });
      setExpenses(data);
    } catch (err: any) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [businessId, selectedCategory]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid positive expense amount.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg(null);
      await api.createExpense({
        businessId,
        category,
        amount: numAmount,
        date,
        description: description.trim(),
        paymentMethod,
        paidTo: paidTo.trim() || undefined,
        receiptRef: receiptRef.trim() || undefined,
      });

      setIsModalOpen(false);
      setAmount('');
      setDescription('');
      setPaidTo('');
      setReceiptRef('');
      await fetchExpenses();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to record expense.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await api.deleteExpense(id);
      await fetchExpenses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense.');
    }
  };

  // Native CSV Export for Accountant Review (CHK-012)
  const handleExportCSV = () => {
    if (!expenses.length) {
      alert('No expense records to export.');
      return;
    }

    const headers = ['Date', 'Category', 'Description', 'Amount (INR)', 'Payment Method', 'Paid To', 'Receipt Ref'];
    const rows = expenses.map(e => [
      `"${e.date}"`,
      `"${e.category}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      e.amount,
      `"${e.paymentMethod}"`,
      `"${(e.paidTo || '').replace(/"/g, '""')}"`,
      `"${(e.receiptRef || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Expenses_${businessId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Expense Management</h2>
            <span className="text-2xs font-semibold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              Operations Tracking
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Track business operating expenses (rent, salaries, utilities, maintenance) to compute your true net business profit.
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
            <span>Record Expense</span>
          </button>
        </div>
      </div>

      {/* KPI & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Total Operating Costs</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            ₹{totalExpenseAmount.toLocaleString('en-IN')}
          </div>
          <p className="text-2xs text-stone-400 mt-1">{expenses.length} expense vouchers recorded</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Filter by Category</span>
            <Filter className="w-4 h-4 text-stone-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full mt-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
          >
            <option value="ALL">All Categories</option>
            <option value="RENT">Rent & Lease</option>
            <option value="SALARY">Salaries & Wages</option>
            <option value="UTILITIES">Electricity & Utilities</option>
            <option value="MARKETING">Marketing & Advertising</option>
            <option value="MAINTENANCE">Equipment & Repairs</option>
            <option value="INVENTORY">Supplies & Stock</option>
            <option value="OTHER">Other Expenses</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-center">
          <span className="text-xs font-medium text-stone-500">Accountant Ready</span>
          <p className="text-2xs text-stone-600 mt-1 leading-relaxed">
            Data is strictly persisted locally and ready for one-click CA review without 3rd-party connectors.
          </p>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Expense Records
          </h3>
          <span className="text-2xs text-stone-500 font-medium">
            Showing {expenses.length} records
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-medium">Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-stone-800">No expenses recorded yet</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Start by logging recurring or operational costs like rent, electricity bills, or staff stipends.
            </p>
            <button
              onClick={() => {
                setErrorMsg(null);
                setIsModalOpen(true);
              }}
              className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Expense</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Cards (< sm) */}
            <div className="block sm:hidden divide-y divide-stone-100">
              {expenses.map(exp => (
                <div key={exp.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs text-stone-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      {exp.date}
                    </span>
                    <span className="text-base font-extrabold text-stone-900">
                      ₹{exp.amount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold text-stone-900 text-xs truncate">
                      {exp.description}
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors shrink-0"
                      title="Delete expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-2xs">
                    <span className="px-2 py-0.5 rounded-md font-medium bg-stone-100 text-stone-700">
                      {exp.category}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md font-mono bg-teal-50 text-teal-800 border border-teal-200">
                      {exp.paymentMethod}
                    </span>
                  </div>

                  {exp.paidTo && (
                    <div className="text-2xs text-stone-500">
                      Paid To: <span className="font-medium text-stone-700">{exp.paidTo}</span>
                    </div>
                  )}
                  {exp.receiptRef && (
                    <div className="text-3xs text-stone-400 font-mono">Ref: {exp.receiptRef}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop / Tablet Table (>= sm) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-2xs font-bold text-stone-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Description</th>
                    <th className="py-2.5 px-4">Paid To</th>
                    <th className="py-2.5 px-4">Method</th>
                    <th className="py-2.5 px-4 text-right">Amount</th>
                    <th className="py-2.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap">
                        {exp.date}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-2xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{exp.description}</div>
                        {exp.receiptRef && (
                          <div className="text-2xs text-stone-400 font-mono">Ref: {exp.receiptRef}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {exp.paidTo || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-1.5 py-0.5 rounded-md text-2xs font-mono bg-teal-50 text-teal-800 border border-teal-200">
                          {exp.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Delete expense entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Record Expense Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Record Business Expense">
        <form onSubmit={handleCreateExpense} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="RENT">Rent & Lease</option>
                <option value="SALARY">Salaries & Stipends</option>
                <option value="UTILITIES">Electricity & Utilities</option>
                <option value="MARKETING">Marketing & Advertising</option>
                <option value="MAINTENANCE">Equipment & Repairs</option>
                <option value="INVENTORY">Inventory & Supplies</option>
                <option value="OTHER">Other Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Amount (INR) *
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Payment Method *
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="UPI">UPI</option>
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Paid To (Optional)
              </label>
              <input
                type="text"
                value={paidTo}
                onChange={e => setPaidTo(e.target.value)}
                placeholder="e.g. Landlord / Vendor / Staff"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Receipt / Invoice Ref (Optional)
              </label>
              <input
                type="text"
                value={receiptRef}
                onChange={e => setReceiptRef(e.target.value)}
                placeholder="e.g. INV-2026-004"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Facility monthly maintenance & lighting"
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
              {submitting ? 'Recording...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
