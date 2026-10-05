import React, { useState, useEffect } from 'react';
import { api } from '../services/apiClient.ts';
import { Business, Service, Booking } from '../../shared/types.ts';
import { calculatePlatformFee } from '../../shared/feeCalculator.ts';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Building2,
} from 'lucide-react';

interface BookingFlowPageProps {
  businessId: string;
  preselectedServiceId?: string;
  onNavigate: (path: string) => void;
}

export const BookingFlowPage: React.FC<BookingFlowPageProps> = ({
  businessId,
  preselectedServiceId,
  onNavigate,
}) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Flow State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(preselectedServiceId || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null);

  // Existing bookings for selected date to calculate collision
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  // Customer Form
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Submit / Result State
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [biz, srvs] = await Promise.all([
          api.getBusiness(businessId),
          api.listServices(businessId),
        ]);
        setBusiness(biz);
        setServices(srvs);
        if (!selectedServiceId && srvs.length > 0) {
          setSelectedServiceId(srvs[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load booking info');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [businessId]);

  // Load existing bookings whenever date changes
  useEffect(() => {
    if (businessId && selectedDate) {
      api.listBookings(businessId, { date: selectedDate })
        .then(setExistingBookings)
        .catch(console.error);
    }
  }, [businessId, selectedDate]);

  const selectedService = services.find(s => s.id === selectedServiceId);

  // Available generic time slots (from 06:00 to 22:00)
  const timeSlots = [
    { start: '06:00', end: '07:00' },
    { start: '07:00', end: '08:00' },
    { start: '08:00', end: '09:00' },
    { start: '09:00', end: '10:00' },
    { start: '10:00', end: '11:00' },
    { start: '11:00', end: '12:00' },
    { start: '14:00', end: '15:00' },
    { start: '15:00', end: '16:00' },
    { start: '16:00', end: '17:00' },
    { start: '17:00', end: '18:00' },
    { start: '18:00', end: '19:00' },
    { start: '19:00', end: '20:00' },
    { start: '20:00', end: '21:00' },
    { start: '21:00', end: '22:00' },
  ];

  const isSlotBooked = (start: string) => {
    return existingBookings.some(
      b =>
        b.serviceId === selectedServiceId &&
        b.startTime === start &&
        (b.status === 'CONFIRMED' || b.status === 'PENDING')
    );
  };

  const grossAmount = selectedService?.price || 0;
  const feeCalculation = calculatePlatformFee(grossAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !selectedService || !selectedSlot) return;

    if (!customerName.trim() || !customerPhone.trim()) {
      setError('Please enter your name and phone number.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const booking = await api.createBooking({
        businessId: business.id,
        customerName,
        customerPhone,
        customerEmail,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        durationMinutes: selectedService.durationMinutes,
        grossAmount: selectedService.price,
        notes,
      });
      setConfirmedBooking(booking);
    } catch (err: any) {
      setError(err.message || 'Failed to complete booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-24 text-center">
        <RefreshCw className="w-8 h-8 text-[#0F766E] animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-stone-600">Initializing booking engine...</p>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 px-4 text-center">
        <p className="text-[#DC2626] mb-4">{error}</p>
        <button
          onClick={() => onNavigate(`/businesses/${businessId}`)}
          className="px-4 py-2 text-xs font-semibold bg-stone-200 rounded-lg"
        >
          Return to Business
        </button>
      </div>
    );
  }

  // Confirmation View
  if (confirmedBooking && business) {
    return (
      <div className="min-h-screen bg-stone-50 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-2xs">
          <div className="text-center space-y-3 pb-6 border-b border-stone-100">
            <div className="w-14 h-14 bg-[#F0FDF4] text-[#16A34A] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900">Booking Confirmed!</h1>
            <p className="text-sm text-stone-600">
              Your reservation has been scheduled with <span className="font-semibold text-stone-900">{business.name}</span>.
            </p>
          </div>

          <div className="py-6 space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Booking ID</span>
              <span className="font-mono font-bold text-stone-900">{confirmedBooking.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Service</span>
              <span className="font-semibold text-stone-900">{confirmedBooking.serviceName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Date & Slot</span>
              <span className="font-semibold text-stone-900">
                {confirmedBooking.date} ({confirmedBooking.startTime} - {confirmedBooking.endTime})
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Customer</span>
              <span className="font-semibold text-stone-900">{confirmedBooking.customerName} ({confirmedBooking.customerPhone})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Total Amount</span>
              <span className="font-extrabold text-[#0F766E]">₹{confirmedBooking.grossAmount}</span>
            </div>

            {/* Platform Handling Fee Breakdown */}
            <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1 text-xs text-stone-600">
              <div className="font-semibold text-stone-800 mb-1">Fee & Payment Transparency</div>
              <div className="flex justify-between">
                <span>Gross Amount:</span>
                <span>₹{confirmedBooking.grossAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>5% Platform Handling Fee:</span>
                <span>₹{confirmedBooking.platformFee}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                <span>Net Business Revenue:</span>
                <span>₹{confirmedBooking.netAmount}</span>
              </div>
            </div>

            {/* Notification Architecture Status */}
            <div className="p-3 bg-[#FFFBEB] rounded-lg border border-[#D97706]/30 text-xs text-[#D97706]">
              <span className="font-semibold">WhatsApp & SMS Status:</span> Booking confirmation alert queued (Channel awaiting provider gateway key configuration).
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate(`/businesses/${business.id}`)}
              className="flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors text-center"
            >
              Back to Business Page
            </button>
            <button
              onClick={() => onNavigate('/businesses')}
              className="flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors text-center"
            >
              Explore More Businesses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <button
            onClick={() => onNavigate(`/businesses/${businessId}`)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {business?.name || 'Business'}</span>
          </button>
          <div className="text-xs text-stone-500 font-medium">Generic Booking Engine</div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Booking Controls (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Service Selection */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs flex items-center justify-center font-bold">1</span>
                <span>Select Service or Activity</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map(srv => {
                  const isSelected = srv.id === selectedServiceId;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        setSelectedSlot(null);
                      }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#0F766E] bg-[#F0FDFA] ring-1 ring-[#0F766E]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-stone-900 text-sm">{srv.name}</span>
                        <span className="text-sm font-extrabold text-stone-900">₹{srv.price}</span>
                      </div>
                      <p className="text-xs text-stone-500 line-clamp-1">{srv.description}</p>
                      <span className="text-2xs text-[#0F766E] font-medium block mt-2">
                        Duration: {srv.durationMinutes} minutes
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Slot Selection */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs flex items-center justify-center font-bold">2</span>
                <span>Choose Date & Time Slot</span>
              </h2>

              <div className="mb-5">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">Booking Date</label>
                <div className="relative max-w-xs">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={e => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(null);
                    }}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-900 focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2">Available Slots on {selectedDate}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.map(slot => {
                    const booked = isSlotBooked(slot.start);
                    const isSelected = selectedSlot?.start === slot.start;

                    return (
                      <button
                        type="button"
                        key={slot.start}
                        disabled={booked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold transition-all border ${
                          booked
                            ? 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#0F766E] text-white border-[#0F766E] shadow-2xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-[#0F766E]'
                        }`}
                      >
                        {slot.start} - {slot.end}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-4 text-2xs text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-white border border-stone-300 inline-block" /> Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#0F766E] inline-block" /> Selected
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-stone-200 inline-block" /> Booked
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Customer Information */}
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs">
              <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#F0FDFA] text-[#0F766E] text-xs flex items-center justify-center font-bold">3</span>
                <span>Customer Contact Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (WhatsApp) *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98860 99887"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="e.g. priya@example.com"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Special Requests / Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Any specific preferences or requirements..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary & 5% Platform Fee Breakdown */}
          <div className="space-y-6">
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs sticky top-24">
              <h3 className="font-bold text-stone-900 text-base mb-4 pb-3 border-b border-stone-100">
                Booking Summary
              </h3>

              {selectedService ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-stone-500 block">Service</span>
                    <span className="font-semibold text-stone-900">{selectedService.name}</span>
                  </div>

                  <div>
                    <span className="text-xs text-stone-500 block">Date & Time</span>
                    <span className="font-semibold text-stone-900">
                      {selectedDate}
                      {selectedSlot ? ` • ${selectedSlot.start} - ${selectedSlot.end}` : ' (No slot selected)'}
                    </span>
                  </div>

                  {/* 5% Platform Handling Fee Calculation */}
                  <div className="pt-4 border-t border-stone-100 space-y-2">
                    <div className="flex justify-between text-stone-600">
                      <span>Service Price</span>
                      <span>₹{feeCalculation.grossAmount}</span>
                    </div>

                    <div className="flex justify-between text-[#0F766E] text-xs font-medium">
                      <span>5% Platform Handling Fee</span>
                      <span>₹{feeCalculation.platformFee}</span>
                    </div>

                    <div className="flex justify-between font-extrabold text-base text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total Amount</span>
                      <span>₹{feeCalculation.grossAmount}</span>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-2xs text-stone-500 leading-normal">
                      A 5% platform handling fee applies to eligible bookings and orders made through GetListed.
                      Net business amount: ₹{feeCalculation.netBusinessAmount}.
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting || !selectedSlot}
                      className="w-full py-3 px-4 rounded-lg font-bold text-sm text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 transition-colors shadow-2xs flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Confirming Booking...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm & Book</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    {!selectedSlot && (
                      <p className="text-2xs text-[#DC2626] text-center mt-2">
                        Please select an available time slot above to proceed.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-stone-500">Please select a service first.</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
