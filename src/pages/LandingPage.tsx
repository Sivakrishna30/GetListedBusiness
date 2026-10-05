import React, { useState, useEffect } from 'react';
import {
  Building2,
  Sliders,
  Users,
  BarChart3,
  ArrowRight,
  Check,
  Calendar,
  Search,
  LayoutTemplate,
} from 'lucide-react';
import { api } from '../services/apiClient.ts';

interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<{ businessesListed: number; bookingsMade: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    api
      .getPlatformStats()
      .then(res => {
        if (mounted) setStats(res);
      })
      .catch(() => {
        if (mounted) setStats({ businessesListed: 0, bookingsMade: 0 });
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* SECTION 1: HERO */}
      <section className="relative pt-16 pb-16 sm:pt-24 sm:pb-24 px-4 sm:px-6 lg:px-8 border-b border-stone-200 bg-white overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#2563EB]/5 blur-3xl rounded-full" />
          <div className="absolute top-1/2 right-12 w-[300px] h-[250px] bg-[#F97371]/5 blur-3xl rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto text-center">
          {/* Primary Customer Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#18181B] tracking-tight leading-[1.12] mb-4 sm:mb-6">
            Find a Business. <span className="text-[#2563EB]">Book Your Slot.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg lg:text-xl text-[#52525B] leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10 font-normal">
            Discover businesses near you, check availability, and book with ease.
          </p>

          {/* Primary Customer CTA */}
          <div className="mb-6 sm:mb-8">
            <button
              id="hero-primary-customer-cta"
              onClick={() => onNavigate('/businesses')}
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl text-base sm:text-lg font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>What are you looking for?</span>
              <ArrowRight className="w-5 h-5 opacity-80 ml-1" />
            </button>
          </div>

          {/* Secondary Business Owner Content */}
          <div className="max-w-2xl mx-auto space-y-2.5">
            <h2 className="text-sm sm:text-base font-bold text-[#18181B] flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              <span>Want your business to be discovered?</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed max-w-lg mx-auto">
              Set up your business, manage services and appointments, and track your customers, revenue and reports.
            </p>
            <div className="pt-0.5">
              <button
                id="hero-secondary-business-cta"
                onClick={() => onNavigate('/dashboard')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#18181B] bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-colors cursor-pointer"
              >
                <span>Get Your Business Listed</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SET UP YOUR BUSINESS YOUR WAY */}
      <section id="capabilities" className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            Set Up Your Business Your Way
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Choose the tools your business needs and configure them around the way you work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Capability 1: Business Profile */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col hover:border-blue-200 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB] mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Business Profile</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Create your business profile with your location, work timings, and business details.
            </p>
          </div>

          {/* Capability 2: Start Faster With a Business Template */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col hover:border-rose-200 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#F97371] mb-4">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Start Faster With a Business Template</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Choose a ready-to-use template or build your own setup with the tools your business needs.
            </p>
          </div>

          {/* Capability 3: Services and Packages */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col hover:border-blue-200 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB] mb-4">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Services and Packages</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Add the services, packages, memberships or plans you offer and set your pricing.
            </p>
          </div>

          {/* Capability 4: Bookings and Availability */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col hover:border-rose-200 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#F97371] mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Bookings and Availability</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Set up appointments, time slots, availability and booking rules based on how your business operates.
            </p>
          </div>

          {/* Capability 5: Customers */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col hover:border-blue-200 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB] mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Customers</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Manage customer details, bookings, history and interactions in one place.
            </p>
          </div>

          {/* Capability 6: Revenue Reports */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs flex flex-col hover:border-rose-200 transition-all">
            <div className="w-11 h-11 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] flex items-center justify-center text-[#F97371] mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5">Revenue Reports</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Track your bookings and revenue with simple weekly and monthly reports.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PRICING */}
      <section id="pricing" className="py-14 sm:py-18 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] text-xs font-semibold uppercase tracking-wider mb-3">
            Pricing
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mb-3">
            Plans Designed for Your Business
          </h2>
          <p className="text-sm sm:text-base text-stone-600">
            Choose the plan that fits your business needs and scale as your business grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* GetListed Starter */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">GetListed Starter</h3>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                  Free
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
                Get your business listed and start accepting bookings.
              </p>

              <div className="space-y-3 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-semibold text-stone-900">Business Profile</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-semibold text-stone-900">Business Configuration</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-semibold text-stone-900">Bookings and Availability</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Get Started Free
              </button>
            </div>
          </div>

          {/* GetListed Professional */}
          <div className="bg-white rounded-xl border-2 border-[#2563EB] p-6 sm:p-8 shadow-2xs flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-[#2563EB] text-white text-2xs font-bold px-3 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
              RECOMMENDED
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">GetListed Professional</h3>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
                  Advanced
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
                Advanced tools to manage your customers, business operations and performance.
              </p>

              <div className="p-3 bg-[#EFF6FF] rounded-lg border border-[#DBEAFE] text-xs font-semibold text-[#2563EB] mb-4">
                Everything in Starter, plus:
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-semibold text-stone-900">Customer Management</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-semibold text-stone-900">Custom Events and Promotional Events</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-stone-800">
                  <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span className="font-semibold text-stone-900">Revenue Reports</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100">
              <button
                onClick={() => onNavigate('/dashboard')}
                className="w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-2xs transition-colors cursor-pointer"
              >
                Upgrade to Professional
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-14 sm:py-18 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1E3A8A] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Ready to Get Listed?
          </h2>
          <p className="text-base sm:text-lg text-[#DBEAFE] mb-8 max-w-xl mx-auto">
            Create your business profile and start managing your business with GetListed.
          </p>

          {/* Compact Platform Activity Indicator */}
          <div className="inline-flex items-center justify-center gap-4 sm:gap-6 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {stats !== null ? stats.businessesListed : 0}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#DBEAFE]">
                Businesses Active
              </span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {stats !== null ? stats.bookingsMade : 0}
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#DBEAFE]">
                Appointments Booked
              </span>
            </div>
          </div>

          <div>
            <button
              id="final-landing-cta"
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-[#F97371] hover:bg-[#E05654] shadow-md transition-all cursor-pointer"
            >
              <span>Get Your Business Listed</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
