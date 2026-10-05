import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { Service } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import { Plus, Edit2, Trash2, Clock, CreditCard, RefreshCw, AlertCircle } from 'lucide-react';

interface ServicesViewProps {
  businessId: string;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ businessId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(500);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [availability, setAvailability] = useState('Available daily by appointment / slot');
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const list = await api.listServices(businessId);
      setServices(list);
    } catch (err: any) {
      console.error('Failed to load services:', err);
      setErrorMessage(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [businessId]);

  const handleOpenCreate = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice(600);
    setDurationMinutes(60);
    setAvailability('Available daily by appointment / slot');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setName(srv.name);
    setDescription(srv.description);
    setPrice(srv.price);
    setDurationMinutes(srv.durationMinutes);
    setAvailability(srv.availability);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      if (editingService) {
        await api.updateService(editingService.id, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          durationMinutes: Number(durationMinutes),
          availability: availability.trim(),
        });
      } else {
        await api.createService(businessId, {
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
          durationMinutes: Number(durationMinutes),
          availability: availability.trim(),
        });
      }
      setIsModalOpen(false);
      await fetchServices();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await api.archiveService(id);
      await fetchServices();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to archive service');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-[#0F766E] animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading services...</p>
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
          <h2 className="text-base sm:text-lg font-bold text-stone-900">Services Configuration</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Define the services customers can discover, reserve, and book.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors shadow-2xs self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {services.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center max-w-md mx-auto">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-900 mb-1">No services configured yet</h3>
          <p className="text-xs text-stone-500 mb-4">
            Add services to allow customers to check availability and book time slots.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] border border-[#0F766E]/30 hover:bg-[#CCFBF1]/50 transition-colors"
          >
            Create Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(srv => (
            <div
              key={srv.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-stone-900 text-base truncate">{srv.name}</h3>
                  <div className="text-right shrink-0">
                    <span className="text-base font-extrabold text-stone-900">₹{srv.price}</span>
                    <span className="text-2xs text-stone-500 block">/{srv.durationMinutes} min</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mb-3 leading-relaxed line-clamp-2">{srv.description}</p>
                <div className="text-2xs text-stone-500 bg-stone-50 p-2 rounded-md border border-stone-100 mb-4 truncate">
                  {srv.availability}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-2xs text-stone-400 font-mono">ID: {srv.id.slice(-6)}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchive(srv.id)}
                    className="p-1.5 text-stone-400 hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors"
                    title="Archive Service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Service Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. 5-a-Side Football Turf Slot"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                required
                min={15}
                step={15}
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Availability Schedule</label>
            <input
              type="text"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              placeholder="e.g. Daily 06:00 AM - 10:00 PM"
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Provide key details, specifications, requirements, or inclusions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
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
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] disabled:opacity-50 transition-colors shadow-2xs"
            >
              {submitting ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
