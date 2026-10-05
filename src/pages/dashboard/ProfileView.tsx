import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Business } from '../../../shared/types.ts';
import { STANDARD_AMENITIES } from '../../../shared/constants.ts';
import { VerificationBadge, PlanBadge } from '../../components/Badge.tsx';
import { Building2, Save, CheckCircle2, AlertCircle, RefreshCw, X, Plus } from 'lucide-react';

interface ProfileViewProps {
  businessId: string;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ businessId }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [logo, setLogo] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getBusiness(businessId);
      setBusiness(data);
      setName(data.name || '');
      setCategory(data.category || 'Sports');
      setSubCategory(data.subCategory || '');
      setDescription(data.description || '');
      setContactNumber(data.contactNumber || '');
      setWhatsappNumber(data.whatsappNumber || '');
      setEmail(data.email || '');
      setWebsite(data.website || '');
      setLocation(data.location || '');
      setAddress(data.address || '');
      setWorkingHours(data.workingHours || '');
      setLogo(data.logo || '');
      setCoverImage(data.coverImage || '');
      setAmenities(data.amenities || []);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [businessId]);

  const handleToggleAmenity = (item: string) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter(a => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAmenity.trim()) return;
    if (!amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
    }
    setCustomAmenity('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSaving(true);
      setMessage(null);
      const updated = await api.updateBusiness(businessId, {
        name: name.trim(),
        category,
        subCategory: subCategory.trim(),
        description: description.trim(),
        contactNumber: contactNumber.trim(),
        whatsappNumber: whatsappNumber.trim(),
        email: email.trim(),
        website: website.trim(),
        location: location.trim(),
        address: address.trim(),
        workingHours: workingHours.trim(),
        logo: logo.trim(),
        coverImage: coverImage.trim(),
        amenities,
      });
      setBusiness(updated);
      setMessage({ type: 'success', text: 'Business profile successfully updated!' });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-[#2563EB] animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header card with status badges */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">Business Profile Management</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure how your business is presented in public search and customer booking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto shrink-0">
          {business && <VerificationBadge status={business.verificationStatus} />}
          {business && <PlanBadge plan={business.plan} />}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors shadow-2xs"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-[#F0FDF4] border-[#16A34A]/30 text-[#16A34A]'
              : 'bg-[#FEF2F2] border-[#DC2626]/30 text-[#DC2626]'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Basic Identity */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Identity & Category
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1">Business Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none bg-white"
            >
              <option value="Sports">Sports</option>
              <option value="Fitness">Fitness</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Wellness">Wellness</option>
              <option value="Salon">Salon</option>
              <option value="Leisure">Leisure</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Sub-Category</label>
            <input
              type="text"
              value={subCategory}
              onChange={e => setSubCategory(e.target.value)}
              placeholder="e.g. Football Turf / Crossfit / Dental Clinic"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Working Hours</label>
            <input
              type="text"
              value={workingHours}
              onChange={e => setWorkingHours(e.target.value)}
              placeholder="e.g. 06:00 AM - 11:00 PM (All Days)"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">Business Overview & Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
          />
        </div>
      </div>

      {/* Contact & Location */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Contact & Location Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={e => setWhatsappNumber(e.target.value)}
              placeholder="+91..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">City / Region</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Physical Address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visual Assets (Images) */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Visual Assets (Logo & Cover)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Logo Image URL</label>
            <input
              type="url"
              value={logo}
              onChange={e => setLogo(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
            {logo && (
              <div className="mt-2 flex items-center gap-3">
                <img src={logo} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
                <span className="text-2xs text-stone-500">Logo preview</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Cover Banner URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
            {coverImage && (
              <div className="mt-2">
                <img src={coverImage} alt="Cover Preview" className="h-16 w-full rounded-lg object-cover border border-stone-200" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amenities & Facilities */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Amenities & Facilities
        </h3>

        <div className="flex flex-wrap gap-2">
          {STANDARD_AMENITIES.map((am: string) => {
            const isSelected = amenities.includes(am);
            return (
              <button
                type="button"
                key={am}
                onClick={() => handleToggleAmenity(am)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {isSelected ? `✓ ${am}` : `+ ${am}`}
              </button>
            );
          })}
        </div>

        {/* Add Custom Amenity */}
        <div className="pt-2 flex items-center gap-2 max-w-sm">
          <input
            type="text"
            placeholder="Add custom facility / amenity..."
            value={customAmenity}
            onChange={e => setCustomAmenity(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs flex-1 focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddCustomAmenity}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};
