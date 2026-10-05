import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import {
  Business,
  BusinessPlan,
  VerificationStatus,
  Notification,
  BusinessType,
  Operation,
} from '../../../shared/types.ts';
import { PlanBadge, VerificationBadge } from '../../components/Badge.tsx';
import {
  Settings,
  ShieldCheck,
  Sparkles,
  Bell,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Zap,
  Sliders,
  Layers,
  Save,
} from 'lucide-react';

interface SettingsViewProps {
  businessId: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ businessId }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Operations Configuration State
  const [bizType, setBizType] = useState<BusinessType>('GENERAL');
  const [enabledOps, setEnabledOps] = useState<Operation[]>([]);
  const [savingOps, setSavingOps] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [biz, notifs] = await Promise.all([
        api.getBusiness(businessId),
        api.listNotifications(businessId),
      ]);
      setBusiness(biz);
      setBizType(biz.businessType || 'GENERAL');
      setEnabledOps(biz.enabledOperations || ['BOOKINGS', 'SERVICES', 'TRANSACTIONS', 'EXPENSES']);
      setNotifications(notifs);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const handleToggleOperation = (op: Operation) => {
    setEnabledOps(prev =>
      prev.includes(op) ? prev.filter(o => o !== op) : [...prev, op]
    );
  };

  const handleSaveOperations = async () => {
    if (!business) return;
    try {
      setSavingOps(true);
      const updated = await api.updateOperations(business.id, {
        businessType: bizType,
        enabledOperations: enabledOps,
      });
      setBusiness(updated);
      setFeedback('Operational modules and business archetype updated successfully!');
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Failed to update operational configuration');
    } finally {
      setSavingOps(false);
    }
  };

  const handlePlanToggle = async (newPlan: BusinessPlan) => {
    if (!business) return;
    try {
      setUpdating(true);
      const updated = await api.updateBusiness(business.id, { plan: newPlan });
      setBusiness(updated);
      setFeedback(`Subscription plan updated to ${newPlan}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update plan');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerificationChange = async (newStatus: VerificationStatus) => {
    if (!business) return;
    try {
      setUpdating(true);
      const updated = await api.updateBusiness(business.id, { verificationStatus: newStatus });
      setBusiness(updated);
      setFeedback(`Verification status updated to ${newStatus}`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update verification status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSponsoredToggle = async () => {
    if (!business) return;
    try {
      setUpdating(true);
      const updated = await api.updateBusiness(business.id, {
        sponsoredListingEnabled: !business.sponsoredListingEnabled,
      });
      setBusiness(updated);
      setFeedback(
        updated.sponsoredListingEnabled
          ? 'Sponsored listing enabled! Your business now appears at top of discovery results.'
          : 'Sponsored listing disabled.'
      );
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle sponsored status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  if (!business) return null;

  const allAvailableOperations: { id: Operation; label: string; description: string }[] = [
    { id: 'BOOKINGS', label: 'Bookings & Slots', description: 'Real-time appointment slot booking with collision checks' },
    { id: 'SERVICES', label: 'Services Catalogue', description: 'Offerings with durations, pricing, and availability' },
    { id: 'PRODUCTS', label: 'Products & Merchandise', description: 'Physical equipment or merchandise inventory' },
    { id: 'PACKAGES', label: 'Combo Packages', description: 'Bundled session packs and cross-service deals' },
    { id: 'TRANSACTIONS', label: 'Financial Ledger', description: 'Real money movement records (cash, UPI, cards)' },
    { id: 'EXPENSES', label: 'Expense Management', description: 'Track rent, salaries, and operational costs' },
    { id: 'MEMBERSHIPS', label: 'Memberships & Passes', description: 'Recurring client subscription plans' },
    { id: 'EVENTS', label: 'Events & Tournaments', description: 'Competitions, workshops, and cohort programs' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">Settings & Operating Configuration</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure business archetype, active operational modules, and subscription tiers.
          </p>
        </div>

        {feedback && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Modular Operations & Business Archetype */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Operational Modules & Architecture</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Enable or disable specific modules to customize the management sidebar for your business type.
            </p>
          </div>

          <button
            onClick={handleSaveOperations}
            disabled={savingOps}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs self-start sm:self-auto shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingOps ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>

        {/* Business Archetype Selector */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            Business Archetype / Profile Type:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {(['SPORTS_TURF', 'GYM_FITNESS', 'CLINIC_HEALTHCARE', 'SALON_SPA', 'GENERAL'] as BusinessType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setBizType(t)}
                className={`p-2.5 rounded-lg border text-left font-semibold transition-all ${
                  bizType === t
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                    : 'border-stone-200 bg-stone-50/50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div>{t.replace('_', ' ')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Modular Operations Checklist */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Enabled Operational Capabilities:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allAvailableOperations.map(op => {
              const isChecked = enabledOps.includes(op.id);
              return (
                <div
                  key={op.id}
                  onClick={() => handleToggleOperation(op.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-blue-600 bg-blue-50/40 text-stone-900'
                      : 'border-stone-200 bg-white text-stone-500 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">{op.label}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-blue-600 focus:ring-blue-600"
                    />
                  </div>
                  <p className="text-2xs text-stone-500 leading-snug">{op.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subscription Plan Card */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Subscription Plan Tier
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Professional plan unlocks Customer Management, Custom & Promotional Events, and Revenue Reports.
            </p>
          </div>
          <PlanBadge plan={business.plan} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Free Tier */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              business.plan === 'FREE'
                ? 'border-blue-600 bg-blue-50/20 ring-1 ring-blue-600'
                : 'border-stone-200 bg-stone-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-stone-900">GetListed Starter</span>
              <span className="text-xs font-bold text-stone-500">Free</span>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Business profile, operations configuration, bookings & availability, and booking customer details with 2% platform handling fee.
            </p>
            <button
              type="button"
              disabled={business.plan === 'FREE' || updating}
              onClick={() => handlePlanToggle('FREE')}
              className="w-full py-2 rounded-lg text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-50 text-stone-700 transition-colors"
            >
              {business.plan === 'FREE' ? 'Current Plan (Active)' : 'Downgrade to Starter'}
            </button>
          </div>

          {/* Pro Tier */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              business.plan === 'PRO'
                ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-600'
                : 'border-blue-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-stone-900">GetListed Professional</span>
                <span className="px-1.5 py-0.5 rounded text-2xs font-extrabold bg-blue-600 text-white uppercase tracking-wider">
                  Advanced
                </span>
              </div>
              <span className="text-xs font-bold text-blue-700">₹999 / month</span>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Everything in Starter, plus Customer Management, Custom & Promotional Events, and Revenue Reports.
            </p>
            <button
              type="button"
              disabled={business.plan === 'PRO' || updating}
              onClick={() => handlePlanToggle('PRO')}
              className="w-full py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors shadow-2xs"
            >
              {business.plan === 'PRO' ? 'Current Plan (Active)' : 'Upgrade to Professional'}
            </button>
          </div>
        </div>
      </div>

      {/* Verification & Sponsored Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Status */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Verification Status
            </h3>
            <VerificationBadge status={business.verificationStatus} />
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Verified businesses receive a trust badge in search and priority customer trust.
          </p>

          <div className="flex items-center gap-2 pt-2 flex-wrap">
            {(['UNVERIFIED', 'PENDING', 'VERIFIED'] as VerificationStatus[]).map(status => (
              <button
                key={status}
                type="button"
                disabled={updating}
                onClick={() => handleVerificationChange(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  business.verificationStatus === status
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Sponsored Listing */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Sponsored Listing
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-2xs font-semibold ${
                business.sponsoredListingEnabled
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-stone-100 text-stone-500'
              }`}
            >
              {business.sponsoredListingEnabled ? 'Active' : 'Disabled'}
            </span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Showcase this business with a "Sponsored" highlight badge at the top of local search.
          </p>

          <button
            type="button"
            disabled={updating}
            onClick={handleSponsoredToggle}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              business.sponsoredListingEnabled
                ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                : 'bg-amber-600 text-white hover:bg-amber-700 shadow-2xs'
            }`}
          >
            {business.sponsoredListingEnabled ? 'Disable Sponsored Badge' : 'Enable Sponsored Listing'}
          </button>
        </div>
      </div>

      {/* Audit Log / Notifications Feed */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-stone-900">Operational Notifications & Audit Log</h3>
          </div>
          <span className="text-2xs text-stone-500">{notifications.length} events logged</span>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            No system notifications or audit entries recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto text-xs">
            {notifications.map(n => (
              <div key={n.id} className="p-3.5 flex items-start justify-between gap-3 hover:bg-stone-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-stone-800">{n.title}</span>
                    <span className="text-2xs font-semibold px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 uppercase">
                      {n.type}
                    </span>
                  </div>
                  <p className="text-stone-600 text-xs">{n.message}</p>
                </div>
                <span className="text-2xs text-stone-400 shrink-0 whitespace-nowrap">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
