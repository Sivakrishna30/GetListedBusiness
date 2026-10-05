import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Booking, BookingStatus, Service, Transaction, PaymentMethod } from '../../../shared/types.ts';
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
  CreditCard,
  Receipt,
} from 'lucide-react';

interface BookingsViewProps {
  businessId: string;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ businessId }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  // Record Payment Modal (ADR-006)
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);
  const [payAmount, setPayAmount] = useState<string>('');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('UPI');
  const [payRef, setPayRef] = useState<string>('');
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [recordingPayment, setRecordingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const [list, srvs, txs] = await Promise.all([
        api.listBookings(businessId, {
          date: selectedDate || undefined,
          status: selectedStatus !== 'ALL' ? (selectedStatus as BookingStatus) : undefined,
        }),
        api.listServices(businessId),
        api.listTransactions(businessId),
      ]);
      setBookings(list);
      setServices(srvs);
      setTransactions(txs);
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

  const openRecordPaymentModal = (bk: Booking, remaining: number) => {
    setPayingBooking(bk);
    setPayAmount(remaining > 0 ? remaining.toString() : bk.grossAmount.toString());
    setPayMethod('UPI');
    setPayRef('');
    setPayDate(new Date().toISOString().split('T')[0]);
    setPaymentError(null);
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBooking) return;

    const numAmount = parseFloat(payAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setPaymentError('Please enter a valid payment amount.');
      return;
    }

    try {
      setRecordingPayment(true);
      setPaymentError(null);
      await api.recordIncome({
        businessId,
        bookingId: payingBooking.id,
        category: 'BOOKING_PAYMENT',
        amount: numAmount,
        paymentMethod: payMethod,
        date: payDate,
        customerName: payingBooking.customerName,
        referenceNumber: payRef.trim() || undefined,
        description: `Booking payment for ${payingBooking.serviceName} (${payingBooking.date})`,
      });

      setPayingBooking(null);
      await fetchBookings();
    } catch (err: any) {
      setPaymentError(err.message || 'Failed to record booking payment.');
    } finally {
      setRecordingPayment(false);
    }
  };

  const manualGross = services.find(s => s.id === manualServiceId)?.price || 0;
  const manualFee = calculatePlatformFee(manualGross);

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900">Bookings & Slot Management</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Track live reservations, slot availability, and platform handling fees.
            </p>
          </div>

          <button
            onClick={() => setIsNewBookingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Manual Booking</span>
          </button>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="font-semibold text-stone-600">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="font-semibold text-stone-600">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-800 focus:ring-2 focus:ring-teal-700 focus:outline-none"
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
            className="px-4 py-2 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            Create Front-Desk Booking
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map(bk => {
            const bkTxs = transactions.filter(t => t.bookingId === bk.id && t.status === 'SUCCESS');
            const paidTotal = bkTxs.reduce((sum, t) => sum + t.amount, 0);
            const remaining = Math.max(0, bk.grossAmount - paidTotal);
            const isFullyPaid = paidTotal >= bk.grossAmount;

            return (
              <div
                key={bk.id}
                className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-stone-900 text-sm">{bk.customerName}</span>
                    <span className="font-mono text-2xs text-stone-400">#{bk.id}</span>
                    <BookingStatusBadge status={bk.status} />
                    {isFullyPaid ? (
                      <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Paid ₹{paidTotal} ({bkTxs[0]?.paymentMethod || 'Ledger'})</span>
                      </span>
                    ) : paidTotal > 0 ? (
                      <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <span>Partially Paid ₹{paidTotal} (Due: ₹{remaining})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-2xs px-2 py-0.5 rounded-md font-medium bg-stone-100 text-stone-600 border border-stone-200">
                        <span>Payment Pending</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-stone-600 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-semibold text-teal-800">{bk.serviceName}</span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      {bk.date}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {bk.startTime} - {bk.endTime}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {bk.customerPhone}
                    </span>
                  </div>

                  {bk.notes && (
                    <p className="text-2xs text-stone-500 bg-stone-50 p-2 rounded-lg max-w-lg border border-stone-100">
                      <span className="font-semibold text-stone-700">Note:</span> {bk.notes}
                    </p>
                  )}
                </div>

                {/* Fee & Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-3 sm:gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <div className="text-base font-extrabold text-stone-900">₹{bk.grossAmount}</div>
                    <div className="text-2xs text-stone-500">
                      Net: ₹{bk.netAmount} <span className="text-teal-700 font-medium">(Fee: ₹{bk.platformFee})</span>
                    </div>
                  </div>

                  {/* Status & Financial Update Actions */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {!isFullyPaid && bk.status !== 'CANCELLED' && (
                      <button
                        onClick={() => openRecordPaymentModal(bk, remaining)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
                        title="Record payment into financial ledger (ADR-006)"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-teal-700" />
                        <span>{paidTotal > 0 ? 'Collect Balance' : 'Collect Payment'}</span>
                      </button>
                    )}

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
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
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
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition-colors shadow-2xs"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition-colors shadow-2xs"
            >
              {savingReschedule ? 'Saving...' : 'Update Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Record Payment Modal (ADR-006) */}
      <Modal
        isOpen={Boolean(payingBooking)}
        onClose={() => setPayingBooking(null)}
        title={payingBooking ? `Record Payment: ${payingBooking.serviceName}` : 'Record Booking Payment'}
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-sm">
          {paymentError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{paymentError}</span>
            </div>
          )}

          {payingBooking && (
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Customer:</span>
                <span className="font-bold text-stone-900">{payingBooking.customerName} ({payingBooking.customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Slot Reserved:</span>
                <span className="font-medium text-stone-700">{payingBooking.date} @ {payingBooking.startTime}</span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-1 font-bold">
                <span className="text-stone-700">Gross Booking Value:</span>
                <span className="text-teal-800">₹{payingBooking.grossAmount}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Amount Paid (₹) *</label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-bold text-stone-900 focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Method *</label>
              <select
                value={payMethod}
                onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-teal-700 focus:outline-none bg-white"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="CASH">Cash at Desk</option>
                <option value="CARD">Credit / Debit Card</option>
                <option value="NET_BANKING">Net Banking / Transfer</option>
                <option value="OTHER">Other Method</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Date *</label>
              <input
                type="date"
                required
                value={payDate}
                onChange={e => setPayDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Reference / UTR No (Optional)</label>
              <input
                type="text"
                placeholder="e.g. UPI/260324/99120"
                value={payRef}
                onChange={e => setPayRef(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-2xs text-emerald-800">
            <span className="font-bold">Ledger Assurance:</span> Recording this transaction writes a verified money-movement entry to your business ledger and updates your real revenue reports.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPayingBooking(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={recordingPayment}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50 transition-colors shadow-2xs"
            >
              {recordingPayment ? 'Recording...' : 'Record Payment to Ledger'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
