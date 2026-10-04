import { db } from '../db.ts';
import { Booking, BookingStatus, Customer, NotificationRecord } from '../../shared/types.ts';
import { calculatePlatformFee } from '../../shared/feeCalculator.ts';

export class BookingService {
  public static list(businessId?: string, filters?: { date?: string; status?: BookingStatus }): Booking[] {
    const state = db.getState();
    let list = state.bookings;

    if (businessId) {
      list = list.filter(b => b.businessId === businessId);
    }

    if (filters?.date) {
      list = list.filter(b => b.date === filters.date);
    }

    if (filters?.status) {
      list = list.filter(b => b.status === filters.status);
    }

    return list.sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());
  }

  public static getById(id: string): Booking | null {
    return db.getState().bookings.find(b => b.id === id) || null;
  }

  public static listByCustomerPhone(phone: string): Booking[] {
    const clean = phone.replace(/\D/g, '');
    return db
      .getState()
      .bookings.filter(
        b =>
          (clean.length >= 4 && b.customerPhone.replace(/\D/g, '').includes(clean)) ||
          b.customerPhone.toLowerCase().includes(phone.toLowerCase().trim())
      )
      .sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime());
  }

  public static create(input: {
    businessId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    serviceId?: string;
    serviceName: string;
    date: string;
    startTime: string;
    endTime: string;
    durationMinutes?: number;
    capacity?: number;
    grossAmount: number;
    notes?: string;
  }): Booking {
    // Validation
    if (!input.businessId) throw new Error('Business ID is required.');
    if (!input.customerName || !input.customerName.trim()) throw new Error('Customer name is required.');
    if (!input.customerPhone || !input.customerPhone.trim()) throw new Error('Customer contact number is required.');
    if (!input.serviceName || !input.serviceName.trim()) throw new Error('Service name is required.');
    if (!input.date) throw new Error('Booking date is required.');
    if (!input.startTime || !input.endTime) throw new Error('Booking start and end time are required.');

    const state = db.getState();
    const business = state.businesses.find(b => b.id === input.businessId);
    if (!business) throw new Error('Business not found.');

    // Check slot availability collision (same business, same service, same date and time range)
    const existingActiveBooking = state.bookings.find(b =>
      b.businessId === input.businessId &&
      b.serviceId === input.serviceId &&
      b.date === input.date &&
      b.startTime === input.startTime &&
      (b.status === 'CONFIRMED' || b.status === 'PENDING')
    );

    if (existingActiveBooking) {
      throw new Error(`The selected time slot (${input.startTime} - ${input.endTime}) on ${input.date} is already booked.`);
    }

    // 5% Platform Handling Fee calculation from transaction/domain layer
    const fee = calculatePlatformFee(input.grossAmount);

    const now = new Date().toISOString();
    const customerId = `cust_${input.customerPhone.replace(/\D/g, '') || Date.now()}`;
    const newBookingId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const newBooking: Booking = {
      id: newBookingId,
      businessId: input.businessId,
      customerId,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      customerEmail: input.customerEmail?.trim(),
      serviceId: input.serviceId,
      serviceName: input.serviceName.trim(),
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      durationMinutes: input.durationMinutes || 60,
      capacity: input.capacity || 1,
      grossAmount: fee.grossAmount,
      platformFee: fee.platformFee,
      netAmount: fee.netBusinessAmount,
      status: 'CONFIRMED',
      notes: input.notes?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    // Update DB: booking, customer record, and pending notification
    db.update(s => {
      s.bookings.push(newBooking);

      // Customer synchronization
      let cust = s.customers.find(c => c.businessId === input.businessId && c.phone === input.customerPhone.trim());
      if (cust) {
        cust.bookingCount += 1;
        cust.totalSpent += fee.grossAmount;
        cust.lastInteraction = now;
        if (input.customerEmail && !cust.email) cust.email = input.customerEmail.trim();
      } else {
        const newCust: Customer = {
          id: customerId,
          businessId: input.businessId,
          name: input.customerName.trim(),
          phone: input.customerPhone.trim(),
          email: input.customerEmail?.trim(),
          bookingCount: 1,
          totalSpent: fee.grossAmount,
          lastInteraction: now,
          notes: 'Customer created via booking.',
          createdAt: now,
        };
        s.customers.push(newCust);
      }

      // Add WhatsApp Notification in PENDING_CONFIGURATION status as per spec
      const notifWhatsApp: NotificationRecord = {
        id: `notif_${Date.now()}_wa`,
        businessId: input.businessId,
        type: 'BOOKING_CONFIRMATION',
        recipientPhone: input.customerPhone.trim(),
        recipientName: input.customerName.trim(),
        title: `Booking Confirmed - ${business.name}`,
        message: `Hi ${input.customerName}, your booking for ${input.serviceName} on ${input.date} at ${input.startTime} has been confirmed. Total: ₹${fee.grossAmount}.`,
        channel: 'WHATSAPP',
        status: 'PENDING_CONFIGURATION',
        createdAt: now,
      };
      s.notifications.push(notifWhatsApp);
    });

    return newBooking;
  }

  public static updateStatus(id: string, status: BookingStatus): Booking {
    const state = db.getState();
    const idx = state.bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error(`Booking ${id} not found.`);

    const booking = state.bookings[idx];
    const updated: Booking = {
      ...booking,
      status,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.bookings[idx] = updated;

      // Add notification record for cancellation or update
      if (status === 'CANCELLED') {
        s.notifications.push({
          id: `notif_${Date.now()}_cancel`,
          businessId: updated.businessId,
          type: 'BOOKING_CANCELLATION',
          recipientPhone: updated.customerPhone,
          recipientName: updated.customerName,
          title: `Booking Cancelled - ${updated.serviceName}`,
          message: `Booking #${updated.id} for ${updated.date} has been cancelled.`,
          channel: 'SMS',
          status: 'PENDING_CONFIGURATION',
          createdAt: new Date().toISOString(),
        });
      }
    });

    return updated;
  }

  public static reschedule(id: string, date: string, startTime: string, endTime: string): Booking {
    const state = db.getState();
    const idx = state.bookings.findIndex(b => b.id === id);
    if (idx === -1) throw new Error(`Booking ${id} not found.`);

    const booking = state.bookings[idx];
    const updated: Booking = {
      ...booking,
      date,
      startTime,
      endTime,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.bookings[idx] = updated;
      s.notifications.push({
        id: `notif_${Date.now()}_resched`,
        businessId: updated.businessId,
        type: 'BOOKING_UPDATE',
        recipientPhone: updated.customerPhone,
        recipientName: updated.customerName,
        title: `Booking Rescheduled - ${updated.serviceName}`,
        message: `Your booking has been rescheduled to ${date} from ${startTime} to ${endTime}.`,
        channel: 'WHATSAPP',
        status: 'PENDING_CONFIGURATION',
        createdAt: new Date().toISOString(),
      });
    });

    return updated;
  }
}
