export type BusinessStatus = 'ACTIVE' | 'ARCHIVED' | 'INACTIVE';
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
export type BusinessPlan = 'FREE' | 'PRO';
export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
export type ItemStatus = 'ACTIVE' | 'ARCHIVED' | 'INACTIVE';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type EnrollmentStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type NotificationChannel = 'WHATSAPP' | 'SMS';
export type NotificationStatus = 'PENDING_CONFIGURATION' | 'SENT' | 'FAILED';

export interface Business {
  id: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  category: string;
  subCategory: string;
  contactNumber: string;
  whatsappNumber: string;
  website: string;
  address: string;
  location: string;
  workingHours: string;
  photos: string[];
  amenities: string[];
  email?: string;
  status: BusinessStatus;
  verificationStatus: VerificationStatus;
  plan: BusinessPlan;
  sponsoredListingEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  businessId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  availability: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  stockStatus: StockStatus;
  availability: string;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  includedServices: string[];
  validityDays: number;
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId?: string;
  serviceName: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  capacity: number;
  grossAmount: number;
  platformFee: number; // 5% handling fee
  netAmount: number;   // grossAmount - platformFee
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  durationDays: number;
  benefits: string[];
  status: ItemStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipEnrollment {
  id: string;
  businessId: string;
  membershipId: string;
  membershipName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  price: number;
  status: EnrollmentStatus;
  createdAt: string;
}

export interface BusinessEvent {
  id: string;
  businessId: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  registeredCount: number;
  price: number;
  registrationRequired: boolean;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  bookingCount: number;
  totalSpent: number;
  lastInteraction: string;
  notes?: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  role: string;
  contact: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  customerName: string;
  rating: number; // 1 - 5
  review: string;
  bookingId?: string;
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  businessId: string;
  type: 'BOOKING_CONFIRMATION' | 'BOOKING_UPDATE' | 'BOOKING_CANCELLATION' | 'MEMBERSHIP_ALERT' | 'EVENT_ALERT';
  recipientPhone: string;
  recipientName: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  subCategories: string[];
}

export interface FeeCalculation {
  grossAmount: number;
  platformFeeRate: number; // 0.05
  platformFee: number;
  netBusinessAmount: number;
}

export interface BusinessReportData {
  revenue: {
    totalRevenue: number;
    platformFeesPaid: number;
    netBusinessRevenue: number;
    revenueByPeriod: { period: string; gross: number; count: number }[];
    bookingRevenue: number;
    orderRevenue: number;
  };
  performance: {
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    popularServices: { name: string; count: number; revenue: number }[];
    popularProducts: { name: string; count: number; revenue: number }[];
    peakPeriods: { timeSlot: string; count: number }[];
  };
  customers: {
    totalCustomers: number;
    newCustomersCount: number;
    returningCustomersCount: number;
    recentCustomers: Customer[];
  };
  overview: {
    todaysBookingsCount: number;
    upcomingBookingsCount: number;
    activeMembershipsCount: number;
    upcomingEventsCount: number;
  };
}

export type Notification = NotificationRecord;
