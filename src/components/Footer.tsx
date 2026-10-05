import React from 'react';
import { Logo } from './Logo.tsx';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 py-10 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-3">
          <Logo size="md" variant="horizontal" themeMode="white" />
          <p className="text-xs font-semibold uppercase tracking-wider text-[#F97371]">
            Bring Your Business to the World
          </p>
          <p className="text-sm text-stone-400 max-w-xl leading-relaxed">
            GetListed helps businesses create their presence, configure operations, manage services and bookings, manage customers, and track performance.
          </p>
        </div>

        <div className="pt-6 border-t border-stone-800 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} GetListed — Bring Your Business to the World. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
