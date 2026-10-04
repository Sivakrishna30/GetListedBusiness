import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { DiscoveryPage } from './pages/DiscoveryPage.tsx';
import { BusinessDetailPage } from './pages/BusinessDetailPage.tsx';
import { BookingFlowPage } from './pages/BookingFlowPage.tsx';
import { DashboardPage } from './pages/dashboard/DashboardPage.tsx';
import { CustomerBookingsPage } from './pages/CustomerBookingsPage.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { AuthModal } from './components/AuthModal.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route Parser
  const renderRoute = () => {
    const url = new URL(currentPath, 'http://localhost');
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // 1. Booking Flow:
    // Support: /book/:businessId/:serviceId, /book/:businessId, /businesses/:businessId/book
    if (pathname.startsWith('/book/')) {
      const parts = pathname.split('/').filter(Boolean);
      const businessId = parts[1];
      const serviceId = parts[2] || searchParams.get('serviceId') || undefined;
      if (businessId) {
        return (
          <BookingFlowPage
            businessId={businessId}
            preselectedServiceId={serviceId}
            onNavigate={navigate}
          />
        );
      }
    }

    if (pathname.startsWith('/businesses/') && pathname.includes('/book')) {
      const parts = pathname.split('/').filter(Boolean);
      const businessId = parts[1];
      const serviceId = searchParams.get('serviceId') || undefined;
      if (businessId) {
        return (
          <BookingFlowPage
            businessId={businessId}
            preselectedServiceId={serviceId}
            onNavigate={navigate}
          />
        );
      }
    }

    // 2. Business Public Detail: /businesses/:id
    if (pathname.startsWith('/businesses/')) {
      const parts = pathname.split('/').filter(Boolean);
      const businessId = parts[1];
      if (businessId && businessId !== 'book' && businessId !== 'search') {
        return <BusinessDetailPage businessId={businessId} onNavigate={navigate} />;
      }
    }

    // 3. Search / Discovery: /businesses, /search, /explore
    if (
      pathname === '/businesses' ||
      pathname === '/businesses/' ||
      pathname.startsWith('/search') ||
      pathname.startsWith('/explore')
    ) {
      return <DiscoveryPage onNavigate={navigate} />;
    }

    // 4. Customer Bookings: /my-bookings
    if (pathname.startsWith('/my-bookings')) {
      return <CustomerBookingsPage onNavigate={navigate} />;
    }

    // 5. Business Management Dashboard: /dashboard
    if (pathname.startsWith('/dashboard')) {
      return <DashboardPage onNavigate={navigate} />;
    }

    // 6. Default: Landing Home
    return <LandingPage onNavigate={navigate} />;
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
        <Navbar currentPath={currentPath} onNavigate={navigate} />
        <main className="flex-1">{renderRoute()}</main>
        <Footer onNavigate={navigate} />
        <AuthModal />
      </div>
    </AuthProvider>
  );
}
