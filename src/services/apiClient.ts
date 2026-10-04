import {
  Business,
  Service,
  Product,
  Package,
  Booking,
  Membership,
  MembershipEnrollment,
  BusinessEvent,
  Customer,
  TeamMember,
  Review,
  NotificationRecord,
  CategoryInfo,
  BusinessReportData,
  VerificationStatus,
  BusinessPlan,
  BookingStatus,
  User,
  BusinessMember,
  Transaction,
  Expense,
  ExpenseCategory,
  PaymentMethod,
  Operation,
  BusinessType,
  BusinessOperationConfig,
} from '../../shared/types.ts';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.error || 'Network request failed');
  }
  return json.data as T;
}

export const api = {
  // Categories
  getCategories: () => request<CategoryInfo[]>('/api/categories'),

  // Businesses
  listBusinesses: (params?: { search?: string; category?: string; subCategory?: string; location?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.category) query.set('category', params.category);
    if (params?.subCategory) query.set('subCategory', params.subCategory);
    if (params?.location) query.set('location', params.location);
    return request<Business[]>(`/api/businesses?${query.toString()}`);
  },

  getBusiness: (id: string) =>
    request<
      Business & {
        services: Service[];
        products: Product[];
        packages: Package[];
        memberships: Membership[];
        events: BusinessEvent[];
        reviews: Review[];
      }
    >(`/api/businesses/${id}`),

  createBusiness: (data: Partial<Business>) =>
    request<Business>('/api/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateBusiness: (id: string, data: Partial<Business>) =>
    request<Business>(`/api/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  archiveBusiness: (id: string) =>
    request<{ message: string }>(`/api/businesses/${id}`, {
      method: 'DELETE',
    }),

  updateVerification: (id: string, status: VerificationStatus) =>
    request<Business>(`/api/businesses/${id}/verification`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  updatePlan: (id: string, plan: BusinessPlan) =>
    request<Business>(`/api/businesses/${id}/plan`, {
      method: 'PATCH',
      body: JSON.stringify({ plan }),
    }),

  updateSponsored: (id: string, enabled: boolean) =>
    request<Business>(`/api/businesses/${id}/sponsored`, {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    }),

  // Services
  listServices: (businessId: string) => request<Service[]>(`/api/businesses/${businessId}/services`),
  createService: (businessId: string, data: Partial<Service>) =>
    request<Service>(`/api/businesses/${businessId}/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateService: (id: string, data: Partial<Service>) =>
    request<Service>(`/api/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  archiveService: (id: string) =>
    request<{ message: string }>(`/api/services/${id}`, {
      method: 'DELETE',
    }),

  // Products
  listProducts: (businessId: string) => request<Product[]>(`/api/businesses/${businessId}/products`),
  createProduct: (businessId: string, data: Partial<Product>) =>
    request<Product>(`/api/businesses/${businessId}/products`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: Partial<Product>) =>
    request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  archiveProduct: (id: string) =>
    request<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),

  // Packages
  listPackages: (businessId: string) => request<Package[]>(`/api/businesses/${businessId}/packages`),
  createPackage: (businessId: string, data: Partial<Package>) =>
    request<Package>(`/api/businesses/${businessId}/packages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePackage: (id: string, data: Partial<Package>) =>
    request<Package>(`/api/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  archivePackage: (id: string) =>
    request<{ message: string }>(`/api/packages/${id}`, {
      method: 'DELETE',
    }),

  // Memberships & Enrollments
  listMemberships: (businessId: string) => request<Membership[]>(`/api/businesses/${businessId}/memberships`),
  createMembership: (businessId: string, data: Partial<Membership>) =>
    request<Membership>(`/api/businesses/${businessId}/memberships`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMembership: (id: string, data: Partial<Membership>) =>
    request<Membership>(`/api/memberships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  listEnrollments: (businessId: string) =>
    request<MembershipEnrollment[]>(`/api/businesses/${businessId}/enrollments`),
  enrollMembership: (businessId: string, data: { membershipId: string; customerName: string; customerPhone: string }) =>
    request<MembershipEnrollment>(`/api/businesses/${businessId}/enrollments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Events
  listEvents: (businessId: string) => request<BusinessEvent[]>(`/api/businesses/${businessId}/events`),
  createEvent: (businessId: string, data: Partial<BusinessEvent>) =>
    request<BusinessEvent>(`/api/businesses/${businessId}/events`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEvent: (id: string, data: Partial<BusinessEvent>) =>
    request<BusinessEvent>(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  archiveEvent: (id: string) =>
    request<{ message: string }>(`/api/events/${id}`, {
      method: 'DELETE',
    }),

  // Bookings
  listBookings: (businessId: string, filters?: { date?: string; status?: BookingStatus }) => {
    const q = new URLSearchParams();
    if (filters?.date) q.set('date', filters.date);
    if (filters?.status) q.set('status', filters.status);
    return request<Booking[]>(`/api/businesses/${businessId}/bookings?${q.toString()}`);
  },
  getCustomerBookings: (phone: string) =>
    request<Booking[]>(`/api/customer/bookings?phone=${encodeURIComponent(phone)}`),
  createBooking: (data: {
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
  }) =>
    request<Booking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateBookingStatus: (id: string, status: BookingStatus) =>
    request<Booking>(`/api/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  rescheduleBooking: (id: string, data: { date: string; startTime: string; endTime: string }) =>
    request<Booking>(`/api/bookings/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // --- Auth (Phase 1 Prototype: Email + Password) ---
  login: (data: { email: string; password: string }) =>
    request<{ user: Omit<User, 'passwordHash'>; memberships: BusinessMember[]; businesses: Business[] }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  register: (data: { name: string; email: string; password: string }) =>
    request<{ user: Omit<User, 'passwordHash'>; memberships: BusinessMember[]; businesses: Business[] }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMe: (userId?: string) =>
    request<{ user: Omit<User, 'passwordHash'>; memberships: BusinessMember[]; businesses: Business[] }>(`/api/auth/me?userId=${userId || ''}`),
  getUserBusinesses: (userId: string) =>
    request<Business[]>(`/api/users/${userId}/businesses`),

  // --- Operations Config (ADR-008) ---
  updateOperations: (businessId: string, data: { enabledOperations?: Operation[]; operationConfig?: BusinessOperationConfig; businessType?: BusinessType }) =>
    request<Business>(`/api/businesses/${businessId}/operations`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Customers & Reviews
  listCustomers: (businessId: string, search?: string) =>
    request<Customer[]>(`/api/businesses/${businessId}/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  createCustomer: (businessId: string, data: { name: string; phone: string; email?: string; notes?: string }) =>
    request<Customer>(`/api/businesses/${businessId}/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomerNotes: (customerId: string, notes: string) =>
    request<Customer>(`/api/customers/${customerId}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    }),
  listReviews: (businessId: string) => request<Review[]>(`/api/businesses/${businessId}/reviews`),
  createReview: (businessId: string, data: { customerName: string; rating: number; review: string; bookingId?: string }) =>
    request<Review>(`/api/businesses/${businessId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // --- Transactions & Money Movement (ADR-006) ---
  listTransactions: (businessId: string, filters?: { type?: string; date?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (filters?.type) q.set('type', filters.type);
    if (filters?.date) q.set('date', filters.date);
    if (filters?.status) q.set('status', filters.status);
    return request<Transaction[]>(`/api/businesses/${businessId}/transactions?${q.toString()}`);
  },
  recordIncome: (data: {
    businessId: string;
    category: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date?: string;
    bookingId?: string;
    customerId?: string;
    customerName?: string;
    description?: string;
    referenceNumber?: string;
  }) =>
    request<Transaction>(`/api/businesses/${data.businessId}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getTransactionSummary: (businessId: string) =>
    request<{
      totalIncome: number;
      totalTransactionsCount: number;
      byPaymentMethod: { method: PaymentMethod; amount: number; count: number }[];
      recentTransactions: Transaction[];
    }>(`/api/businesses/${businessId}/transactions/summary`),

  // --- Expenses (Phase 1 Manual Expense Management) ---
  listExpenses: (businessId: string, filters?: { category?: string; date?: string; startDate?: string; endDate?: string }) => {
    const q = new URLSearchParams();
    if (filters?.category) q.set('category', filters.category);
    if (filters?.date) q.set('date', filters.date);
    if (filters?.startDate) q.set('startDate', filters.startDate);
    if (filters?.endDate) q.set('endDate', filters.endDate);
    return request<Expense[]>(`/api/businesses/${businessId}/expenses?${q.toString()}`);
  },
  createExpense: (data: {
    businessId: string;
    category: ExpenseCategory;
    amount: number;
    date: string;
    description: string;
    paymentMethod: PaymentMethod;
    paidTo?: string;
    receiptRef?: string;
  }) =>
    request<Expense>(`/api/businesses/${data.businessId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateExpense: (id: string, data: Partial<Expense>) =>
    request<Expense>(`/api/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteExpense: (id: string) =>
    request<{ message: string }>(`/api/expenses/${id}`, {
      method: 'DELETE',
    }),
  getExpenseSummary: (businessId: string) =>
    request<{
      totalExpenses: number;
      byCategory: { category: ExpenseCategory; amount: number; count: number }[];
      recentExpenses: Expense[];
    }>(`/api/businesses/${businessId}/expenses/summary`),

  // Team
  listTeam: (businessId: string) => request<TeamMember[]>(`/api/businesses/${businessId}/team`),
  createTeamMember: (businessId: string, data: Partial<TeamMember>) =>
    request<TeamMember>(`/api/businesses/${businessId}/team`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTeamMember: (id: string, data: Partial<TeamMember>) =>
    request<TeamMember>(`/api/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deactivateTeamMember: (id: string) =>
    request<TeamMember>(`/api/team/${id}`, {
      method: 'DELETE',
    }),

  // Reports & Insights
  getReports: (businessId: string) => request<BusinessReportData>(`/api/businesses/${businessId}/reports`),

  // Notifications
  getNotifications: (businessId: string) =>
    request<NotificationRecord[]>(`/api/businesses/${businessId}/notifications`),
  listNotifications: (businessId: string) =>
    request<NotificationRecord[]>(`/api/businesses/${businessId}/notifications`),

  // Reset
  resetSystem: () => request<{ message: string }>('/api/system/reset', { method: 'POST' }),
};
