import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Business } from '../../../shared/types.ts';
import { VerificationBadge, PlanBadge } from '../../components/Badge.tsx';
import { Modal } from '../../components/Modal.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  Building2,
  Layers,
  ShoppingBag,
  Package,
  Calendar,
  Users,
  ShieldCheck,
  BarChart3,
  Settings,
  ChevronDown,
  Plus,
  Compass,
  Sparkles,
  ExternalLink,
  CreditCard,
  Receipt,
  UserCheck,
} from 'lucide-react';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  selectedBusinessId: string;
  onSelectBusinessId: (id: string) => void;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  selectedBusinessId,
  onSelectBusinessId,
  onNavigate,
  children,
}) => {
  const { user, openAuthModal, roleForBusiness } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  // New Business Modal
  const [isNewBizModalOpen, setIsNewBizModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Sports');
  const [newSubCategory, setNewSubCategory] = useState('Turf');
  const [newLocation, setNewLocation] = useState('Bengaluru');
  const [newDescription, setNewDescription] = useState('');
  const [newContact, setNewContact] = useState('');
  const [creatingBiz, setCreatingBiz] = useState(false);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const list = await api.listBusinesses();
      setBusinesses(list);
      if ((!selectedBusinessId || !list.some(b => b.id === selectedBusinessId)) && list.length > 0) {
        onSelectBusinessId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const currentBusiness = businesses.find(b => b.id === selectedBusinessId) || businesses[0];

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      setCreatingBiz(true);
      const created = await api.createBusiness({
        name: newName.trim(),
        category: newCategory,
        subCategory: newSubCategory,
        location: newLocation,
        description: newDescription.trim() || 'Local business providing high quality services.',
        contactNumber: newContact.trim() || '+91 98860 11223',
        workingHours: '06:00 AM - 10:00 PM',
        verificationStatus: 'UNVERIFIED',
        plan: 'FREE',
        ownerId: user?.id,
      });
      setIsNewBizModalOpen(false);
      setNewName('');
      setNewDescription('');
      setNewContact('');
      await fetchBusinesses();
      onSelectBusinessId(created.id);
    } catch (err: any) {
      console.error('Failed to create business profile:', err);
    } finally {
      setCreatingBiz(false);
    }
  };

  const enabledOps = currentBusiness?.enabledOperations || [
    'BOOKINGS',
    'SERVICES',
    'TRANSACTIONS',
    'EXPENSES',
  ];

  interface NavItem {
    id: string;
    label: string;
    icon: any;
    requiredOp: string | null;
    badge?: string;
  }

  const allPossibleItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, requiredOp: null },
    { id: 'profile', label: 'Business Profile', icon: Building2, requiredOp: null },
    { id: 'services', label: 'Services', icon: Layers, requiredOp: 'SERVICES' },
    { id: 'products', label: 'Products', icon: ShoppingBag, requiredOp: 'PRODUCTS' },
    { id: 'packages', label: 'Packages', icon: Package, requiredOp: 'PACKAGES' },
    { id: 'bookings', label: 'Bookings & Slots', icon: Calendar, requiredOp: 'BOOKINGS' },
    { id: 'transactions', label: 'Financial Ledger', icon: CreditCard, requiredOp: 'TRANSACTIONS' },
    { id: 'expenses', label: 'Expenses', icon: Receipt, requiredOp: 'EXPENSES' },
    { id: 'memberships', label: 'Memberships', icon: Users, requiredOp: 'MEMBERSHIPS' },
    { id: 'events', label: 'Events & Programs', icon: Calendar, requiredOp: 'EVENTS' },
    { id: 'customers', label: 'Customers', icon: Users, requiredOp: null },
    { id: 'team', label: 'Team', icon: ShieldCheck, requiredOp: null },
    { id: 'reports', label: 'Reports & Revenue', icon: BarChart3, requiredOp: null },
    { id: 'settings', label: 'Settings & Plan', icon: Settings, requiredOp: null },
  ];

  const navItems = allPossibleItems.filter(
    item => !item.requiredOp || enabledOps.includes(item.requiredOp as any)
  );

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top Business Context Bar */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Business Selector & User Context */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs text-stone-700 transition-colors cursor-pointer shrink-0"
              title={user ? `Signed in as ${user.name} - Click to manage or Sign Out` : 'Click to Sign In'}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#0F766E]" />
              <span className="font-semibold">{user ? user.name : 'Sign In'}</span>
              <span className="text-2xs text-stone-500 font-mono">
                ({user ? roleForBusiness(selectedBusinessId) : 'Guest'})
              </span>
            </button>

            <span className="text-xs font-semibold text-stone-300 hidden sm:inline">|</span>

            <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider shrink-0 hidden xs:inline">
                Business:
              </span>
              <div className="relative min-w-0 flex-1 sm:w-56">
                <select
                  id="business-switcher"
                  value={selectedBusinessId}
                  onChange={e => onSelectBusinessId(e.target.value)}
                  className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F766E] truncate"
                >
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.businessType || b.category})
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="onboard-new-biz-btn"
                onClick={() => setIsNewBizModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1]/50 border border-[#0F766E]/30 transition-colors shrink-0 cursor-pointer"
                title="Add and onboard another business entity"
              >
                <Plus className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="hidden sm:inline">New Business</span>
              </button>
            </div>
          </div>

          {/* Current Business Status Badges */}
          {currentBusiness && (
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1 md:pt-0 border-t md:border-t-0 border-stone-100">
              {currentBusiness.businessType && (
                <span className="px-2 py-0.5 rounded-md text-2xs font-bold uppercase bg-stone-100 text-stone-700 border border-stone-200 shrink-0">
                  {currentBusiness.businessType}
                </span>
              )}
              <VerificationBadge status={currentBusiness.verificationStatus} />
              <PlanBadge plan={currentBusiness.plan} />
              {currentBusiness.sponsoredListingEnabled && (
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/30 flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                  <span>Sponsored</span>
                </span>
              )}

              <button
                onClick={() => onNavigate(`/businesses/${currentBusiness.id}`)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors shrink-0 ml-auto md:ml-2 cursor-pointer"
              >
                <span>Public View</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Module Bar (Does NOT push content down) */}
      <div className="md:hidden bg-white border-b border-stone-200 px-4 py-2 sticky top-16 z-30 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#CCFBF1] text-[#0F766E] font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0F766E]' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard Layout: Desktop Sidebar + Content Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col md:flex-row gap-6 items-start">
        {/* Desktop Sidebar Nav */}
        <aside className="hidden md:block w-60 shrink-0 sticky top-20">
          <div className="bg-white rounded-xl border border-stone-200 p-2 shadow-2xs space-y-1">
            <div className="px-3 py-2 text-2xs font-bold text-stone-400 uppercase tracking-wider">
              Management Modules
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`dashboard-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#CCFBF1] text-[#0F766E] font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F766E]' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-2xs px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#CCFBF1] text-[#0F766E]'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Platform Fee Reminder */}
          <div className="mt-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-2xs text-stone-600 leading-relaxed">
            <span className="font-semibold text-[#0F766E]">Platform Handling Fee:</span> 5% fee is calculated and deducted on confirmed customer transactions.
          </div>
        </aside>

        {/* Dynamic Content Workspace */}
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>

      {/* Onboard New Business Modal */}
      <Modal
        isOpen={isNewBizModalOpen}
        onClose={() => setIsNewBizModalOpen(false)}
        title="Onboard New Business Entity"
      >
        <form onSubmit={handleCreateBusiness} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Business Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Velocity Badminton Arena"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white"
              >
                <option value="Sports">Sports</option>
                <option value="Fitness">Fitness</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Wellness">Wellness</option>
                <option value="Salon">Salon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Sub-Category</label>
              <input
                type="text"
                placeholder="e.g. Badminton / Turf / Gym"
                value={newSubCategory}
                onChange={e => setNewSubCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">City Location</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone</label>
              <input
                type="tel"
                placeholder="e.g. +91 98860 11223"
                value={newContact}
                onChange={e => setNewContact(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Short Description</label>
            <textarea
              rows={2}
              placeholder="Brief description of facilities, courts, services..."
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewBizModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingBiz}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
            >
              {creatingBiz ? 'Creating...' : 'Create Business'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
