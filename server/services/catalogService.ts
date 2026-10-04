import { db } from '../db.ts';
import {
  Service,
  Product,
  Package,
  Membership,
  MembershipEnrollment,
  BusinessEvent,
  ItemStatus,
  EventStatus
} from '../../shared/types.ts';

export class CatalogService {
  // --- Services CRUD ---
  public static listServices(businessId: string): Service[] {
    return db.getState().services.filter(s => s.businessId === businessId && s.status !== 'ARCHIVED');
  }

  public static getServiceById(id: string): Service | null {
    return db.getState().services.find(s => s.id === id) || null;
  }

  public static createService(businessId: string, input: Partial<Service>): Service {
    if (!input.name || !input.name.trim()) throw new Error('Service name is required.');
    const price = Number(input.price);
    if (isNaN(price) || price < 0) throw new Error('Valid non-negative price is required.');

    const newService: Service = {
      id: `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      durationMinutes: Number(input.durationMinutes) || 60,
      price,
      availability: input.availability?.trim() || 'Available daily during business hours',
      status: input.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => s.services.push(newService));
    return newService;
  }

  public static updateService(id: string, input: Partial<Service>): Service {
    const state = db.getState();
    const idx = state.services.findIndex(s => s.id === id);
    if (idx === -1) throw new Error(`Service ${id} not found.`);

    const current = state.services[idx];
    const updated: Service = {
      ...current,
      ...input,
      id: current.id,
      businessId: current.businessId,
      price: input.price !== undefined ? Number(input.price) : current.price,
      durationMinutes: input.durationMinutes !== undefined ? Number(input.durationMinutes) : current.durationMinutes,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => { s.services[idx] = updated; });
    return updated;
  }

  public static archiveService(id: string): boolean {
    db.update(s => {
      const item = s.services.find(i => i.id === id);
      if (item) {
        item.status = 'ARCHIVED';
        item.updatedAt = new Date().toISOString();
      }
    });
    return true;
  }

  // --- Products CRUD ---
  public static listProducts(businessId: string): Product[] {
    return db.getState().products.filter(p => p.businessId === businessId && p.status !== 'ARCHIVED');
  }

  public static createProduct(businessId: string, input: Partial<Product>): Product {
    if (!input.name || !input.name.trim()) throw new Error('Product name is required.');
    const price = Number(input.price);
    if (isNaN(price) || price < 0) throw new Error('Valid non-negative price is required.');

    const newProduct: Product = {
      id: `prd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      price,
      stockStatus: input.stockStatus || 'IN_STOCK',
      availability: input.availability?.trim() || 'Available on counter/premises',
      status: input.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => s.products.push(newProduct));
    return newProduct;
  }

  public static updateProduct(id: string, input: Partial<Product>): Product {
    const state = db.getState();
    const idx = state.products.findIndex(p => p.id === id);
    if (idx === -1) throw new Error(`Product ${id} not found.`);

    const current = state.products[idx];
    const updated: Product = {
      ...current,
      ...input,
      id: current.id,
      businessId: current.businessId,
      price: input.price !== undefined ? Number(input.price) : current.price,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => { s.products[idx] = updated; });
    return updated;
  }

  public static archiveProduct(id: string): boolean {
    db.update(s => {
      const item = s.products.find(i => i.id === id);
      if (item) {
        item.status = 'ARCHIVED';
        item.updatedAt = new Date().toISOString();
      }
    });
    return true;
  }

  // --- Packages CRUD ---
  public static listPackages(businessId: string): Package[] {
    return db.getState().packages.filter(p => p.businessId === businessId && p.status !== 'ARCHIVED');
  }

