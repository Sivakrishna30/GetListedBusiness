import React, { useState, useEffect } from 'react';
import { api } from '../services/apiClient.ts';
import { Booking, BookingStatus } from '../../shared/types.ts';
import { BookingStatusBadge } from '../components/Badge.tsx';
import { Modal } from '../components/Modal.tsx';
import {
  Calendar,
  Clock,
  Phone,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

interface CustomerBookingsPageProps {
  onNavigate: (path: string) => void;
}

export const CustomerBookingsPage: React.FC<CustomerBookingsPageProps> = ({ onNavigate }) => {
  const [phoneNumber, setPhoneNumber] = useState('+91 98860 12345');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reschedule state
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [savingReschedule, setSavingReschedule] = useState(false);

  // Cancel state
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  const fetchBookings = async (phoneToQuery: string) => {
    if (!phoneToQuery.trim()) return;
    try {
      setLoading(true);
      setHasSearched(true);
      const res = await api.getCustomerBookings(phoneToQuery.trim());
      setBookings(res);
    } catch (err: any) {
      console.error('Failed to load customer bookings:', err);
      setErrorMessage(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(phoneNumber);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings(phoneNumber);
  };

  const handleConfirmCancelBooking = async () => {
    if (!cancellingBookingId) return;
    try {
      await api.updateBookingStatus(cancellingBookingId, 'CANCELLED');
      setCancellingBookingId(null);
      await fetchBookings(phoneNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to cancel booking');
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking) return;

    try {
      setSavingReschedule(true);
      await api.rescheduleBooking(reschedulingBooking.id, {
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
      });
      setReschedulingBooking(null);
      await fetchBookings(phoneNumber);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reschedule');
    } finally {
      setSavingReschedule(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            My Bookings & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Track confirmed time slots, review booking amounts, and manage your schedule.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-stone-500 hover:text-stone-700">✕</button>
          </div>
        )}

        {/* Phone Lookup Box */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required
              placeholder="Enter your phone number (e.g. +91 98860 12345)"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 transition-colors shadow-2xs shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Find My Bookings</span>
          </button>
        </form>

        {/* Results */}
        {loading ? (
          <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
            <RefreshCw className="w-6 h-6 text-[#0F766E] animate-spin mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-medium">Looking up your reservations...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-10 sm:p-12 rounded-xl border border-stone-200 text-center">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-900 mb-1">No reservations found</h3>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              {hasSearched
                ? `No bookings match phone number "${phoneNumber}".`
                : 'Enter your phone number above to look up your bookings.'}
            </p>
            <button
              onClick={() => onNavigate('/businesses')}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors"
            >
              Explore Businesses to Book
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                {bookings.length} {bookings.length === 1 ? 'Reservation' : 'Reservations'}
              </span>
              <span className="text-2xs text-stone-500">
                Sorted by most recent
              </span>
            </div>

            {bookings.map(bk => (
              <div
                key={bk.id}
                className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-2xs text-stone-400">#{bk.id.slice(-6)}</span>
                      <BookingStatusBadge status={bk.status} />
                    </div>
                    <h3 className="text-base font-bold text-stone-900">{bk.serviceName}</h3>
                    <div className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-stone-400" />
                      <button
                        onClick={() => onNavigate(`/businesses/${bk.businessId}`)}
                        className="text-[#0F766E] hover:underline font-semibold"
                      >
                        View Business Profile
                      </button>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xl font-extrabold text-stone-900">₹{bk.grossAmount}</span>
                    <span className="text-2xs text-stone-500 block">
                      Includes ₹{bk.platformFee} platform fee
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Calendar className="w-4 h-4 text-stone-400" />
                    <span className="font-semibold">Date:</span>
                    <span>{bk.date}</span>
                  </div>

                  <div className="flex items-center gap-2 text-stone-700">
                    <Clock className="w-4 h-4 text-stone-400" />
                    <span className="font-semibold">Time Slot:</span>
                    <span>{bk.startTime} - {bk.endTime} ({bk.durationMinutes} mins)</span>
                  </div>
                </div>

                {bk.notes && (
                  <div className="text-2xs text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                    <span className="font-semibold text-stone-700">Notes:</span> {bk.notes}
                  </div>
                )}

                {/* Customer Actions */}
                {bk.status !== 'CANCELLED' && bk.status !== 'COMPLETED' && (
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => {
                        setReschedulingBooking(bk);
                        setNewDate(bk.date);
                        setNewStartTime(bk.startTime);
                        setNewEndTime(bk.endTime);
                      }}
                      className="px-3.5 py-1.5 rounded-lg font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => setCancellingBookingId(bk.id)}
                      className="px-3.5 py-1.5 rounded-lg font-semibold text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEF2F2]/80 border border-[#DC2626]/30 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={Boolean(reschedulingBooking)}
        onClose={() => setReschedulingBooking(null)}
        title="Reschedule Your Reservation"
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">New Date</label>
            <input
              type="date"
              required
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={newStartTime}
                onChange={e => setNewStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={newEndTime}
                onChange={e => setNewEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReschedulingBooking(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={savingReschedule}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50"
            >
              {savingReschedule ? 'Rescheduling...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={Boolean(cancellingBookingId)}
        onClose={() => setCancellingBookingId(null)}
        title="Cancel Reservation"
      >
        <div className="space-y-4 text-sm">
          <p className="text-stone-600 text-xs">
            Are you sure you want to cancel this booking reservation? The slot will become available for other customers.
          </p>
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setCancellingBookingId(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={handleConfirmCancelBooking}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#DC2626] hover:bg-[#DC2626]/90 shadow-2xs"
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
