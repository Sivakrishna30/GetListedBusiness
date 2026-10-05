import React from 'react';
import { ShieldCheck, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { VerificationStatus, BusinessPlan, BookingStatus } from '../../shared/types.ts';

export const VerificationBadge: React.FC<{ status: VerificationStatus; showText?: boolean }> = ({
  status,
  showText = true,
}) => {
  if (status === 'VERIFIED') {
    return (
      <span
        id="badge-verified"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
        {showText && <span>Verified</span>}
      </span>
    );
  }

  if (status === 'PENDING') {
    return (
      <span
        id="badge-verification-pending"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200"
      >
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        {showText && <span>Verification Pending</span>}
      </span>
    );
  }

  return (
    <span
      id="badge-unverified"
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200"
    >
      <AlertCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />
      {showText && <span>Unverified</span>}
    </span>
  );
};

export const PlanBadge: React.FC<{ plan: BusinessPlan }> = ({ plan }) => {
  if (plan === 'PRO') {
    return (
      <span
        id="badge-plan-pro"
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-teal-800 text-white tracking-wide uppercase"
      >
        <Sparkles className="w-3 h-3 text-teal-200 shrink-0" />
        Pro
      </span>
    );
  }
  return (
    <span
      id="badge-plan-free"
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200 uppercase"
    >
      Free
    </span>
  );
};

export const BookingStatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const styles: Record<BookingStatus, string> = {
    CONFIRMED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-teal-50 text-teal-800 border-teal-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${styles[status]}`}
    >
      {status}
    </span>
  );
};
