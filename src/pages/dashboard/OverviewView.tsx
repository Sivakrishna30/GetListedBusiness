import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { BusinessReportData, Booking } from '../../../shared/types.ts';
import { BookingStatusBadge } from '../../components/Badge.tsx';
import {
  Calendar,
  Users,
  CreditCard,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface OverviewViewProps {
  businessId: string;
  onSelectTab: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ businessId, onSelectTab }) => {
  const [reports, setReports] = useState<BusinessReportData | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rep, bks] = await Promise.all([
        api.getReports(businessId),
        api.listBookings(businessId),
      ]);
      setReports(rep);
      setRecentBookings(bks.slice(0, 6));
    } catch (err) {
      console.error('Failed to load dashboard overview data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading business metrics...</p>
      </div>
    );
  }

  const overview = reports?.overview;
  const revenue = reports?.revenue;

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Bookings */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Today's Bookings</span>
            <Calendar className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {overview?.todaysBookingsCount || 0}
          </div>
          <div className="text-2xs text-stone-500 mt-1">
            {overview?.upcomingBookingsCount || 0} upcoming ahead
          </div>
        </div>

        {/* Card 2: Net Revenue */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Net Business Revenue</span>
            <CreditCard className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            ₹{revenue?.netBusinessRevenue || 0}
          </div>
          <div className="text-2xs text-stone-500 mt-1">
            Gross: ₹{revenue?.totalRevenue || 0} (5% fee deducted)
          </div>
        </div>

        {/* Card 3: Total Customers */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Total Customers</span>
            <Users className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {reports?.customers.totalCustomers || 0}
          </div>
          <div className="text-2xs text-stone-500 mt-1">
            {reports?.customers.returningCustomersCount || 0} returning clients
          </div>
        </div>

        {/* Card 4: Active Memberships & Events */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Active Enrollments</span>
            <TrendingUp className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {overview?.activeMembershipsCount || 0}
          </div>
          <div className="text-2xs text-stone-500 mt-1">
            {overview?.upcomingEventsCount || 0} upcoming events active
          </div>
        </div>
      </div>

      {/* Quick Configuration Actions */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => onSelectTab('services')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800"
          >
            + Add / Edit Service
          </button>
          <button
            onClick={() => onSelectTab('bookings')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800"
          >
            Manage Bookings & Slots
          </button>
          <button
            onClick={() => onSelectTab('packages')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800"
          >
            Create Combo Package
          </button>
          <button
            onClick={() => onSelectTab('reports')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800"
          >
            View Revenue Breakdown
          </button>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Recent Customer Bookings</h3>
            <p className="text-2xs text-stone-500">Live feed with slot availability and 5% fee tracking</p>
          </div>
          <button
            onClick={() => onSelectTab('bookings')}
            className="text-xs font-semibold text-teal-800 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            No bookings recorded yet. When customers book your services, they will appear here.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentBookings.map(bk => (
              <div key={bk.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-stone-900 text-sm">{bk.customerName}</span>
                    <span className="text-stone-400 font-mono text-2xs">#{bk.id}</span>
                    <BookingStatusBadge status={bk.status} />
                  </div>
                  <div className="text-stone-600 flex items-center gap-3 text-2xs">
                    <span className="font-medium text-teal-800">{bk.serviceName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      {bk.date} ({bk.startTime} - {bk.endTime})
                    </span>
                    <span>•</span>
                    <span>{bk.customerPhone}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-stone-900 text-sm">₹{bk.grossAmount}</div>
                  <div className="text-2xs text-stone-500">
                    Net: ₹{bk.netAmount} <span className="text-teal-700">(5% fee: ₹{bk.platformFee})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
