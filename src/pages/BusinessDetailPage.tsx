import React, { useState, useEffect } from 'react';
import { api } from '../services/apiClient.ts';
import { Business, Service, Product, Package, Membership, BusinessEvent, Review } from '../../shared/types.ts';
import { VerificationBadge, PlanBadge } from '../components/Badge.tsx';
import { Modal } from '../components/Modal.tsx';
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Globe,
  Star,
  Calendar,
  Layers,
  ShoppingBag,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface BusinessDetailPageProps {
  businessId: string;
  onNavigate: (path: string) => void;
}

export const BusinessDetailPage: React.FC<BusinessDetailPageProps> = ({
  businessId,
  onNavigate,
}) => {
  const [data, setData] = useState<
    | (Business & {
        services: Service[];
        products: Product[];
        packages: Package[];
        memberships: Membership[];
        events: BusinessEvent[];
        reviews: Review[];
      })
    | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Membership enrollment modal state
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [enrollName, setEnrollName] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBusiness(businessId);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load business details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusiness();
  }, [businessId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewText.trim()) return;

    try {
      setReviewSubmitting(true);
      await api.createReview(businessId, {
        customerName: reviewerName,
        rating: reviewRating,
        review: reviewText,
      });
      setReviewSuccess(true);
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccess(false);
        setReviewerName('');
        setReviewText('');
        fetchBusiness();
      }, 1200);
    } catch (err: any) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembership || !enrollName.trim() || !enrollPhone.trim()) return;

    try {
      setEnrolling(true);
      await api.enrollMembership(businessId, {
        membershipId: selectedMembership.id,
        customerName: enrollName,
        customerPhone: enrollPhone,
      });
      setEnrollSuccess(true);
      setTimeout(() => {
        setEnrollModalOpen(false);
        setEnrollSuccess(false);
        setEnrollName('');
        setEnrollPhone('');
        setSelectedMembership(null);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to enroll:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 py-24 text-center">
        <RefreshCw className="w-8 h-8 text-[#0F766E] animate-spin mx-auto mb-3" />
        <p className="text-sm font-medium text-stone-600">Loading business information...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-50 py-20 px-4">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-xl border border-stone-200 text-center">
          <p className="text-[#DC2626] font-semibold mb-4">{error || 'Business not found'}</p>
          <button
            onClick={() => onNavigate('/businesses')}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] border border-[#0F766E]/30"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  const averageRating =
    data.reviews.length > 0
      ? (data.reviews.reduce((sum, r) => sum + r.rating, 0) / data.reviews.length).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Cover Image Banner */}
      <div className="relative h-56 sm:h-72 md:h-80 w-full bg-stone-900">
        <img
          src={data.coverImage}
          alt={data.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

        <div className="absolute top-4 left-4">
          <button
            onClick={() => onNavigate('/businesses')}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-black/50 text-white backdrop-blur-xs hover:bg-black/70 transition-colors"
          >
            ← Back to Discovery
          </button>
        </div>

        <div className="absolute top-4 right-4 flex items-center gap-2">
          <VerificationBadge status={data.verificationStatus} />
          {data.sponsoredListingEnabled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#D97706] text-white">
              <Sparkles className="w-3 h-3" />
              <span>Sponsored</span>
            </span>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16 relative z-10 mb-8">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-2xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 pb-6 border-b border-stone-100">
            <div className="flex items-start gap-4">
              <img
                src={data.logo}
                alt=""
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white shadow-xs bg-stone-100 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900">{data.name}</h1>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#0F766E] mb-2">
                  {data.category} • {data.subCategory}
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs text-stone-600 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {data.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {data.workingHours}
                  </span>
                  {averageRating && (
                    <span className="flex items-center gap-1 text-[#D97706] font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {averageRating} ({data.reviews.length} reviews)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Contact & Book Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
              {data.whatsappNumber && (
                <a
                  href={`https://wa.me/${data.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-[#16A34A] bg-[#F0FDF4] hover:bg-[#F0FDF4]/80 border border-[#16A34A]/30 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}

              {data.contactNumber && (
                <a
                  href={`tel:${data.contactNumber}`}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
              )}

              <button
                onClick={() => onNavigate(`/businesses/${data.id}/book`)}
                className="w-full sm:w-auto md:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0F766E] hover:bg-[#115E59] shadow-2xs transition-colors"
              >
                <span>Book Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description & Address */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">About the Business</h3>
                <p className="text-sm text-stone-700 leading-relaxed">{data.description}</p>
              </div>

              {data.amenities && data.amenities.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Amenities & Facilities</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {data.amenities.map((am, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200">
                        {am}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs text-stone-600">
              <h4 className="font-bold text-stone-800">Location & Details</h4>
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-stone-900 block">Address</span>
                  <span>{data.address || data.location}</span>
                </div>
                {data.website && (
                  <div>
                    <span className="font-medium text-stone-900 block">Website</span>
                    <a href={data.website} target="_blank" rel="noreferrer" className="text-[#0F766E] hover:underline flex items-center gap-1 truncate">
                      <Globe className="w-3 h-3" />
                      {data.website}
                    </a>
                  </div>
                )}
                <div>
                  <span className="font-medium text-stone-900 block">Verified Status</span>
                  <span className="text-stone-700">{data.verificationStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Modules */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Module: Services */}
        <section id="services-section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">Services & Offerings</h2>
              <p className="text-xs text-stone-500">Select a service to reserve a time slot</p>
            </div>
            <button
              onClick={() => onNavigate(`/businesses/${data.id}/book`)}
              className="text-xs font-semibold text-[#0F766E] hover:underline"
            >
              Open Booking Flow →
            </button>
          </div>

          {data.services.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-stone-200 text-center text-sm text-stone-500">
              No services have been configured yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.services.map(srv => (
                <div
                  key={srv.id}
                  className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between hover:border-[#0F766E] transition-colors shadow-2xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-stone-900 text-base">{srv.name}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-lg font-extrabold text-stone-900">₹{srv.price}</span>
                        <span className="text-xs text-stone-500 block">/{srv.durationMinutes} min</span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">{srv.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500">{srv.availability}</span>
                    <button
                      onClick={() => onNavigate(`/businesses/${data.id}/book?serviceId=${srv.id}`)}
                      className="px-3.5 py-1.5 rounded-lg font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Module: Products (Optional, if any) */}
        {data.products && data.products.length > 0 && (
          <section id="products-section">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">Products & Equipment</h2>
            <p className="text-xs text-stone-500 mb-4">Available on-site and over the counter</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.products.map(prd => (
                <div key={prd.id} className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-2xs font-semibold px-2 py-0.5 rounded-md ${
                        prd.stockStatus === 'IN_STOCK' ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30' : 'bg-[#FFFBEB] text-[#D97706] border border-[#D97706]/30'
                      }`}>
                        {prd.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Low Stock'}
                      </span>
                      <span className="text-base font-extrabold text-stone-900">₹{prd.price}</span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm mb-1">{prd.name}</h3>
                    <p className="text-xs text-stone-600 mb-3">{prd.description}</p>
                  </div>
                  <div className="text-xs text-stone-500 pt-2 border-t border-stone-100">{prd.availability}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Module: Packages (if any) */}
        {data.packages && data.packages.length > 0 && (
          <section id="packages-section">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">Combo Packages</h2>
            <p className="text-xs text-stone-500 mb-4">Bundled services for enhanced value</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.packages.map(pkg => (
                <div key={pkg.id} className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-stone-900 text-base">{pkg.name}</h3>
                      <span className="text-lg font-extrabold text-stone-900">₹{pkg.price}</span>
                    </div>
                    <p className="text-xs text-stone-600 mb-4">{pkg.description}</p>
                    <div className="space-y-1 mb-4">
                      {pkg.includedServices.map((inc, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span>Validity: {pkg.validityDays} Days</span>
                    <button
                      onClick={() => onNavigate(`/businesses/${data.id}/book`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] border border-[#0F766E]/30 hover:bg-[#CCFBF1]/50"
                    >
                      Inquire & Reserve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Module: Memberships */}
        {data.memberships && data.memberships.length > 0 && (
          <section id="memberships-section">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">Memberships</h2>
            <p className="text-xs text-stone-500 mb-4">Long-term plans and recurring benefits</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.memberships.map(mem => (
                <div key={mem.id} className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-stone-900 text-base">{mem.name}</h3>
                      <span className="text-lg font-extrabold text-[#0F766E]">₹{mem.price}</span>
                    </div>
                    <div className="text-xs font-medium text-stone-500 mb-3">{mem.durationDays} Days Duration</div>
                    <p className="text-xs text-stone-600 mb-4">{mem.description}</p>

                    <div className="space-y-1.5 mb-4">
                      {mem.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setSelectedMembership(mem);
                        setEnrollModalOpen(true);
                      }}
                      className="w-full py-2 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1]/50 border border-[#0F766E]/30 transition-colors"
                    >
                      Enroll in Membership
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Module: Events */}
        {data.events && data.events.length > 0 && (
          <section id="events-section">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1">Upcoming Events & Programs</h2>
            <p className="text-xs text-stone-500 mb-4">Special activities, programs, and tournaments</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.events.map(ev => (
                <div key={ev.id} className="bg-white p-5 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-[#F0FDFA] text-[#0F766E] border border-[#0F766E]/30">
                          {ev.date}
                        </span>
                        <h3 className="font-bold text-stone-900 text-base mt-2">{ev.name}</h3>
                      </div>
                      <span className="text-base font-extrabold text-stone-900">
                        {ev.price === 0 ? 'Free' : `₹${ev.price}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mb-4 leading-relaxed">{ev.description}</p>
                    <div className="text-xs text-stone-500 space-y-1 mb-4">
                      <div>Time: {ev.startTime} - {ev.endTime}</div>
                      <div>Venue: {ev.location}</div>
                      <div>Capacity: {ev.registeredCount} / {ev.capacity} spots filled</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-[#16A34A] font-medium">Registration Open</span>
                    <button
                      onClick={() => onNavigate(`/businesses/${data.id}/events`)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59]"
                    >
                      View Event Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Module: Reviews & Ratings */}
        <section id="reviews-section">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900">Customer Reviews & Ratings</h2>
              <p className="text-xs text-stone-500">Real feedback from customers</p>
            </div>
            <button
              id="write-review-btn"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1]/50 border border-[#0F766E]/30 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write a Review</span>
            </button>
          </div>

          {data.reviews.length === 0 ? (
            <div className="p-8 bg-white rounded-xl border border-stone-200 text-center">
              <Star className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-800">No reviews yet</p>
              <p className="text-xs text-stone-500 mt-1">Be the first to share your experience with this business.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.reviews.map(rev => (
                <div key={rev.id} className="bg-white p-5 rounded-xl border border-stone-200 space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-900">{rev.customerName}</span>
                    <div className="flex items-center text-[#D97706]">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{rev.review}</p>
                  <div className="text-2xs text-stone-400 pt-2 border-t border-stone-100">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Write Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Submit a Customer Review"
      >
        {reviewSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
            <h4 className="text-base font-bold text-stone-900">Thank you for your review!</h4>
            <p className="text-xs text-stone-600">Your feedback has been recorded.</p>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={e => setReviewerName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-[#D97706] hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= reviewRating ? 'fill-current' : 'text-stone-300'}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-stone-700 ml-2">{reviewRating} Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Review</label>
              <textarea
                required
                rows={3}
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Share your experience regarding facility, staff, timings, and quality..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50"
              >
                {reviewSubmitting ? 'Submitting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Membership Enrollment Modal */}
      <Modal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        title={selectedMembership ? `Enroll: ${selectedMembership.name}` : 'Membership Enrollment'}
      >
        {enrollSuccess ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
            <h4 className="text-base font-bold text-stone-900">Enrollment Successful!</h4>
            <p className="text-xs text-stone-600">The business desk has recorded your membership.</p>
          </div>
        ) : (
          <form onSubmit={handleEnrollSubmit} className="space-y-4 text-sm">
            {selectedMembership && (
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs">
                <div className="flex justify-between font-bold text-stone-900">
                  <span>Price: ₹{selectedMembership.price}</span>
                  <span>Duration: {selectedMembership.durationDays} Days</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={enrollName}
                onChange={e => setEnrollName(e.target.value)}
                placeholder="e.g. Arun Kumar"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                value={enrollPhone}
                onChange={e => setEnrollPhone(e.target.value)}
                placeholder="e.g. +91 98860 12345"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEnrollModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={enrolling}
                className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
