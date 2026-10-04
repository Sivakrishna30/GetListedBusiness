import React, { useState, useEffect } from 'react';
import { api } from '../../services/apiClient.ts';
import { BusinessEvent } from '../../../shared/types.ts';
import { Modal } from '../../components/Modal.tsx';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Users, RefreshCw } from 'lucide-react';

interface EventsViewProps {
  businessId: string;
}

export const EventsView: React.FC<EventsViewProps> = ({ businessId }) => {
  const [events, setEvents] = useState<BusinessEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BusinessEvent | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [location, setLocation] = useState('Main Facility Ground');
  const [capacity, setCapacity] = useState<number>(32);
  const [price, setPrice] = useState<number>(500);
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const list = await api.listEvents(businessId);
      setEvents(list);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [businessId]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setName('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('08:00');
    setEndTime('14:00');
    setLocation('Facility Arena');
    setCapacity(32);
    setPrice(500);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ev: BusinessEvent) => {
    setEditingEvent(ev);
    setName(ev.name);
    setDescription(ev.description);
    setDate(ev.date);
    setStartTime(ev.startTime);
    setEndTime(ev.endTime);
    setLocation(ev.location);
    setCapacity(ev.capacity);
    setPrice(ev.price);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      if (editingEvent) {
        await api.updateEvent(editingEvent.id, {
          name: name.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          location: location.trim(),
          capacity: Number(capacity),
          price: Number(price),
        });
      } else {
        await api.createEvent(businessId, {
          name: name.trim(),
          description: description.trim(),
          date,
          startTime,
          endTime,
          location: location.trim(),
          capacity: Number(capacity),
          price: Number(price),
          status: 'PUBLISHED',
        });
      }
      setIsModalOpen(false);
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleArchive = async (id: string, evName: string) => {
    if (!window.confirm(`Are you sure you want to archive event "${evName}"?`)) return;
    try {
      await api.archiveEvent(id);
      await fetchEvents();
    } catch (err: any) {
      alert(err.message || 'Failed to archive event');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-xl border border-stone-200 text-center">
        <RefreshCw className="w-6 h-6 text-teal-700 animate-spin mx-auto mb-2" />
        <p className="text-xs text-stone-500 font-medium">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-stone-900">Events & Special Activities</h2>
          <p className="text-xs text-stone-500">
            Publish tournaments, bootcamps, workshops, and wellness sessions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 transition-colors shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Event</span>
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-stone-200 text-center max-w-md mx-auto">
          <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-900 mb-1">No events published</h3>
          <p className="text-xs text-stone-500 mb-4">
            Create an event or tournament to engage local sports and fitness communities.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(ev => (
            <div
              key={ev.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-2xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {ev.date}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base mt-1.5">{ev.name}</h3>
                  </div>
                  <span className="text-base font-extrabold text-stone-900">
                    {ev.price === 0 ? 'Free' : `₹${ev.price}`}
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-3 leading-relaxed">{ev.description}</p>

                <div className="space-y-1 text-2xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{ev.startTime} - {ev.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    <span>{ev.registeredCount} / {ev.capacity} spots registered</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-2xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {ev.status}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchive(ev.id, ev.name)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Edit Event' : 'Publish New Event'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Event Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Monsoon Badminton Open"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Venue / Arena</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Capacity (Max participants)</label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Entry Fee (₹ - 0 for Free)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Event Details & Schedule</label>
            <textarea
              rows={3}
              placeholder="Format, prizes, eligibility, rules..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-teal-700 focus:outline-none"
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
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingEvent ? 'Update Event' : 'Publish Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
