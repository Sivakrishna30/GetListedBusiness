import React from 'react';
import { Logo } from './Logo.tsx';
import { LayoutDashboard, Compass, Sparkles, Building2, Calendar, Search, UserCircle2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  selectedBusinessId?: string;
  businessName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  selectedBusinessId,
  businessName,
}) => {
  const isDashboard = currentPath.startsWith('/dashboard');
  const { user, openAuthModal } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('/')}
            className="flex items-center text-left focus:outline-none"
          >
            <Logo size="md" />
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-600">
            <button
              id="nav-link-home"
              onClick={() => onNavigate('/')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentPath === '/' ? 'text-teal-700 bg-teal-50/80 font-semibold' : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>
            <button
              id="nav-link-explore"
              onClick={() => onNavigate('/businesses')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentPath.startsWith('/businesses') || currentPath.startsWith('/search')
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4 text-teal-700" />
              <span>Discover Businesses</span>
            </button>
            <button
              id="nav-link-my-bookings"
              onClick={() => onNavigate('/my-bookings')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentPath.startsWith('/my-bookings')
                  ? 'text-teal-700 bg-teal-50/80 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-700" />
              <span>My Bookings</span>
            </button>
            <button
              id="nav-link-pricing"
              onClick={() => onNavigate('/#pricing')}
              className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right CTA / Switcher */}
        <div className="flex items-center gap-2.5">
          {isDashboard ? (
            <button
              id="nav-view-customer-site"
              onClick={() => onNavigate('/businesses')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors"
            >
              <Compass className="w-4 h-4 text-teal-700" />
              <span>Customer Discovery</span>
            </button>
          ) : (
            <>
              <button
                id="nav-btn-explore-mobile"
                onClick={() => onNavigate('/businesses')}
                className="md:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200"
              >
                <Compass className="w-3.5 h-3.5 text-teal-700" />
                <span>Discover</span>
              </button>

              <button
                id="nav-btn-my-bookings-header"
                onClick={() => onNavigate('/my-bookings')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentPath.startsWith('/my-bookings')
                    ? 'text-teal-800 bg-teal-100 border border-teal-200'
                    : 'text-stone-700 bg-stone-100 hover:bg-stone-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                <span>My Bookings</span>
              </button>

              <button
                id="nav-enter-dashboard"
                onClick={() => onNavigate('/dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 shadow-2xs transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Business Portal</span>
                <span className="sm:hidden">Portal</span>
              </button>
            </>
          )}

          {/* User Account / Login Button */}
          <button
            id="nav-user-auth-btn"
            onClick={openAuthModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
            title={user ? `Signed in as ${user.email}` : 'Sign In with Email & Password'}
          >
            {user ? (
              <>
                <div className="w-4 h-4 rounded-full bg-teal-700 text-white flex items-center justify-center text-3xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold">{user.name.split(' ')[0]}</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-stone-500" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {selectedBusinessId && isDashboard && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-stone-200">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-medium text-stone-700 truncate max-w-[150px]">
                {businessName || 'Business'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