  public static createPackage(businessId: string, input: Partial<Package>): Package {
    if (!input.name || !input.name.trim()) throw new Error('Package name is required.');
    const price = Number(input.price);
    if (isNaN(price) || price < 0) throw new Error('Valid non-negative price is required.');

    const newPackage: Package = {
      id: `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      price,
      includedServices: input.includedServices || [],
      validityDays: Number(input.validityDays) || 30,
      status: input.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => s.packages.push(newPackage));
    return newPackage;
  }

  public static updatePackage(id: string, input: Partial<Package>): Package {
    const state = db.getState();
    const idx = state.packages.findIndex(p => p.id === id);
    if (idx === -1) throw new Error(`Package ${id} not found.`);

    const current = state.packages[idx];
    const updated: Package = {
      ...current,
      ...input,
      id: current.id,
      businessId: current.businessId,
      price: input.price !== undefined ? Number(input.price) : current.price,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => { s.packages[idx] = updated; });
    return updated;
  }

  public static archivePackage(id: string): boolean {
    db.update(s => {
      const item = s.packages.find(i => i.id === id);
      if (item) {
        item.status = 'ARCHIVED';
        item.updatedAt = new Date().toISOString();
      }
    });
    return true;
  }

  // --- Memberships CRUD ---
  public static listMemberships(businessId: string): Membership[] {
    return db.getState().memberships.filter(m => m.businessId === businessId);
  }

  public static createMembership(businessId: string, input: Partial<Membership>): Membership {
    if (!input.name || !input.name.trim()) throw new Error('Membership name is required.');
    const price = Number(input.price);
    if (isNaN(price) || price < 0) throw new Error('Valid price is required.');

    const newMembership: Membership = {
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      price,
      durationDays: Number(input.durationDays) || 30,
      benefits: input.benefits || ['Standard Access'],
      status: input.status || 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => s.memberships.push(newMembership));
    return newMembership;
  }

  public static updateMembership(id: string, input: Partial<Membership>): Membership {
    const state = db.getState();
    const idx = state.memberships.findIndex(m => m.id === id);
    if (idx === -1) throw new Error(`Membership ${id} not found.`);

    const current = state.memberships[idx];
    const updated: Membership = {
      ...current,
      ...input,
      id: current.id,
      businessId: current.businessId,
      price: input.price !== undefined ? Number(input.price) : current.price,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => { s.memberships[idx] = updated; });
    return updated;
  }

  public static listEnrollments(businessId: string): MembershipEnrollment[] {
    return db.getState().membershipEnrollments.filter(e => e.businessId === businessId);
  }

  public static enrollMembership(businessId: string, input: {
    membershipId: string;
    customerName: string;
    customerPhone: string;
  }): MembershipEnrollment {
    const membership = db.getState().memberships.find(m => m.id === input.membershipId);
    if (!membership) throw new Error('Membership not found.');

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + membership.durationDays * 24 * 60 * 60 * 1000);

    const enrollment: MembershipEnrollment = {
      id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId,
      membershipId: membership.id,
      membershipName: membership.name,
      customerId: `cust_${input.customerPhone.replace(/\D/g, '') || Date.now()}`,
      customerName: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      price: membership.price,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    db.update(s => s.membershipEnrollments.push(enrollment));
    return enrollment;
  }

  // --- Events CRUD ---
  public static listEvents(businessId: string): BusinessEvent[] {
    return db.getState().events.filter(e => e.businessId === businessId && e.status !== 'ARCHIVED');
  }

  public static createEvent(businessId: string, input: Partial<BusinessEvent>): BusinessEvent {
    if (!input.name || !input.name.trim()) throw new Error('Event name is required.');
    if (!input.date) throw new Error('Event date is required.');

    const newEvent: BusinessEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessId,
      name: input.name.trim(),
      description: input.description?.trim() || '',
      date: input.date,
      startTime: input.startTime || '10:00',
      endTime: input.endTime || '12:00',
      location: input.location?.trim() || 'On business premises',
      capacity: Number(input.capacity) || 50,
      registeredCount: 0,
      price: Number(input.price) || 0,
      registrationRequired: input.registrationRequired ?? true,
      status: input.status || 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => s.events.push(newEvent));
    return newEvent;
  }

  public static updateEvent(id: string, input: Partial<BusinessEvent>): BusinessEvent {
    const state = db.getState();
    const idx = state.events.findIndex(e => e.id === id);
    if (idx === -1) throw new Error(`Event ${id} not found.`);

    const current = state.events[idx];
    const updated: BusinessEvent = {
      ...current,
      ...input,
      id: current.id,
      businessId: current.businessId,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => { s.events[idx] = updated; });
    return updated;
  }

  public static archiveEvent(id: string): boolean {
    db.update(s => {
      const item = s.events.find(i => i.id === id);
      if (item) {
        item.status = 'ARCHIVED';
        item.updatedAt = new Date().toISOString();
      }
    });
    return true;
  }
}
