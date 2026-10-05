import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { BusinessReportData } from '../../../shared/types.ts';
import {
  CreditCard,
  Users,
  Clock,
  RefreshCw,
  Award,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Printer,
  FileText,
  Calendar,
  CheckCircle2,
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

  const { overview, revenue, financials, narrativeSummary, performance, customers } = reports;
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

  const totalIncome = financials?.totalIncome ?? revenue.totalRevenue;
  const totalExpenses = financials?.totalExpenses ?? 0;
  const netProfit = financials?.netProfit ?? (totalIncome - totalExpenses);

  const handleExportCSV = () => {
    const lines = [
      ['REPORT', 'GetListed Business Audit Report'],
      ['GENERATED_AT', new Date().toISOString()],
      ['BUSINESS_ID', businessId],
      [],
      ['METRIC', 'AMOUNT_INR'],
      ['Total Realized Income', totalIncome],
      ['Total Operating Expenses', totalExpenses],
      ['Net Business Profit', netProfit],
      ['Total Bookings', performance.totalBookings],
      ['Completed Bookings', performance.completedBookings],
      ['Cancelled Bookings', performance.cancelledBookings],
      ['Total Customers', customers.totalCustomers],
      ['Returning Customers', customers.returningCustomersCount],
      [],
      ['POPULAR_SERVICES', 'BOOKINGS_COUNT', 'REVENUE_INR'],
      ...popularServices.map(s => [s.name, s.count, s.revenue]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + lines.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Business_Report_${businessId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Business Reports & Performance Intelligence</h2>
            <span className="text-2xs font-semibold uppercase px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
              Operational Intelligence
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            Plain-language weekly and monthly reports, financial tracking, and accountant-ready summaries.
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
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Narrative Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-teal-800 text-white p-4 sm:p-5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 text-teal-200 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>Weekly Business Narrative</span>
          </div>
          <p className="text-xs sm:text-sm font-medium leading-relaxed text-teal-50">
            {narrativeSummary?.weeklySummaryText || 'Generating weekly operational performance...'}
          </p>
          <div className="mt-4 pt-3 border-t border-teal-700/60 flex items-center justify-between text-2xs text-teal-200">
            <span>Peak Activity: {narrativeSummary?.topDay || 'Saturday'}</span>
            <span>Focus: Activity & Money Flow</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4 text-teal-700" />
            <span>Monthly Business Report Summary</span>
          </div>
          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            {narrativeSummary?.monthlySummaryText || 'Generating monthly consolidated performance...'}
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 text-2xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{narrativeSummary?.growthInsight || 'All operations running cleanly.'}</span>
          </div>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Total Realized Income</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            ₹{totalIncome.toLocaleString('en-IN')}
          </div>
          <p className="text-2xs text-stone-400 mt-1">From confirmed bookings & counter sales</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Total Operating Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </div>
          <p className="text-2xs text-stone-400 mt-1">Rent, salaries, electricity, maintenance</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-medium">Net Business Profit</span>
            <DollarSign className={`w-4 h-4 ${netProfit >= 0 ? 'text-teal-700' : 'text-red-600'}`} />
          </div>
          <div className={`text-2xl font-black ${netProfit >= 0 ? 'text-teal-700' : 'text-red-600'}`}>
            ₹{netProfit.toLocaleString('en-IN')}
          </div>
          <p className="text-2xs text-stone-400 mt-1">True net operational profit</p>
        </div>
      </div>

      {/* Operational Performance & Customer Retention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-700" />
            Top Performing Offerings
          </h3>
          {popularServices.length === 0 ? (
            <p className="text-xs text-stone-400 italic">No service booking activity recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {popularServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 font-bold flex items-center justify-center text-2xs shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-stone-900 truncate">{service.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-stone-900">₹{service.revenue.toLocaleString('en-IN')}</span>
                    <span className="text-2xs text-stone-400 block">{service.count} bookings</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Peak Periods & Customer Retention */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-2xs">
          <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-700" />
            Peak Operational Slots & Retention
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-stone-50 rounded-lg text-xs">
            <div>
              <span className="text-2xs text-stone-400 block">Repeat Customer Rate</span>
              <span className="text-base font-bold text-stone-900">{repeatRate}%</span>
            </div>
            <div>
              <span className="text-2xs text-stone-400 block">Avg Booking Value</span>
              <span className="text-base font-bold text-stone-900">₹{avgBookingValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="space-y-2">
            {peakSlots.slice(0, 4).map((slot, index) => (
              <div key={index} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                <span className="text-stone-700 font-mono text-2xs">{slot.timeSlot}</span>
                <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md text-2xs border border-teal-200">
                  {slot.count} bookings
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
