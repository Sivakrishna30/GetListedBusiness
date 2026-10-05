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
  User,
  BusinessMember,
  Transaction,
  Expense
} from '../../shared/types.ts';
import { INITIAL_CATEGORIES } from '../../shared/constants.ts';

export interface DatabaseState {
  users: User[];
  businessMembers: BusinessMember[];
  categories: CategoryInfo[];
  businesses: Business[];
  services: Service[];
  products: Product[];
  packages: Package[];
  bookings: Booking[];
  transactions: Transaction[];
  expenses: Expense[];
  memberships: Membership[];
  membershipEnrollments: MembershipEnrollment[];
  events: BusinessEvent[];
  customers: Customer[];
  teamMembers: TeamMember[];
  reviews: Review[];
  notifications: NotificationRecord[];
}

export function createInitialSeed(): DatabaseState {
  // Real authenticated user account only — zero dummy mock data
  const users: User[] = [
    {
      id: 'user_siva_owner',
      name: 'Sivakrishna',
      email: 'sivakrishna.era@gmail.com',
      passwordHash: 'password123',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  return {
    users,
    businessMembers: [],
    categories: INITIAL_CATEGORIES,
    businesses: [],
    services: [],
    products: [],
    packages: [],
    bookings: [],
    transactions: [],
    expenses: [],
    memberships: [],
    membershipEnrollments: [],
    events: [],
    customers: [],
    teamMembers: [],
    reviews: [],
    notifications: [],
  };
}
