import React, { useState } from 'react';
import {
  Building2,
  Sliders,
  Users,
  BarChart3,
  ChevronDown,
  ArrowRight,
  Check,
  Calendar,
  Package,
  Layers,
  Search,
  Compass,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: '1. What is GetListed?',
      a: 'GetListed is a business-focused local discovery and business management platform that enables businesses to manage profiles, offerings, bookings, memberships, and customer interactions, while allowing customers to discover businesses and book services.',
    },
    {
      q: '2. Who can list a business on GetListed?',
      a: 'Any local business providing services, products, bookings, memberships, or events can list on GetListed. This includes sports turfs, fitness centres, clinics, hospitals, yoga studios, aquatic centres, salons, and more.',
    },
    {
      q: '3. Is listing a business free?',
      a: 'Yes. GetListed Free includes full business profile management, service and product listings, packages, bookings and availability, membership management, events, and customer reviews.',
    },
    {
      q: '4. What can I manage on GetListed?',
      a: 'You can manage your business profile, operating hours, photos, amenities, services, products, combo packages, time slot availability, customer bookings, memberships, events, customer relationship logs, and team members.',
    },
    {
      q: '5. How can customers discover my business?',
      a: 'Customers can discover your business through the GetListed public discovery portal by searching by business name, category, sub-category, or location.',
    },
    {
      q: '6. How do bookings and orders work?',
      a: 'Customers select an available service, pick a date and start time slot, provide their contact information, and confirm their booking. The platform checks slot availability in real time and updates the business dashboard instantly.',
    },
    {
      q: '7. What is the 5% platform handling fee?',
      a: 'A 5% platform handling fee applies per eligible booking or order made through GetListed. For example, on a ₹600 booking, the platform handling fee is ₹30, leaving a net business amount of ₹570.',
    },
    {
      q: '8. What does GetListed Pro include?',
      a: 'GetListed Pro includes Customer Relationship Data, Revenue & Performance Reports, Team Management, WhatsApp & SMS Notifications architecture, Verified Business status badge, and Sponsored Listing Preference.',
    },
    {
      q: '9. Can I upgrade from Free to Pro?',
      a: 'Yes. You can upgrade your plan or switch between Free and Pro at any time directly from your business settings within the dashboard.',
    },
    {
      q: '10. What is a Verified Business?',
      a: 'A Verified Business receives an official verification badge on their profile and in customer discovery listings, signaling verified authenticity and location details to customers.',
    },
    {
      q: '11. What is Sponsored Listing Preference?',
      a: 'Sponsored Listing Preference is a Pro configuration that gives businesses highlighted visibility and priority placement in customer discovery searches.',
    },
    {
      q: '12. How do customer reviews and ratings work?',
      a: 'Customers can leave 1-to-5 star ratings and written reviews on a business page. Reviews are visible to prospective customers and factored into the business profile.',
    },
    {
      q: '13. How do WhatsApp and SMS notifications work?',
      a: 'The notification system records confirmation and update messages for bookings, memberships, and events. For businesses with active gateway integration, messages are queued; unconfigured channels are displayed as pending-configuration rather than simulated.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* SECTION 1: HERO */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15] mb-4 sm:mb-6">
            Bringing Businesses Closer to Their Customers
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
            A platform that helps businesses build their presence, manage their operations, connect with customers, and unlock new opportunities for growth.
          </p>

          {/* Customer Search & Quick Discovery Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center shadow-2xs rounded-xl border border-stone-300 bg-white p-1.5 focus-within:ring-2 focus-within:ring-[#0F766E] focus-within:border-transparent gap-1.5 sm:gap-0">
              <div className="flex items-center flex-1">
                <Search className="w-5 h-5 text-stone-400 ml-3 shrink-0" />
                <input
                  id="hero-quick-search"
                  type="text"
                  placeholder="Search turf, gym, badminton, clinic, salon..."
                  className="w-full px-3 py-2 text-sm text-stone-900 focus:outline-none placeholder:text-stone-400 bg-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      onNavigate(`/businesses${val ? `?search=${encodeURIComponent(val)}` : ''}`);
                    }
                  }}
                />
              </div>
              <button
                onClick={(e) => {
                  const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement | null;
                  const val = input?.value || '';
                  onNavigate(`/businesses${val ? `?search=${encodeURIComponent(val)}` : ''}`);
                }}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors shrink-0 shadow-2xs"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-stone-500">
              <span className="font-medium">Quick Explore:</span>
              <button onClick={() => onNavigate('/businesses?category=Sports')} className="hover:text-[#0F766E] font-medium underline">
                Cricket Turf
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('/businesses?category=Fitness')} className="hover:text-[#0F766E] font-medium underline">
                Fitness & Gym
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('/businesses?category=Healthcare')} className="hover:text-[#0F766E] font-medium underline">
                Clinics
              </button>
              <span>•</span>
              <button onClick={() => onNavigate('/businesses')} className="text-[#0F766E] font-semibold hover:underline">
                View All Businesses →
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="hero-discover-cta"
              onClick={() => onNavigate('/businesses')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 rounded-lg text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-2xs transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Discover Businesses Near You</span>
            </button>

            <button
              id="hero-get-started-cta"
              onClick={() => onNavigate('/dashboard')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 shadow-2xs transition-all"
            >
              <Building2 className="w-4 h-4 text-[#0F766E]" />
              <span>For Businesses: Get Started</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: CORE BUSINESS CAPABILITIES */}
      <section className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            Core Business Capabilities
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Everything your business needs to operate, publish, and interact with customers in one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {/* Card 1 */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E] mb-4">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Business Profile</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Create and manage your complete business profile with photos, operating hours, amenities, and location.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 text-xs font-semibold text-[#0F766E]">
              Photos, timings, amenities & address
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E] mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Business Configuration</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Configure services, products, packages, bookings, memberships, events, and other business activities.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 text-xs font-semibold text-[#0F766E]">
              Slots, prices, stock & rules
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E] mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Customer Discovery</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Help customers discover businesses, explore offerings, book online, and leave ratings and reviews.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 text-xs font-semibold text-[#0F766E]">
              Public search, booking flow & reviews
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-[#0F766E] mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Reports & Insights</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Understand customers, revenue, operational performance, and expenses to track true net profit.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-100 text-xs font-semibold text-[#0F766E]">
              Revenue, bookings & net profit
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHO GETLISTED IS BUILT FOR */}
      <section className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 bg-stone-100/70 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
              Who GetListed Is Built For
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              GetListed is built for businesses across different industries, with flexible tools that adapt to the way each operates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Services</h3>
              <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                Manage the appointments and services you provide to your customers.
              </p>
              <div className="pt-3 border-t border-stone-100 text-2xs text-stone-500 font-medium">
                Examples: <span className="text-stone-800">Turf, Gym, Clinic</span>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] mb-4">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Products</h3>
              <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                Manage products that you sell, provide, or make available for rental.
              </p>
              <div className="pt-3 border-t border-stone-100 text-2xs text-stone-500 font-medium">
                Examples: <span className="text-stone-800">Sports equipment, Medicines</span>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Bookings & Memberships</h3>
              <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                Manage appointments, reservations, time slots, availability, and memberships.
              </p>
              <div className="pt-3 border-t border-stone-100 text-2xs text-stone-500 font-medium">
                Examples: <span className="text-stone-800">Turf slots, Gym passes</span>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs">
              <div className="w-10 h-10 rounded-lg bg-[#F0FDFA] flex items-center justify-center text-[#0F766E] mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Events</h3>
              <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                Create and manage public events, bootcamps, and tournaments.
              </p>
              <div className="pt-3 border-t border-stone-100 text-2xs text-stone-500 font-medium">
                Examples: <span className="text-stone-800">Tournaments, Workshops</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PRICING */}
      <section id="pricing" className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            Simple Pricing. Built to Grow With Your Business.
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Straightforward plans designed for businesses at any stage of growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* GetListed Free */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">GetListed Starter</h3>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                  Essential
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mb-6">
                Complete core tools for listing and operational management.
              </p>

              <div className="space-y-3 pt-4 border-t border-stone-100">
                {[
                  'Business Profile & Public Directory',
                  'Services & Products Catalog',
                  'Combo Packages',
                  'Slot Booking & Availability',
                  'Membership Management',
                  'Events & Tournaments',
                  'Customer Reviews & Ratings',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-700">
                    <Check className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                Start with Free
              </button>
            </div>
          </div>

          {/* GetListed Pro */}
          <div className="bg-white rounded-xl border-2 border-[#0F766E] p-6 sm:p-8 shadow-2xs flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-[#0F766E] text-white text-2xs font-bold px-3 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
              Recommended
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">GetListed Pro</h3>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/30">
                  Advanced
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mb-6">
                Comprehensive insights, customer intelligence, and business verification.
              </p>

              <div className="space-y-3 pt-4 border-t border-stone-100">
                {[
                  'Customer CRM Directory & Spend Metrics',
                  'Financial Ledger & Profit Reports',
                  'Team Delegation & Access Roles',
                  'WhatsApp & SMS Notification Engine',
                  'Verified Business Status Badge',
                  'Sponsored Listing Search Preference',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800 font-medium">
                    <Check className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-2xs transition-colors"
              >
                Manage with Pro
              </button>
            </div>
          </div>
        </div>

        {/* Platform Fee Callout */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0F766E] mb-0.5">Platform Handling Fee</div>
            <div className="text-lg sm:text-xl font-extrabold text-stone-900 mb-1">5% per confirmed booking</div>
            <p className="text-xs sm:text-sm text-stone-600">
              A transparent 5% platform handling fee applies to eligible bookings and orders made through GetListed.
            </p>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600 shrink-0">
            <span className="font-semibold text-stone-900">Example:</span> ₹600 booking = ₹30 platform fee (Net: ₹570)
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ */}
      <section id="faq" className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Clear, factual information about how GetListed works for businesses and customers.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  id={`faq-toggle-${idx}`}
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-stone-900 hover:bg-stone-50/80 transition-colors"
                >
                  <span className="text-sm sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-stone-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#0F766E]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section className="py-14 sm:py-18 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#0F766E] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Ready to Get Listed?
          </h2>
          <p className="text-base sm:text-lg text-[#CCFBF1] mb-8 max-w-xl mx-auto">
            Create your business profile and start managing your operations with GetListed today.
          </p>
          <button
            id="final-landing-cta"
            onClick={() => onNavigate('/dashboard')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm sm:text-base font-semibold text-[#0F766E] bg-white hover:bg-[#F0FDFA] shadow-sm transition-all"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-[#0F766E]" />
          </button>
        </div>
      </section>
    </div>
  );
};
