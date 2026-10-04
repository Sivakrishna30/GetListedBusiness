import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Customer } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import { Users, Phone, Mail, Calendar, DollarSign, Edit3, Sparkles, RefreshCw } from 'lucide-react';

interface CustomersViewProps {
  businessId: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ businessId }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // Notes Modal
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const list = await api.listCustomers(businessId);
      setCustomers(list);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [businessId]);

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;

    try {
      setSavingNotes(true);
      await api.updateCustomerNotes(editingCustomer.id, notes);
      setEditingCustomer(null);
      await fetchCustomers();
    } catch (err: any) {
      alert(err.message || 'Failed to update customer notes');
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading customer database...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">Customer Relationship Management</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold bg-teal-800 text-white uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-teal-200" />
              Pro Feature
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Customer directory automatically compiled from actual booking reservations and member enrollments.
          </p>
        </div>

        <div className="text-xs font-bold text-stone-700 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
          {customers.length} Registered Customers
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center max-w-md mx-auto">
          <Users className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-900 mb-1">No customer records yet</h3>
          <p className="text-xs text-stone-500">
            Customers will automatically be recorded here as they book services or enroll in memberships.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-2xs font-bold uppercase tracking-wider text-stone-600">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Bookings</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Last Interaction</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{c.phone}</span>
                      </div>
                      {c.email && <div className="text-2xs text-stone-400">{c.email}</div>}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {c.bookingCount} {c.bookingCount === 1 ? 'booking' : 'bookings'}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 whitespace-nowrap">
                      ₹{c.totalSpent}
                    </td>
                    <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(c.lastInteraction).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                      {c.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setEditingCustomer(c);
                          setNotes(c.notes || '');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-2xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit Notes</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Notes Modal */}
      <Modal
        isOpen={Boolean(editingCustomer)}
        onClose={() => setEditingCustomer(null)}
        title={editingCustomer ? `Customer Notes: ${editingCustomer.name}` : 'Customer Notes'}
      >
        <form onSubmit={handleSaveNotes} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Internal Relationship & Preference Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Prefers court 1 in the evenings, regular weekend tournament captain..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingCustomer(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingNotes}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
