import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Membership, MembershipEnrollment } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import { Plus, Users, Calendar, Phone, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface MembershipsViewProps {
  businessId: string;
}

export const MembershipsView: React.FC<MembershipsViewProps> = ({ businessId }) => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [enrollments, setEnrollments] = useState<MembershipEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Plan Modal
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(3500);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [benefitsText, setBenefitsText] = useState('Unlimited access during peak hours\nLocker & towel service\n10% off sports gear');
  const [submittingPlan, setSubmittingPlan] = useState(false);

  // Enrollment Modal
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [submittingEnroll, setSubmittingEnroll] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mems, enrs] = await Promise.all([
        api.listMemberships(businessId),
        api.listEnrollments(businessId),
      ]);
      setMemberships(mems);
      setEnrollments(enrs);
      if (mems.length > 0 && !selectedPlanId) {
        setSelectedPlanId(mems[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load memberships data:', err);
      setErrorMessage(err.message || 'Failed to load memberships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [businessId]);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const benefits = benefitsText
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean);

    try {
      setSubmittingPlan(true);
      await api.createMembership(businessId, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        durationDays: Number(durationDays),
        benefits,
      });
      setIsPlanModalOpen(false);
      await fetchData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create plan');
    } finally {
      setSubmittingPlan(false);
    }
  };

  const handleEnrollMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId || !custName.trim() || !custPhone.trim()) return;

    try {
      setSubmittingEnroll(true);
      await api.enrollMembership(businessId, {
        membershipId: selectedPlanId,
        customerName: custName.trim(),
        customerPhone: custPhone.trim(),
      });
      setIsEnrollModalOpen(false);
      setCustName('');
      setCustPhone('');
      await fetchData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to enroll member');
    } finally {
      setSubmittingEnroll(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-[#2563EB] animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading memberships...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {errorMessage && (
        <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-stone-500 hover:text-stone-700">✕</button>
        </div>
      )}

      {/* Plans Section */}
      <div className="space-y-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Membership Plans</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Recurring subscription plans and privilege packages for long-term clients.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto shrink-0">
            <button
              onClick={() => setIsEnrollModalOpen(true)}
              disabled={memberships.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE]/50 border border-[#2563EB]/30 disabled:opacity-50 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Enroll Member</span>
            </button>

            <button
              onClick={() => {
                setName('');
                setDescription('');
                setPrice(3500);
                setDurationDays(30);
                setBenefitsText('Unlimited morning access\nLocker facility\nPriority court booking');
                setIsPlanModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Plan</span>
            </button>
          </div>
        </div>

        {memberships.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-stone-200 text-center max-w-md mx-auto">
            <Users className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-800">No membership tiers configured</p>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              Offer monthly, quarterly, or annual passes to regular customers.
            </p>
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/30 hover:bg-[#DBEAFE]/50"
            >
              Create First Tier
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberships.map(mem => (
              <div
                key={mem.id}
                className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-stone-900 text-base truncate">{mem.name}</h3>
                    <span className="text-base font-extrabold text-stone-900 shrink-0">₹{mem.price}</span>
                  </div>
                  <div className="text-2xs font-semibold text-stone-500 mb-3">
                    Duration: {mem.durationDays} Days
                  </div>
                  <p className="text-xs text-stone-600 mb-4 leading-relaxed line-clamp-2">{mem.description}</p>

                  <div className="space-y-1.5 mb-4">
                    {mem.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-2xs text-stone-400">
                  <span className="font-mono">ID: {mem.id.slice(-6)}</span>
                  <span className="font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#2563EB]/30">Active Tier</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enrollments Log */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Active Member Enrollments</h3>
            <p className="text-2xs text-stone-500">Record of customers with active pass privileges</p>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB]/30">
            {enrollments.length} Active Members
          </span>
        </div>

        {enrollments.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500">
            No member enrollments recorded yet. Enroll a member using the button above.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 text-xs">
            {enrollments.map(enr => (
              <div key={enr.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-stone-900 text-sm">{enr.customerName}</span>
                    <span className="px-2 py-0.5 rounded text-2xs font-semibold bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30">
                      {enr.status}
                    </span>
                  </div>
                  <div className="text-stone-600 flex flex-wrap items-center gap-2 sm:gap-3 text-2xs">
                    <span className="font-medium text-[#2563EB]">{enr.membershipName}</span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      {enr.customerPhone}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-stone-400" />
                      Valid until {enr.endDate}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-2xs text-stone-400 font-mono">#{enr.id.slice(-6)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Plan Modal */}
      <Modal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        title="Create Membership Plan"
      >
        <form onSubmit={handleCreatePlan} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Plan Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly All-Access Pass"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Fee (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                required
                min={1}
                value={durationDays}
                onChange={e => setDurationDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Member Benefits (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="Unlimited access during peak hours&#10;Locker & towel service&#10;10% off sports gear"
              value={benefitsText}
              onChange={e => setBenefitsText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Plan Description</label>
            <textarea
              rows={2}
              placeholder="Eligibility and terms..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingPlan}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors shadow-2xs"
            >
              {submittingPlan ? 'Saving...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Enroll Member Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll Customer into Membership"
      >
        <form onSubmit={handleEnrollMember} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Select Membership Plan *</label>
            <select
              value={selectedPlanId}
              onChange={e => setSelectedPlanId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
            >
              {memberships.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} (₹{m.price} for {m.durationDays} days)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Customer Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Varun Reddy"
                value={custName}
                onChange={e => setCustName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+91..."
                value={custPhone}
                onChange={e => setCustPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEnrollModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingEnroll}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors shadow-2xs"
            >
              {submittingEnroll ? 'Enrolling...' : 'Confirm Enrollment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
