import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Customer } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import {
  Users,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Edit3,
  RefreshCw,
  Plus,
  Search,
  Download,
  AlertCircle,
} from 'lucide-react';

interface CustomersViewProps {
  businessId: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ businessId }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Notes Modal
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  // Add Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const list = await api.listCustomers(businessId, searchQuery);
      setCustomers(list);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [businessId, searchQuery]);

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

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      setErrorMsg('Name and phone number are required.');
      return;
    }

    try {
      setAddingCustomer(true);
      setErrorMsg(null);
      await api.createCustomer(businessId, {
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim() || undefined,
        notes: newNotes.trim() || undefined,
      });

      setIsAddModalOpen(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      setNewNotes('');
      await fetchCustomers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add customer.');
    } finally {
      setAddingCustomer(false);
    }
  };

  const handleExportCSV = () => {
    if (!customers.length) {
      alert('No customers to export.');
      return;
    }

    const headers = ['Customer Name', 'Phone', 'Email', 'Total Bookings', 'Total Spent (INR)', 'Last Interaction', 'Notes'];
    const rows = customers.map(c => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      c.bookingCount,
      c.totalSpent,
      `"${c.lastInteraction ? c.lastInteraction.split('T')[0] : ''}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Customers_${businessId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Customer Directory & CRM</h2>
            <span className="text-2xs font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              Walk-in & Online
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Manage your customer profiles, track total bookings and spend, and keep internal operational notes.
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
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, phone number, or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 text-xs sm:text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-stone-400"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-medium">Loading customer database...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
          <Users className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-stone-700">No customers found</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchQuery ? 'No customers matched your search query.' : 'Add walk-in clients manually or they will be added automatically upon booking.'}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Walk-in Customer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-stone-900 truncate">{c.name}</h3>
                    <div className="flex flex-col gap-0.5 text-2xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{c.phone}</span>
                      </span>
                      {c.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="truncate">{c.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-2xs font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                    c.bookingCount > 1 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {c.bookingCount > 1 ? 'Returning' : 'New Client'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-2xs">
                  <div>
                    <span className="text-stone-400 block font-medium">Total Bookings</span>
                    <span className="font-bold text-stone-900 text-xs">{c.bookingCount}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Total Spent</span>
                    <span className="font-bold text-stone-900 text-xs">₹{(c.totalSpent || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {c.notes && (
                  <div className="mt-3 p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-2xs text-stone-600">
                    <span className="font-bold text-stone-700 block mb-0.5">Private Notes:</span>
                    <p className="line-clamp-2 leading-relaxed">{c.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-2xs text-stone-400">
                <span>Last active: {c.lastInteraction ? c.lastInteraction.split('T')[0] : 'Recently'}</span>
                <button
                  onClick={() => {
                    setEditingCustomer(c);
                    setNotes(c.notes || '');
                  }}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900 font-semibold transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Notes Modal */}
      <Modal isOpen={!!editingCustomer} onClose={() => setEditingCustomer(null)} title={`Customer Notes: ${editingCustomer?.name}`}>
        <form onSubmit={handleSaveNotes} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Private Internal Notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. VIP client, prefers weekend slots, requested specific court trainer..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setEditingCustomer(null)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingNotes}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-2xs"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Walk-in Customer Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register Walk-in / Offline Customer">
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Ravi Kumar"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
                placeholder="e.g. ravi@example.com"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Initial Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={newNotes}
              onChange={e => setNewNotes(e.target.value)}
              placeholder="e.g. Walk-in badminton player, referred by IND-SPORTS."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addingCustomer}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-2xs"
            >
              {addingCustomer ? 'Adding...' : 'Add Customer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
