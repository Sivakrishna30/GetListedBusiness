import React, { useState } from 'react';
import { Logo } from './Logo.tsx';
import {
  LayoutDashboard,
  Compass,
  Calendar,
  Building2,
  LogIn,
  Menu,
  X,
  CreditCard,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  businessName?: string;
  selectedBusinessId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  businessName,
  selectedBusinessId,
}) => {
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = currentPath.startsWith('/dashboard');

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-stone-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 sm:gap-8 min-w-0">
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
            aria-label="GetListed Home"
          >
            <Logo size="sm" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-stone-600">
            <button
              id="nav-link-home"
              onClick={() => handleNav('/')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                currentPath === '/'
                  ? 'text-[#0F766E] bg-[#CCFBF1] font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>
            <button
              id="nav-link-explore"
              onClick={() => handleNav('/businesses')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentPath.startsWith('/businesses') || currentPath.startsWith('/search')
                  ? 'text-[#0F766E] bg-[#CCFBF1] font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-4 h-4 text-[#0F766E]" />
              <span>Discover Businesses</span>
            </button>
            <button
              id="nav-link-my-bookings"
              onClick={() => handleNav('/my-bookings')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                currentPath.startsWith('/my-bookings')
                  ? 'text-[#0F766E] bg-[#CCFBF1] font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#0F766E]" />
              <span>My Bookings</span>
            </button>
            <button
              id="nav-link-pricing"
              onClick={() => handleNav('/#pricing')}
              className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right CTA / Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Desktop specific buttons */}
          {isDashboard ? (
            <button
              id="nav-view-customer-site"
              onClick={() => handleNav('/businesses')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1]/50 border border-[#0F766E]/30 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Customer Discovery</span>
            </button>
          ) : (
            <>
              <button
                id="nav-btn-my-bookings-header"
                onClick={() => handleNav('/my-bookings')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentPath.startsWith('/my-bookings')
                    ? 'text-[#0F766E] bg-[#CCFBF1] border border-[#0F766E]/30'
                    : 'text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>My Bookings</span>
              </button>

              <button
                id="nav-enter-dashboard"
                onClick={() => handleNav('/dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-2xs transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Business Portal</span>
              </button>
            </>
          )}

          {/* User Account / Login Button */}
          <button
            id="nav-user-auth-btn"
            onClick={openAuthModal}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
            title={user ? `Signed in as ${user.email}` : 'Sign In with Email & Password'}
          >
            {user ? (
              <>
                <div className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-3xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold truncate max-w-[90px]">
                  {user.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Sign In</span>
              </>
            )}
          </button>

          {/* Business Label on desktop */}
          {selectedBusinessId && isDashboard && (
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-stone-200">
              <Building2 className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span className="text-xs font-medium text-stone-700 truncate max-w-[140px]">
                {businessName || 'Business'}
              </span>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="nav-mobile-drawer"
          className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2"
        >
          <button
            onClick={() => handleNav('/')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPath === '/' ? 'text-[#0F766E] bg-[#CCFBF1] font-semibold' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('/businesses')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPath.startsWith('/businesses')
                ? 'text-[#0F766E] bg-[#CCFBF1] font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Compass className="w-4 h-4 text-[#0F766E]" />
            <span>Discover Businesses</span>
          </button>

          <button
            onClick={() => handleNav('/my-bookings')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPath.startsWith('/my-bookings')
                ? 'text-[#0F766E] bg-[#CCFBF1] font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#0F766E]" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => handleNav('/#pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Pricing Plans
          </button>

          <div className="pt-2 border-t border-stone-200 space-y-2">
            <button
              onClick={() => handleNav('/dashboard')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-2xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Business Management Portal</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
            >
              {user ? (
                <>
                  <UserCheck className="w-4 h-4 text-[#0F766E]" />
                  <span>Account: {user.name}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-stone-500" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
