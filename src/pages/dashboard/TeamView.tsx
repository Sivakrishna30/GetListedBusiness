import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { TeamMember } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import { Plus, Edit2, ShieldCheck, UserX, Phone, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface TeamViewProps {
  businessId: string;
}

export const TeamView: React.FC<TeamViewProps> = ({ businessId }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const list = await api.listTeam(businessId);
      setMembers(list);
    } catch (err: any) {
      console.error('Failed to load team:', err);
      setErrorMessage(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [businessId]);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setName('');
    setRole('Manager');
    setContact('');
    setStatus('ACTIVE');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m: TeamMember) => {
    setEditingMember(m);
    setName(m.name);
    setRole(m.role);
    setContact(m.contact || '');
    setStatus(m.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    try {
      setSubmitting(true);
      if (editingMember) {
        await api.updateTeamMember(editingMember.id, {
          name: name.trim(),
          role: role.trim(),
          contact: contact.trim(),
          status,
        });
      } else {
        await api.createTeamMember(businessId, {
          name: name.trim(),
          role: role.trim(),
          contact: contact.trim(),
          status,
        });
      }
      setIsModalOpen(false);
      await fetchTeam();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await api.deactivateTeamMember(id);
      await fetchTeam();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to deactivate team member');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-[#0F766E] animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading team members...</p>
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
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">Team Management</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-bold bg-[#0F766E] text-white uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#CCFBF1]" />
              Pro Feature
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage staff members, roles, permissions, and operating personnel.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#0F766E] hover:bg-[#115E59] transition-colors shadow-2xs self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {members.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center max-w-md mx-auto">
          <ShieldCheck className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-900 mb-1">No team members added</h3>
          <p className="text-xs text-stone-500 mb-4">
            Add managers, coaches, receptionists, or trainers to delegate business management.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-[#0F766E] bg-[#F0FDFA] border border-[#0F766E]/30 hover:bg-[#CCFBF1]/50 transition-colors"
          >
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(tm => (
            <div
              key={tm.id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-2xs font-bold ${
                      tm.status === 'ACTIVE'
                        ? 'bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30'
                        : 'bg-stone-100 text-stone-500 border border-stone-200'
                    }`}
                  >
                    {tm.status}
                  </span>
                  <span className="text-2xs text-stone-400 font-mono">#{tm.id.slice(-6)}</span>
                </div>

                <h3 className="font-bold text-stone-900 text-base mb-1 truncate">{tm.name}</h3>
                <div className="text-xs font-semibold text-[#0F766E] mb-3">{tm.role}</div>

                {tm.contact && (
                  <div className="flex items-center gap-1.5 text-xs text-stone-600 mb-4 truncate">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{tm.contact}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-2xs text-stone-400">
                  Added {new Date(tm.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(tm)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                    title="Edit Member"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {tm.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleDeactivate(tm.id)}
                      className="p-1.5 text-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-md transition-colors"
                      title="Deactivate Member"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Team Member Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMember ? 'Edit Team Member' : 'Add Team Member'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Suresh Kumar"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Role / Designation *</label>
              <input
                type="text"
                required
                placeholder="e.g. Manager / Head Coach"
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-[#0F766E] focus:outline-none bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              placeholder="+91..."
              value={contact}
              onChange={e => setContact(e.target.value)}
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
              {submitting ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
