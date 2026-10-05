import React, { useState, useEffect } from 'react';
import { api } from '../services/apiClient.ts';
import { Business, CategoryInfo } from '../../shared/types.ts';
import { VerificationBadge, PlanBadge } from '../components/Badge.tsx';
import {
  Search,
  MapPin,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Building2,
  RefreshCw,
} from 'lucide-react';

interface DiscoveryPageProps {
  onNavigate: (path: string) => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ onNavigate }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.listBusinesses({
        search: search.trim() || undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        location: selectedLocation !== 'All' ? selectedLocation : undefined,
      });
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(console.error);

    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    const cat = params.get('category');
    const loc = params.get('location');
    if (q) setSearch(q);
    if (cat) setSelectedCategory(cat);
    if (loc) setSelectedLocation(loc);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBusinesses();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedCategory, selectedLocation]);

  const locationsList = ['All', 'Bengaluru', 'Hyderabad', 'Pune', 'Chennai', 'Mumbai', 'Delhi'];

  return (
    <div className="min-h-screen bg-[#FAFAF9] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] mb-2">
              <span>Customer Discovery Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
              Discover Local <span className="text-[#2563EB]">Businesses</span> & <span className="text-[#F97371]">Services</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#52525B] mt-1">
              Find verified local services, check live availability, and book directly.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => onNavigate('/dashboard')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#2563EB]" />
              <span>Are you a business? Business Portal</span>
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-input"
                type="text"
                placeholder="Search businesses, services, sports turf, gym, clinic, doctor..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent placeholder:text-stone-400"
              />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                id="location-filter"
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-8 py-2 sm:py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              >
                {locationsList.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'All' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs no-scrollbar">
            <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#2563EB] text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat.name
                    ? 'bg-[#2563EB] text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="py-20 text-center">
            <RefreshCw className="w-8 h-8 text-[#2563EB] animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-stone-600">Discovering businesses...</p>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchBusinesses}
              className="text-xs font-bold underline hover:text-[#DC2626]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && businesses.length === 0 && (
          <div className="bg-white rounded-xl border border-stone-200 p-10 sm:p-12 text-center max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-stone-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-stone-900 mb-1">No businesses found</h3>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              We couldn't find any businesses matching your search or filters. Try selecting "All Categories" or searching with a different term.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedLocation('All');
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#2563EB]/30 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Business Grid */}
        {!loading && !error && businesses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {businesses.map(biz => (
              <div
                key={biz.id}
                id={`biz-card-${biz.id}`}
                className="bg-white rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Image & Badges */}
                  <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={biz.coverImage}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&fit=crop&q=80';
                      }}
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <VerificationBadge status={biz.verificationStatus} />
                      {biz.sponsoredListingEnabled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#D97706] text-white shadow-2xs">
                          <Sparkles className="w-3 h-3" />
                          <span>Sponsored</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-xs">
                        {biz.category}
                      </span>
                    </div>

                    {/* Logo Overlay */}
                    <div className="absolute -bottom-5 left-4">
                      <img
                        src={biz.logo}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs bg-white"
                        onError={e => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=100&h=100&fit=crop&q=80';
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="pt-7 px-5 pb-5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-stone-900 group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {biz.name}
                      </h3>
                    </div>

                    <div className="text-xs font-medium text-[#2563EB] mb-2">
                      {biz.subCategory}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                      {biz.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-stone-600 pt-3 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{biz.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{biz.workingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onNavigate(`/businesses/${biz.id}`)}
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                  >
                    View Packages & Info
                  </button>

                  <button
                    onClick={() => onNavigate(`/businesses/${biz.id}/book`)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#F97371] hover:bg-[#E05654] transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Book Slot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
