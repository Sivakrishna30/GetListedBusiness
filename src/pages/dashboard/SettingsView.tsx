import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Business, BusinessPlan, VerificationStatus, Notification } from '../../../shared/types.ts';
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [biz, notifs] = await Promise.all([
        api.getBusiness(businessId),
        api.listNotifications(businessId),
      ]);
      setBusiness(biz);
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
        <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900">Settings & Monetization Controls</h2>
          <p className="text-xs text-stone-500">
            Configure subscription tiers, verification credentials, and sponsored listing visibility.
          </p>
        </div>

        {feedback && (
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Subscription Plan Card */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
              Subscription Plan Tier
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Pro plan unlocks CRM, team delegation, customer notes, and deep revenue analytics.
            </p>
          </div>
          <PlanBadge plan={business.plan} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Free Tier */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              business.plan === 'FREE'
                ? 'border-teal-700 bg-teal-50/20 ring-1 ring-teal-700'
                : 'border-stone-200 bg-stone-50/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-stone-900">GetListed Starter</span>
              <span className="text-xs font-bold text-stone-500">Free Forever</span>
            </div>
            <p className="text-xs text-stone-600 mb-4">
              Basic discovery profile, services catalogue, booking slots, and 5% fee transaction handling.
            </p>
            <button
              type="button"
              disabled={business.plan === 'FREE' || updating}
              onClick={() => handlePlanToggle('FREE')}
              className="w-full py-2 rounded-lg text-xs font-semibold border border-stone-300 bg-white hover:bg-stone-50 disabled:opacity-50 text-stone-700 transition-colors"
            >
              {business.plan === 'FREE' ? 'Current Plan' : 'Downgrade to Starter'}
            </button>
          </div>

          {/* Pro Tier */}
          <div
            className={`p-5 rounded-xl border transition-all ${
              business.plan === 'PRO'
                ? 'border-teal-700 bg-teal-50/30 ring-2 ring-teal-700'
                : 'border-teal-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-stone-900">GetListed Pro</span>
                <span className="px-1.5 py-0.5 rounded text-2xs font-extrabold bg-teal-700 text-white uppercase tracking-wider">
                  Pro
                </span>
              </div>
              <span className="text-xs font-bold text-teal-800">₹999 / month</span>
            </div>
            <p className="text-xs text-stone-600 mb-4">
              Everything in Starter plus Customer CRM directory, Team roles, and Financial Insights.
            </p>
            <button
              type="button"
              disabled={business.plan === 'PRO' || updating}
              onClick={() => handlePlanToggle('PRO')}
              className="w-full py-2 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white transition-colors shadow-2xs"
            >
              {business.plan === 'PRO' ? 'Current Plan (Active)' : 'Upgrade to Pro'}
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
          <p className="text-xs text-stone-500">
            Verified businesses receive a trust badge in search and priority customer trust.
          </p>

          <div className="flex items-center gap-2 pt-2">
            {(['UNVERIFIED', 'PENDING', 'VERIFIED'] as VerificationStatus[]).map(status => (
              <button
                key={status}
                type="button"
                disabled={updating}
                onClick={() => handleVerificationChange(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  business.verificationStatus === status
                    ? 'bg-teal-700 text-white border-teal-700'
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
          <p className="text-xs text-stone-500">
            Showcase this business with a "Sponsored" highlight badge at the top of local search.
          </p>

          <button
            type="button"
            disabled={updating}
            onClick={handleSponsoredToggle}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              business.sponsoredListingEnabled
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
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
            <Bell className="w-4 h-4 text-teal-700" />
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
