import { db } from '../db.ts';
import { BusinessReportData } from '../../shared/types.ts';

export class ReportService {
  public static getReportsForBusiness(businessId: string): BusinessReportData {
    const state = db.getState();
    const bookings = state.bookings.filter(b => b.businessId === businessId);
    const customers = state.customers.filter(c => c.businessId === businessId);
    const enrollments = state.membershipEnrollments.filter(e => e.businessId === businessId && e.status === 'ACTIVE');
    const events = state.events.filter(e => e.businessId === businessId && e.status === 'PUBLISHED');

    // Real transactions & expenses for this business
    const businessTransactions = (state.transactions || []).filter(t => t.businessId === businessId && t.status === 'SUCCESS');
    const businessExpenses = (state.expenses || []).filter(e => e.businessId === businessId);

    const completedOrConfirmed = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED');

    // Financial calculations
    const incomeTransactions = businessTransactions.filter(t => t.type === 'INCOME');
    const totalTxIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

    // If transactions exist, use transaction ledger; fallback to completed booking amount if no transactions recorded yet
    const totalGross = totalTxIncome > 0
      ? totalTxIncome
      : completedOrConfirmed.reduce((sum, b) => sum + (b.grossAmount || 0), 0);

    const totalExpenses = businessExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = Math.round((totalGross - totalExpenses) * 100) / 100;

    const totalPlatformFee = completedOrConfirmed.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    const netBusinessRevenue = Math.round((totalGross - totalPlatformFee) * 100) / 100;

    // Income breakdown by category
    const incomeCatMap = new Map<string, number>();
    incomeTransactions.forEach(t => {
      incomeCatMap.set(t.category, (incomeCatMap.get(t.category) || 0) + t.amount);
    });
    const incomeByCategory = Array.from(incomeCatMap.entries()).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }));

    // Expense breakdown by category
    const expCatMap = new Map<string, number>();
    businessExpenses.forEach(e => {
      expCatMap.set(e.category, (expCatMap.get(e.category) || 0) + e.amount);
    });
    const expenseByCategory = Array.from(expCatMap.entries()).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
    }));

    // Revenue by date period (e.g. grouped by date)
    const periodMap = new Map<string, { gross: number; count: number }>();
    completedOrConfirmed.forEach(b => {
      const p = b.date;
      const current = periodMap.get(p) || { gross: 0, count: 0 };
      current.gross += b.grossAmount;
      current.count += 1;
      periodMap.set(p, current);
    });

    const revenueByPeriod = Array.from(periodMap.entries())
      .sort((a, b) => String(a[0] || '').localeCompare(String(b[0] || '')))
      .map(([period, data]) => ({
        period,
        gross: Math.round(data.gross * 100) / 100,
        count: data.count,
      }));

    // Performance metrics
    const totalBookings = bookings.length;
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
    const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
    const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;

    // Popular services
    const serviceCountMap = new Map<string, { count: number; revenue: number }>();
    completedOrConfirmed.forEach(b => {
      const sName = b.serviceName || 'General Service';
      const item = serviceCountMap.get(sName) || { count: 0, revenue: 0 };
      item.count += 1;
      item.revenue += b.grossAmount;
      serviceCountMap.set(sName, item);
    });

    const popularServices = Array.from(serviceCountMap.entries())
      .map(([name, data]) => ({ name, count: data.count, revenue: Math.round(data.revenue) }))
      .sort((a, b) => b.count - a.count);

    // Peak booking time periods
    const timeMap = new Map<string, number>();
    bookings.forEach(b => {
      const slot = `${b.startTime} - ${b.endTime}`;
      timeMap.set(slot, (timeMap.get(slot) || 0) + 1);
    });
    const peakPeriods = Array.from(timeMap.entries())
      .map(([timeSlot, count]) => ({ timeSlot, count }))
      .sort((a, b) => b.count - a.count);

    // Day of week analysis
    const dayMap = new Map<string, number>();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    bookings.forEach(b => {
      try {
        const d = new Date(b.date);
        const day = dayNames[d.getDay()] || 'Weekday';
        dayMap.set(day, (dayMap.get(day) || 0) + 1);
      } catch {
        // fallback
      }
    });
    const topDayEntry = Array.from(dayMap.entries()).sort((a, b) => b[1] - a[1])[0];
    const topDay = topDayEntry ? topDayEntry[0] : 'Saturday';

    // Customers metrics
    const totalCustomers = customers.length;
    const newCustomersCount = customers.filter(c => c.bookingCount <= 1).length;
    const returningCustomersCount = customers.filter(c => c.bookingCount > 1).length;

    // Overview counters
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysBookingsCount = bookings.filter(b => b.date === todayStr && b.status !== 'CANCELLED').length;
    const upcomingBookingsCount = bookings.filter(b => b.date >= todayStr && (b.status === 'CONFIRMED' || b.status === 'PENDING')).length;

    const avgBookingValue = totalBookings > 0 ? Math.round(totalGross / totalBookings) : 0;
    const topService = popularServices[0]?.name || 'Standard Service';

    // Plain-Language Narrative Reports (Layer 5)
    const weeklySummaryText = `This Week: Total Income is ₹${totalGross.toLocaleString('en-IN')} across ${totalBookings} bookings (${newCustomersCount} new customers, ${returningCustomersCount} returning). Operating expenses recorded: ₹${totalExpenses.toLocaleString('en-IN')}. Net business amount: ₹${netProfit.toLocaleString('en-IN')}. ${topDay} generated the highest operational volume.`;

    const monthlySummaryText = `Monthly Business Report: Total revenue achieved is ₹${totalGross.toLocaleString('en-IN')}. Operating expenses stand at ₹${totalExpenses.toLocaleString('en-IN')}, leaving a net operating profit of ₹${netProfit.toLocaleString('en-IN')}. Top-performing offering: ${topService}. Average transaction value: ₹${avgBookingValue.toLocaleString('en-IN')}.`;

    const growthInsight = cancelledBookings > 0
      ? `Operational Health: ${totalBookings} total bookings with ${completedBookings} completed. Cancellation rate is ${Math.round((cancelledBookings / totalBookings) * 100)}% (${cancelledBookings} cancelled).`
      : `Operational Health: 100% booking completion rate with 0 cancellations recorded. Customer retention stands at ${totalCustomers > 0 ? Math.round((returningCustomersCount / totalCustomers) * 100) : 0}%.`;

    return {
      revenue: {
        totalRevenue: Math.round(totalGross * 100) / 100,
        platformFeesPaid: Math.round(totalPlatformFee * 100) / 100,
        netBusinessRevenue,
        revenueByPeriod,
        bookingRevenue: Math.round(totalGross * 100) / 100,
        orderRevenue: 0,
      },
      financials: {
        totalIncome: Math.round(totalGross * 100) / 100,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        netProfit,
        incomeByCategory,
        expenseByCategory,
      },
      narrativeSummary: {
        weeklySummaryText,
        monthlySummaryText,
        growthInsight,
        topDay,
      },
      performance: {
        totalBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        popularServices,
        popularProducts: [],
        peakPeriods,
      },
      customers: {
        totalCustomers,
        newCustomersCount,
        returningCustomersCount,
        recentCustomers: customers.slice(0, 10),
      },
      overview: {
        todaysBookingsCount,
        upcomingBookingsCount,
        activeMembershipsCount: enrollments.length,
        upcomingEventsCount: events.length,
      },
    };
  }
}
