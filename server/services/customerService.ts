import { db } from '../db.ts';
import { Customer, Review } from '../../shared/types.ts';

export class CustomerService {
  public static listCustomers(businessId: string, search?: string): Customer[] {
    let list = db.getState().customers.filter(c => c.businessId === businessId);
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q)));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static getCustomer(id: string): Customer | null {
    return db.getState().customers.find(c => c.id === id) || null;
  }

  public static createCustomer(data: {
    businessId: string;
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  }): Customer {
    if (!data.businessId) throw new Error('Business ID is required.');
    if (!data.name || !data.name.trim()) throw new Error('Customer name is required.');
    if (!data.phone || !data.phone.trim()) throw new Error('Customer phone is required.');

    const state = db.getState();
    const existing = state.customers.find(c => c.businessId === data.businessId && c.phone.trim() === data.phone.trim());
    if (existing) {
      throw new Error(`A customer with phone ${data.phone} already exists for this business.`);
    }

    const newCustomer: Customer = {
      id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId: data.businessId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      bookingCount: 0,
      totalSpent: 0,
      lastInteraction: new Date().toISOString(),
      notes: data.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    db.update(s => {
      s.customers.unshift(newCustomer);
    });

    return newCustomer;
  }

  public static updateCustomerNotes(id: string, notes: string): Customer {
    const state = db.getState();
    const idx = state.customers.findIndex(c => c.id === id);
    if (idx === -1) throw new Error(`Customer ${id} not found.`);

    state.customers[idx].notes = notes;
    db.update(s => {
      s.customers[idx].notes = notes;
    });
    return state.customers[idx];
  }

  // --- Reviews & Ratings ---
  public static listReviews(businessId: string): Review[] {
    return db.getState().reviews
      .filter(r => r.businessId === businessId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public static createReview(input: {
    businessId: string;
    customerName: string;
    rating: number;
    review: string;
    bookingId?: string;
  }): Review {
    if (!input.businessId) throw new Error('Business ID is required.');
    if (!input.customerName || !input.customerName.trim()) throw new Error('Name is required.');
    const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 5)));
    if (!input.review || !input.review.trim()) throw new Error('Review text is required.');

    const newReview: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId: input.businessId,
      customerName: input.customerName.trim(),
      rating,
      review: input.review.trim(),
      bookingId: input.bookingId,
      createdAt: new Date().toISOString(),
    };

    db.update(s => s.reviews.unshift(newReview));
    return newReview;
  }
}
