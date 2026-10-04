import { db } from '../db.ts';
import { Business, VerificationStatus, BusinessPlan } from '../../shared/types.ts';

export class BusinessService {
  public static list(params?: {
    search?: string;
    category?: string;
    subCategory?: string;
    location?: string;
  }): Business[] {
    const state = db.getState();
    let results = state.businesses.filter(b => b.status !== 'ARCHIVED');

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      results = results.filter(
        b =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.subCategory.toLowerCase().includes(q) ||
          b.location.toLowerCase().includes(q)
      );
    }

    if (params?.category && params.category !== 'All') {
      const cat = params.category.toLowerCase();
      results = results.filter(b => b.category.toLowerCase() === cat);
    }

    if (params?.subCategory && params.subCategory !== 'All') {
      const sub = params.subCategory.toLowerCase();
      results = results.filter(b => b.subCategory.toLowerCase() === sub);
    }

    if (params?.location && params.location !== 'All') {
      const loc = params.location.toLowerCase();
      results = results.filter(b => b.location.toLowerCase().includes(loc));
    }

    // Sort: Sponsored listings first, then verified, then newest
    return results.sort((a, b) => {
      if (a.sponsoredListingEnabled && !b.sponsoredListingEnabled) return -1;
      if (!a.sponsoredListingEnabled && b.sponsoredListingEnabled) return 1;
      if (a.verificationStatus === 'VERIFIED' && b.verificationStatus !== 'VERIFIED') return -1;
      if (a.verificationStatus !== 'VERIFIED' && b.verificationStatus === 'VERIFIED') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  public static getById(id: string): Business | null {
    const state = db.getState();
    return state.businesses.find(b => b.id === id) || null;
  }

  public static create(input: Partial<Business>): Business {
    if (!input.name || !input.name.trim()) {
      throw new Error('Business name is required.');
    }
    if (!input.category || !input.category.trim()) {
      throw new Error('Business category is required.');
    }

    const newId = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newBusiness: Business = {
      id: newId,
      name: input.name.trim(),
      logo: input.logo?.trim() || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&h=200&fit=crop&q=80',
      coverImage: input.coverImage?.trim() || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=600&fit=crop&q=80',
      description: input.description?.trim() || 'Welcome to our business on GetListed.',
      category: input.category.trim(),
      subCategory: input.subCategory?.trim() || input.category.trim(),
      contactNumber: input.contactNumber?.trim() || '',
      whatsappNumber: input.whatsappNumber?.trim() || input.contactNumber?.trim() || '',
      website: input.website?.trim() || '',
      address: input.address?.trim() || '',
      location: input.location?.trim() || 'India',
      workingHours: input.workingHours?.trim() || '09:00 AM - 08:00 PM',
      photos: input.photos && input.photos.length > 0 ? input.photos : [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&fit=crop&q=80'
      ],
      amenities: input.amenities || ['Drinking Water', 'Parking Available'],
      status: input.status || 'ACTIVE',
      verificationStatus: input.verificationStatus || 'UNVERIFIED',
      plan: input.plan || 'FREE',
      sponsoredListingEnabled: Boolean(input.sponsoredListingEnabled),
      ownerId: input.ownerId || 'user_siva_owner',
      businessType: input.businessType || 'GENERAL',
      enabledOperations: input.enabledOperations && input.enabledOperations.length > 0
        ? input.enabledOperations
        : ['BOOKINGS', 'SERVICES', 'TRANSACTIONS', 'EXPENSES'],
      operationConfig: input.operationConfig,
      createdAt: now,
      updatedAt: now,
    };

    db.update(state => {
      state.businesses.push(newBusiness);
    });

    return newBusiness;
  }

  public static update(id: string, input: Partial<Business>): Business {
    const state = db.getState();
    const index = state.businesses.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error(`Business with ID ${id} not found.`);
    }

    const current = state.businesses[index];
    const updated: Business = {
      ...current,
      ...input,
      id: current.id, // prevent ID change
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.businesses[index] = updated;
    });

    return updated;
  }

  public static archive(id: string): boolean {
    const state = db.getState();
    const business = state.businesses.find(b => b.id === id);
    if (!business) {
      throw new Error(`Business with ID ${id} not found.`);
    }

    db.update(s => {
      const idx = s.businesses.findIndex(b => b.id === id);
      if (idx !== -1) {
        s.businesses[idx].status = 'ARCHIVED';
        s.businesses[idx].updatedAt = new Date().toISOString();
      }
    });

    return true;
  }

  public static updateVerification(id: string, verificationStatus: VerificationStatus): Business {
    return this.update(id, { verificationStatus });
  }

  public static updatePlan(id: string, plan: BusinessPlan): Business {
    return this.update(id, { plan });
  }

  public static updateSponsored(id: string, sponsoredListingEnabled: boolean): Business {
    return this.update(id, { sponsoredListingEnabled });
  }

  public static updateOperations(
    id: string,
    data: {
      businessType?: any;
      enabledOperations?: any[];
      operationConfig?: any;
    }
  ): Business {
    const state = db.getState();
    const idx = state.businesses.findIndex(b => b.id === id);
    if (idx === -1) {
      throw new Error(`Business with ID ${id} not found.`);
    }

    const current = state.businesses[idx];
    const updated: Business = {
      ...current,
      businessType: data.businessType || current.businessType || 'GENERAL',
      enabledOperations: Array.isArray(data.enabledOperations) ? data.enabledOperations : current.enabledOperations,
      operationConfig: data.operationConfig
        ? { ...current.operationConfig, ...data.operationConfig }
        : current.operationConfig,
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.businesses[idx] = updated;
    });

    return updated;
  }
}
