import { db } from '../db.ts';
import { User, BusinessMember, Business } from '../../shared/types.ts';

export class AuthService {
  public static login(email: string, password: string): { user: Omit<User, 'passwordHash'>; memberships: BusinessMember[]; businesses: Business[] } {
    const state = db.getState();
    const user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.passwordHash !== password) {
      throw new Error('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new Error('User account is suspended');
    }

    const memberships = state.businessMembers.filter(m => m.userId === user.id);
    const businessIds = new Set(memberships.map(m => m.businessId));
    const businesses = state.businesses.filter(b => businessIds.has(b.id) || b.ownerId === user.id);

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, memberships, businesses };
  }

  public static register(data: { name: string; email: string; password: string }): { user: Omit<User, 'passwordHash'>; memberships: BusinessMember[]; businesses: Business[] } {
    const state = db.getState();
    const existing = state.users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error('A user with this email already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: data.password, // In Phase 1 prototype: direct credential validation
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.update(s => {
      s.users.push(newUser);
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, memberships: [], businesses: [] };
  }

  public static getMe(userId: string): { user: Omit<User, 'passwordHash'>; memberships: BusinessMember[]; businesses: Business[] } | null {
    const state = db.getState();
    const user = state.users.find(u => u.id === userId);
    if (!user) return null;

    const memberships = state.businessMembers.filter(m => m.userId === user.id);
    const businessIds = new Set(memberships.map(m => m.businessId));
    const businesses = state.businesses.filter(b => businessIds.has(b.id) || b.ownerId === user.id);

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, memberships, businesses };
  }

  public static getUserBusinesses(userId: string): Business[] {
    const state = db.getState();
    const memberships = state.businessMembers.filter(m => m.userId === userId);
    const businessIds = new Set(memberships.map(m => m.businessId));
    return state.businesses.filter(b => businessIds.has(b.id) || b.ownerId === userId);
  }
}
