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
  TrendingDown,
  Clock,
  Sparkles,
  RefreshCw,
  DollarSign,
  Receipt,
  Plus,
  FileText,
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
  const financials = reports?.financials;
  const totalIncome = financials?.totalIncome ?? (reports?.revenue.totalRevenue || 0);
  const totalExpenses = financials?.totalExpenses ?? 0;
  const netProfit = financials?.netProfit ?? (totalIncome - totalExpenses);

  return (
    <div className="space-y-6">
      {/* Narrative Summary Highlight (Discovery Layer 5) */}
      {reports?.narrativeSummary && (
        <div className="bg-teal-900 text-white p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-800 rounded-lg shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-teal-200" />
            </div>
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-teal-300">
                Weekly Executive Insight
              </div>
              <p className="text-xs text-teal-50 font-medium mt-0.5 leading-relaxed">
                {reports.narrativeSummary.weeklySummaryText}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('reports')}
            className="self-start sm:self-auto shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-800 hover:bg-teal-700 text-white transition-colors"
          >
            <span>Full Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
            {overview?.upcomingBookingsCount || 0} upcoming reservations
          </div>
        </div>

        {/* Card 2: Total Realized Income */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Total Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            ₹{totalIncome.toLocaleString('en-IN')}
          </div>
          <div className="text-2xs text-stone-500 mt-1">
            Bookings & direct counter sales
          </div>
        </div>

        {/* Card 3: Operating Expenses */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Operating Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-2xs text-stone-500 mt-1">
            Rent, salary, utilities, maintenance
          </div>
        </div>

        {/* Card 4: Net Business Profit */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
            <span>Net Business Profit</span>
            <DollarSign className={`w-4 h-4 ${netProfit >= 0 ? 'text-teal-700' : 'text-red-500'}`} />
          </div>
          <div className={`text-2xl font-extrabold ${netProfit >= 0 ? 'text-teal-700' : 'text-red-600'}`}>
            ₹{netProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-2xs text-stone-500 mt-1">
            Income minus operating expenses
          </div>
        </div>
      </div>

      {/* Quick Operations Actions */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
        <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
          Daily Operational Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <button
            onClick={() => onSelectTab('bookings')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
          >
            <span>Bookings & Slots</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
          <button
            onClick={() => onSelectTab('transactions')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
          >
            <span>+ Record Income</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
          <button
            onClick={() => onSelectTab('expenses')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
          >
            <span>+ Record Expense</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
          <button
            onClick={() => onSelectTab('customers')}
            className="p-3 rounded-lg border border-stone-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-colors font-medium text-stone-800 flex items-center justify-between"
          >
            <span>+ Add Walk-in Client</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Recent Bookings Feed */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Recent Operational Activity
          </h3>
          <button
            onClick={() => onSelectTab('bookings')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
          >
            View all bookings &rarr;
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            No booking activity recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-2xs font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Date & Time</th>
                  <th className="py-2.5 px-4">Customer</th>
                  <th className="py-2.5 px-4">Offering</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Gross Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {recentBookings.map(b => (
                  <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-stone-600 whitespace-nowrap">
                      {b.date} • {b.startTime}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {b.customerName}
                      <span className="block text-2xs font-normal text-stone-400 font-mono">
                        {b.customerPhone}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-800">{b.serviceName}</td>
                    <td className="py-3 px-4">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900 whitespace-nowrap">
                      ₹{b.grossAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
