import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Booking, BookingStatus, Service } from '../../../shared/types.ts';
import { calculatePlatformFee } from '../../../shared/feeCalculator.ts';
import { BookingStatusBadge } from '../../components/Badge.tsx';
import { Modal } from '../../components/Modal.tsx';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Filter,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

interface BookingsViewProps {
  businessId: string;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ businessId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  // Manual New Booking Modal
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [manualCustomerPhone, setManualCustomerPhone] = useState('');
  const [manualServiceId, setManualServiceId] = useState('');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualStartTime, setManualStartTime] = useState('18:00');
  const [manualEndTime, setManualEndTime] = useState('19:00');
  const [manualNotes, setManualNotes] = useState('');
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Reschedule Modal
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleStartTime, setRescheduleStartTime] = useState('09:00');
  const [rescheduleEndTime, setRescheduleEndTime] = useState('10:00');
  const [savingReschedule, setSavingReschedule] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [list, srvs] = await Promise.all([
        api.listBookings(businessId, {
          date: selectedDate || undefined,
          status: selectedStatus !== 'ALL' ? (selectedStatus as BookingStatus) : undefined,
        }),
        api.listServices(businessId),
      ]);
      setBookings(list);
      setServices(srvs);
      if (srvs.length > 0 && !manualServiceId) {
        setManualServiceId(srvs[0].id);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [businessId, selectedDate, selectedStatus]);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await api.updateBookingStatus(id, status);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleManualBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find(s => s.id === manualServiceId);
    if (!service) return;

    try {
      setCreatingBooking(true);
      await api.createBooking({
        businessId,
        customerName: manualCustomerName.trim(),
        customerPhone: manualCustomerPhone.trim(),
        serviceId: service.id,
        serviceName: service.name,
        date: manualDate,
        startTime: manualStartTime,
        endTime: manualEndTime,
        durationMinutes: service.durationMinutes,
        grossAmount: service.price,
        notes: manualNotes.trim() || 'Booked manually at front desk',
      });
      setIsNewBookingModalOpen(false);
      setManualCustomerName('');
      setManualCustomerPhone('');
      setManualNotes('');
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to create booking');
    } finally {
      setCreatingBooking(false);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking) return;

    try {
      setSavingReschedule(true);
      await api.rescheduleBooking(reschedulingBooking.id, {
        date: rescheduleDate,
        startTime: rescheduleStartTime,
        endTime: rescheduleEndTime,
      });
      setReschedulingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to reschedule');
    } finally {
      setSavingReschedule(false);
    }
  };

  const manualGross = services.find(s => s.id === manualServiceId)?.price || 0;
  const manualFee = calculatePlatformFee(manualGross);

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900">Bookings & Slot Management</h2>
            <p className="text-xs text-stone-500">
              Track live reservations, slot availability, and platform handling fees.
            </p>
          </div>

          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Manual Booking</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-800 focus:ring-1 focus:ring-teal-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span className="font-semibold text-stone-600">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-800 focus:ring-1 focus:ring-teal-700"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-2xs text-stone-500 hover:text-stone-800 underline ml-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
          <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
          <p className="text-xs text-stone-500 font-medium">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center max-w-md mx-auto">
          <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-900 mb-1">No bookings found</h3>
          <p className="text-xs text-stone-500 mb-4">
            No reservations match your current filters. Add a manual booking or reset filters.
          </p>
          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200"
          >
            Create Front-Desk Booking
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(bk => (
            <div
              key={bk.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                  <span className="font-bold text-stone-900 text-sm">{bk.customerName}</span>
                  <span className="font-mono text-2xs text-stone-400">#{bk.id}</span>
                  <BookingStatusBadge status={bk.status} />
                </div>

                <div className="text-xs text-stone-600 flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-teal-800">{bk.serviceName}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {bk.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {bk.startTime} - {bk.endTime}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {bk.customerPhone}
                  </span>
                </div>

                {bk.notes && (
                  <p className="text-2xs text-stone-500 mt-2 bg-stone-50 p-1.5 rounded max-w-lg">
                    <span className="font-semibold">Note:</span> {bk.notes}
                  </p>
                )}
              </div>

              {/* Fee & Action Bar */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                <div className="text-right">
                  <div className="text-base font-extrabold text-stone-900">₹{bk.grossAmount}</div>
                  <div className="text-2xs text-stone-500">
                    Net: ₹{bk.netAmount} <span className="text-teal-700">(Fee: ₹{bk.platformFee})</span>
                  </div>
                </div>

                {/* Status Update Actions */}
                <div className="flex items-center gap-1.5">
                  {bk.status !== 'COMPLETED' && bk.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleStatusChange(bk.id, 'COMPLETED')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      title="Mark as Completed"
                    >
                      Complete
                    </button>
                  )}

                  {bk.status !== 'CANCELLED' && bk.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleStatusChange(bk.id, 'CANCELLED')}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                      title="Cancel Booking"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setReschedulingBooking(bk);
                      setRescheduleDate(bk.date);
                      setRescheduleStartTime(bk.startTime);
                      setRescheduleEndTime(bk.endTime);
                    }}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual New Booking Modal */}
      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title="Create Walk-In / Front-Desk Booking"
      >
        <form onSubmit={handleManualBookingSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Select Service *</label>
            <select
              value={manualServiceId}
              onChange={e => setManualServiceId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none bg-white"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (₹{s.price} / {s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                placeholder="Customer name"
                value={manualCustomerName}
                onChange={e => setManualCustomerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91..."
                value={manualCustomerPhone}
                onChange={e => setManualCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={manualDate}
              onChange={e => setManualDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={manualStartTime}
                onChange={e => setManualStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={manualEndTime}
                onChange={e => setManualEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          {/* 5% Fee Breakdown Preview */}
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
            <div className="flex justify-between text-stone-600">
              <span>Gross Service Price:</span>
              <span className="font-semibold text-stone-900">₹{manualFee.grossAmount}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>5% Platform Handling Fee:</span>
              <span className="font-semibold text-teal-800">₹{manualFee.platformFee}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-stone-200 font-bold text-stone-900">
              <span>Net Business Amount:</span>
              <span>₹{manualFee.netBusinessAmount}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Notes</label>
            <input
              type="text"
              placeholder="e.g. Paid in cash at reception"
              value={manualNotes}
              onChange={e => setManualNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewBookingModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingBooking}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50"
            >
              {creatingBooking ? 'Saving...' : 'Confirm Walk-In Booking'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={Boolean(reschedulingBooking)}
        onClose={() => setReschedulingBooking(null)}
        title="Reschedule Booking"
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">New Date</label>
            <input
              type="date"
              required
              value={rescheduleDate}
              onChange={e => setRescheduleDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={rescheduleStartTime}
                onChange={e => setRescheduleStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={rescheduleEndTime}
                onChange={e => setRescheduleEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReschedulingBooking(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingReschedule}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50"
            >
              {savingReschedule ? 'Saving...' : 'Update Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
