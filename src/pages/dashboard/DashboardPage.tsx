import React, { useState } from 'react';
import { DashboardLayout } from './DashboardLayout.tsx';
import { OverviewView } from './OverviewView.tsx';
import { ProfileView } from './ProfileView.tsx';
import { ServicesView } from './ServicesView.tsx';
import { ProductsView } from './ProductsView.tsx';
import { PackagesView } from './PackagesView.tsx';
import { BookingsView } from './BookingsView.tsx';
import { MembershipsView } from './MembershipsView.tsx';
import { EventsView } from './EventsView.tsx';
import { CustomersView } from './CustomersView.tsx';
import { ReportsView } from './ReportsView.tsx';
import { SettingsView } from './SettingsView.tsx';
import { TransactionsView } from './TransactionsView.tsx';
import { ExpensesView } from './ExpensesView.tsx';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
  initialBusinessId?: string;
  initialTab?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  initialBusinessId = 'biz_greenpark_turf',
  initialTab = 'overview',
}) => {
  const [selectedBusinessId, setSelectedBusinessId] = useState(initialBusinessId);
  const [currentTab, setCurrentTab] = useState(initialTab);

  return (
    <DashboardLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      selectedBusinessId={selectedBusinessId}
      onSelectBusinessId={setSelectedBusinessId}
      onNavigate={onNavigate}
    >
      {currentTab === 'overview' && (
        <OverviewView businessId={selectedBusinessId} onSelectTab={setCurrentTab} />
      )}
      {currentTab === 'profile' && <ProfileView businessId={selectedBusinessId} />}
      {currentTab === 'services' && <ServicesView businessId={selectedBusinessId} />}
      {currentTab === 'products' && <ProductsView businessId={selectedBusinessId} />}
      {currentTab === 'packages' && <PackagesView businessId={selectedBusinessId} />}
      {currentTab === 'bookings' && <BookingsView businessId={selectedBusinessId} />}
      {currentTab === 'transactions' && <TransactionsView businessId={selectedBusinessId} />}
      {currentTab === 'expenses' && <ExpensesView businessId={selectedBusinessId} />}
      {currentTab === 'memberships' && <MembershipsView businessId={selectedBusinessId} />}
      {currentTab === 'events' && <EventsView businessId={selectedBusinessId} />}
      {currentTab === 'customers' && <CustomersView businessId={selectedBusinessId} />}
      {currentTab === 'reports' && <ReportsView businessId={selectedBusinessId} />}
      {currentTab === 'settings' && <SettingsView businessId={selectedBusinessId} />}
    </DashboardLayout>
  );
};
