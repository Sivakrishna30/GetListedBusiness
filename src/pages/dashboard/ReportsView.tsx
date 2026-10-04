import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { BusinessReportData } from '../../../shared/types.ts';
import {
  CreditCard,
  Users,
  Clock,
  Sparkles,
  RefreshCw,
  Award,
} from 'lucide-react';

interface ReportsViewProps {
  businessId: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ businessId }) => {
  const [reports, setReports] = useState<BusinessReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await api.getReports(businessId);
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [businessId]);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading reports & analytics...</p>
      </div>
    );
  }

  if (!reports) return null;

  const { overview, revenue, performance, customers } = reports;
  const popularServices = performance.popularServices || [];
  const peakSlots = performance.peakPeriods || [];
  const avgBookingValue =
    performance.totalBookings > 0
      ? Math.round(revenue.totalRevenue / performance.totalBookings)
      : 0;
  const repeatRate =
    customers.totalCustomers > 0
      ? Math.round((customers.returningCustomersCount / customers.totalCustomers) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">Reports & Revenue Analytics</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-2xs font-bold bg-teal-800 text-white uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-teal-200" />
              Pro Feature
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Track revenue, booking performance, and customer retention.
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Revenue Breakdown Card */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4">
          Financial & Revenue Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-stone-500 block mb-1">Gross Booking Revenue</span>
            <div className="text-2xl font-extrabold text-stone-900">₹{revenue.totalRevenue}</div>
            <span className="text-2xs text-stone-500 mt-1 block">Total customer value processed</span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <span className="text-xs font-semibold text-amber-900 block mb-1">
              Platform Handling Fee (5%)
            </span>
            <div className="text-2xl font-extrabold text-amber-900">₹{revenue.platformFeesPaid}</div>
            <span className="text-2xs text-amber-700 mt-1 block">5% per eligible booking</span>
          </div>

          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
            <span className="text-xs font-semibold text-teal-900 block mb-1">Net Business Payout</span>
            <div className="text-2xl font-extrabold text-teal-900">₹{revenue.netBusinessRevenue}</div>
            <span className="text-2xs text-teal-700 mt-1 block">Payable directly to merchant</span>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-xs font-semibold text-stone-500 block mb-1">Average Booking Value</span>
            <div className="text-2xl font-extrabold text-stone-900">₹{avgBookingValue}</div>
            <span className="text-2xs text-stone-500 mt-1 block">Across {performance.totalBookings} bookings</span>
          </div>
        </div>
      </div>

      {/* Two-Column Analytics: Popular Services & Peak Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Most Popular Services
            </h3>
            <Award className="w-4 h-4 text-teal-700" />
          </div>

          {popularServices.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-6">No service activity yet.</p>
          ) : (
            <div className="space-y-3">
              {popularServices.map((ps: { name: string; count: number; revenue: number }, i: number) => (
                <div key={ps.name} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-700 text-white font-bold text-2xs flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-stone-800">{ps.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-900">{ps.count} bookings</div>
                    <div className="text-2xs text-stone-500">₹{ps.revenue} gross</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Peak Slots */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Peak Slot Utilization
            </h3>
            <Clock className="w-4 h-4 text-teal-700" />
          </div>

          {peakSlots.length === 0 ? (
            <p className="text-xs text-stone-500 text-center py-6">No slot data available yet.</p>
          ) : (
            <div className="space-y-3">
              {peakSlots.map((slot: { timeSlot: string; count: number }, i: number) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                  <span className="font-mono font-medium text-stone-800">{slot.timeSlot}</span>
                  <span className="font-bold text-teal-800 px-2.5 py-0.5 rounded bg-teal-50 border border-teal-200">
                    {slot.count} reservations
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Customer Retention Metrics */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-4">
          Customer Retention & Loyalty
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-center">
            <span className="text-xs text-stone-500 block mb-1">Total Unique Customers</span>
            <span className="text-2xl font-extrabold text-stone-900">{customers.totalCustomers}</span>
          </div>

          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 text-center">
            <span className="text-xs text-stone-500 block mb-1">Returning Clients (2+ bookings)</span>
            <span className="text-2xl font-extrabold text-teal-800">{customers.returningCustomersCount}</span>
          </div>

          <div className="p-4 rounded-lg bg-teal-50 border border-teal-200 text-center">
            <span className="text-xs text-teal-900 font-semibold block mb-1">Repeat Customer Rate</span>
            <span className="text-2xl font-extrabold text-teal-900">{repeatRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
