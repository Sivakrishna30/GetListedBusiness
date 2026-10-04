import { db } from '../db.ts';
import { BusinessReportData } from '../../shared/types.ts';

export class ReportService {
  public static getReportsForBusiness(businessId: string): BusinessReportData {
    const state = db.getState();
    const bookings = state.bookings.filter(b => b.businessId === businessId);
    const customers = state.customers.filter(c => c.businessId === businessId);
    const memberships = state.memberships.filter(m => m.businessId === businessId);
    const enrollments = state.membershipEnrollments.filter(e => e.businessId === businessId && e.status === 'ACTIVE');
    const events = state.events.filter(e => e.businessId === businessId && e.status === 'PUBLISHED');

    const completedOrConfirmed = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED');

    // Revenue calculations
    const totalGross = completedOrConfirmed.reduce((sum, b) => sum + (b.grossAmount || 0), 0);
    const totalPlatformFee = completedOrConfirmed.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    const netBusinessRevenue = completedOrConfirmed.reduce((sum, b) => sum + (b.netAmount || 0), 0);

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
      .sort((a, b) => a[0].localeCompare(b[0]))
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

    // Customers metrics
    const totalCustomers = customers.length;
    const newCustomersCount = customers.filter(c => c.bookingCount <= 1).length;
    const returningCustomersCount = customers.filter(c => c.bookingCount > 1).length;

    // Overview counters
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysBookingsCount = bookings.filter(b => b.date === todayStr && b.status !== 'CANCELLED').length;
    const upcomingBookingsCount = bookings.filter(b => b.date >= todayStr && (b.status === 'CONFIRMED' || b.status === 'PENDING')).length;

    return {
      revenue: {
        totalRevenue: Math.round(totalGross * 100) / 100,
        platformFeesPaid: Math.round(totalPlatformFee * 100) / 100,
        netBusinessRevenue: Math.round(netBusinessRevenue * 100) / 100,
        revenueByPeriod,
        bookingRevenue: Math.round(totalGross * 100) / 100,
        orderRevenue: 0,
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
