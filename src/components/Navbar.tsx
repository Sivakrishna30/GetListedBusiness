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
  UserCheck,
  Palette,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useBrandTheme } from '../context/BrandThemeContext.tsx';

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
  const { theme, tokens, toggleTheme } = useBrandTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = currentPath.startsWith('/dashboard');
  const isBrandPreview = currentPath === '/brand-preview' || currentPath.startsWith('/brand');

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
            className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
            aria-label="GetListed Home"
          >
            <Logo size="sm" variant="horizontal" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-stone-600">
            <button
              id="nav-link-home"
              onClick={() => handleNav('/')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPath === '/'
                  ? 'font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
              style={
                currentPath === '/'
                  ? { backgroundColor: tokens.primaryLight, color: tokens.primary }
                  : undefined
              }
            >
              Home
            </button>
            <button
              id="nav-link-explore"
              onClick={() => handleNav('/businesses')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPath.startsWith('/businesses') || currentPath.startsWith('/search')
                  ? 'font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
              style={
                currentPath.startsWith('/businesses') || currentPath.startsWith('/search')
                  ? { backgroundColor: tokens.primaryLight, color: tokens.primary }
                  : undefined
              }
            >
              <Compass className="w-4 h-4" style={{ color: tokens.primary }} />
              <span>Discover Businesses</span>
            </button>
            <button
              id="nav-link-capabilities"
              onClick={() => handleNav('/#capabilities')}
              className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Business Capabilities
            </button>
            <button
              id="nav-link-my-bookings"
              onClick={() => handleNav('/my-bookings')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentPath.startsWith('/my-bookings')
                  ? 'font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100'
              }`}
              style={
                currentPath.startsWith('/my-bookings')
                  ? { backgroundColor: tokens.primaryLight, color: tokens.primary }
                  : undefined
              }
            >
              <Calendar className="w-4 h-4" style={{ color: tokens.primary }} />
              <span>My Bookings</span>
            </button>
            <button
              id="nav-link-pricing"
              onClick={() => handleNav('/#pricing')}
              className="px-3 py-1.5 rounded-lg hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right CTA / Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick theme switcher button */}
          <button
            onClick={toggleTheme}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'theme-b' ? 'Turquoise (Theme A)' : 'Royal Blue + Coral (Theme B)'}`}
          >
            <div className="flex items-center -space-x-1">
              <span
                className="w-2.5 h-2.5 rounded-full border border-white"
                style={{ backgroundColor: tokens.primary }}
              ></span>
              {theme === 'theme-b' && (
                <span
                  className="w-2.5 h-2.5 rounded-full border border-white"
                  style={{ backgroundColor: '#F97371' }}
                ></span>
              )}
            </div>
            <span className="hidden xl:inline">{theme === 'theme-b' ? 'Royal+Coral' : 'Turquoise'}</span>
          </button>

          {/* Desktop specific buttons */}
          {isDashboard ? (
            <button
              id="nav-view-customer-site"
              onClick={() => handleNav('/businesses')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              style={{
                backgroundColor: tokens.primarySubtle,
                color: tokens.primary,
                border: `1px solid ${tokens.primaryLight}`,
              }}
            >
              <Compass className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
              <span>Customer Discovery</span>
            </button>
          ) : (
            <>
              <button
                id="nav-btn-my-bookings-header"
                onClick={() => handleNav('/my-bookings')}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  currentPath.startsWith('/my-bookings')
                    ? 'border'
                    : 'text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200'
                }`}
                style={
                  currentPath.startsWith('/my-bookings')
                    ? {
                        backgroundColor: tokens.primaryLight,
                        color: tokens.primary,
                        borderColor: `${tokens.primary}40`,
                      }
                    : undefined
                }
              >
                <Calendar className="w-3.5 h-3.5" style={{ color: tokens.primary }} />
                <span>My Bookings</span>
              </button>

              <button
                id="nav-enter-dashboard"
                onClick={() => handleNav('/dashboard')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-2xs transition-all hover:opacity-95 cursor-pointer"
                style={{ backgroundColor: tokens.primary }}
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
                <div
                  className="w-5 h-5 rounded-full text-white flex items-center justify-center text-3xs font-bold shrink-0"
                  style={{ backgroundColor: tokens.primary }}
                >
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
              <Building2 className="w-4 h-4 shrink-0" style={{ color: tokens.primary }} />
              <span className="text-xs font-medium text-stone-700 truncate max-w-[140px]">
                {businessName || 'Business'}
              </span>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            id="nav-mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
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
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentPath === '/' ? 'font-semibold' : 'text-stone-700 hover:bg-stone-100'
            }`}
            style={
              currentPath === '/'
                ? { backgroundColor: tokens.primaryLight, color: tokens.primary }
                : undefined
            }
          >
            Home
          </button>

          <button
            onClick={() => handleNav('/businesses')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentPath.startsWith('/businesses')
                ? 'font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
            style={
              currentPath.startsWith('/businesses')
                ? { backgroundColor: tokens.primaryLight, color: tokens.primary }
                : undefined
            }
          >
            <Compass className="w-4 h-4" style={{ color: tokens.primary }} />
            <span>Discover Businesses</span>
          </button>

          <button
            onClick={() => handleNav('/my-bookings')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              currentPath.startsWith('/my-bookings')
                ? 'font-semibold'
                : 'text-stone-700 hover:bg-stone-100'
            }`}
            style={
              currentPath.startsWith('/my-bookings')
                ? { backgroundColor: tokens.primaryLight, color: tokens.primary }
                : undefined
            }
          >
            <Calendar className="w-4 h-4" style={{ color: tokens.primary }} />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => handleNav('/#capabilities')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Business Capabilities
          </button>

          <button
            onClick={() => handleNav('/#pricing')}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
          >
            Pricing
          </button>

          <div className="pt-2 border-t border-stone-200 space-y-2">
            <button
              onClick={() => handleNav('/dashboard')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white shadow-2xs transition-colors cursor-pointer"
              style={{ backgroundColor: tokens.primary }}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Business Management Portal</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors cursor-pointer"
            >
              {user ? (
                <>
                  <UserCheck className="w-4 h-4" style={{ color: tokens.primary }} />
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
