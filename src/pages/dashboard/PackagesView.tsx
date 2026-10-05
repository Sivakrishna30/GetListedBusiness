import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Package } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import { Plus, Edit2, Trash2, Package as PackageIcon, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

interface PackagesViewProps {
  businessId: string;
}

export const PackagesView: React.FC<PackagesViewProps> = ({ businessId }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(2000);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [includedText, setIncludedText] = useState('5 Turf slot bookings\n1 Match Ball\nShower & locker access');
  const [submitting, setSubmitting] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const list = await api.listPackages(businessId);
      setPackages(list);
    } catch (err: any) {
      console.error('Failed to load packages:', err);
      setErrorMessage(err.message || 'Failed to load combo packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [businessId]);

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setName('');
    setDescription('');
    setPrice(2000);
    setValidityDays(30);
    setIncludedText('5 Turf slot bookings\n1 Match Ball\nShower & locker access');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setPrice(pkg.price);
    setValidityDays(pkg.validityDays);
    setIncludedText(pkg.includedServices.join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const includedServices = includedText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      setSubmitting(true);
      if (editingPackage) {
        await api.updatePackage(editingPackage.id, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          validityDays: Number(validityDays),
          includedServices,
        });
      } else {
        await api.createPackage(businessId, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          validityDays: Number(validityDays),
          includedServices,
        });
      }
      setIsModalOpen(false);
      await fetchPackages();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save package');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.archivePackage(id);
      await fetchPackages();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to archive package');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-[#2563EB] animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-3 bg-[#FEF2F2] border border-[#DC2626]/30 text-[#DC2626] rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-stone-500 hover:text-stone-700">✕</button>
        </div>
      )}

      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900">Combo Packages</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Combine services and perks into bundled value offers for customers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-2xs self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Package</span>
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center max-w-md mx-auto">
          <PackageIcon className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-900 mb-1">No combo packages configured</h3>
          <p className="text-xs text-stone-500 mb-4">
            Create bundled packs with multiple sessions or free add-ons to boost loyalty.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] border border-[#2563EB]/30 hover:bg-[#DBEAFE]/50 transition-colors"
          >
            Create First Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-stone-900 text-base truncate">{pkg.name}</h3>
                  <span className="text-base font-extrabold text-stone-900 shrink-0">₹{pkg.price}</span>
                </div>

                <p className="text-xs text-stone-600 mb-3 leading-relaxed">{pkg.description}</p>

                <div className="space-y-1.5 mb-4">
                  {pkg.includedServices.map((inc, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-2xs text-stone-500 font-medium">
                  Validity: {pkg.validityDays} Days
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                    title="Edit Package"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchive(pkg.id)}
                    className="p-1.5 text-stone-400 hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors"
                    title="Archive Package"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Package Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPackage ? 'Edit Combo Package' : 'Create Combo Package'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Package Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Weekend Warrior 5-Session Pack"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Package Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Validity (Days)</label>
              <input
                type="number"
                required
                min={1}
                value={validityDays}
                onChange={e => setValidityDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Included Items / Privileges (One per line)
            </label>
            <textarea
              rows={3}
              placeholder="5 Turf slot bookings&#10;1 Match Ball&#10;Shower and locker access"
              value={includedText}
              onChange={e => setIncludedText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Terms, conditions, and highlights..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#2563EB] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 transition-colors shadow-2xs"
            >
              {submitting ? 'Saving...' : editingPackage ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
