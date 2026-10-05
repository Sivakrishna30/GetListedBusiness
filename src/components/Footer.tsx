import React from 'react';
import { Logo } from './Logo.tsx';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" variant="dark" />
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              GetListed is a business-focused local discovery and business management platform.
              Helping businesses create their presence, configure offerings, manage bookings & memberships,
              and connect with customers.
            </p>
            <div className="p-3 bg-stone-800/80 rounded-lg text-xs text-stone-300 border border-stone-700 max-w-md">
              <span className="font-semibold text-[#5eead4]">Platform Handling Fee:</span> A 5% platform handling fee applies to eligible bookings and orders made through GetListed.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/businesses')}
                  className="hover:text-[#5eead4] transition-colors"
                >
                  Discover Businesses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/#pricing')}
                  className="hover:text-[#5eead4] transition-colors"
                >
                  Pricing Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/#faq')}
                  className="hover:text-[#5eead4] transition-colors"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-stone-200 uppercase tracking-wider mb-3">For Businesses</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="hover:text-[#5eead4] transition-colors"
                >
                  Business Management Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/dashboard/services')}
                  className="hover:text-[#5eead4] transition-colors"
                >
                  Configure Services & Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/dashboard/reports')}
                  className="hover:text-[#5eead4] transition-colors"
                >
                  Revenue & Reports
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} GetListed. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Built for Indian Local Businesses</span>
            <span>•</span>
            <span>Business Operating System</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
