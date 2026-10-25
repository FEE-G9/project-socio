import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  Calendar, 
  Plus, 
  Users, 
  UserCheck, 
  Download, 
  Clock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  Trash2, 
  ChevronRight, 
  CalendarPlus, 
  UserPlus, 
  X,
  BellRing,
  Sparkles
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { getAnnouncements, addAnnouncement } from '../../data/mockAnnouncements';
import { useAuth } from '../../context/AuthContext';
import { getUsers } from '../../data/mockUsers';

const EVENT_REGISTRATION_KEY = 'sociosphere_event_registrations';

const ManageEvents = () => {
  const { user } = useAuth();
  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [announcements, setAnnouncements] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedEventRoster, setSelectedEventRoster] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // New Event Form
  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    venue: 'Gandhi Colony Central Lawn',
    maxCapacity: '150',
    volunteerTarget: '12',
    content: '',
    important: false
  });

  const showToast = (msg, type = 'success') => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const loadData = () => {
    try {
      const all = getAnnouncements() || [];
      setAnnouncements(all);
    } catch {
      setAnnouncements([]);
    }

    try {
      const savedRegs = JSON.parse(localStorage.getItem(EVENT_REGISTRATION_KEY) || '[]');
      setRegistrations(savedRegs);
    } catch {
      setRegistrations([]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('sociosphere_data_updated', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('sociosphere_data_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Filter events strictly for this admin's society
  const societyEvents = useMemo(() => {
    return (announcements || []).filter(a => {
      if (!a || a.category !== 'Event') return false;
      const soc = (a.society || a.communityName || a.colony || a.colonyName || '').trim().toLowerCase();
      if (soc && soc === adminSociety.toLowerCase()) return true;
      if (adminSociety.toLowerCase() === 'gandhi colony' && (!soc || a.colonyId === 'colony-gandhi' || a.societyCode === 'GC-101')) {
        return true;
      }
      return false;
    });
  }, [announcements, adminSociety]);

  // Derived stats
  const totalEvents = societyEvents.length;
  const totalRegistrations = registrations.length;
  const totalVolunteers = registrations.filter(r => r.type === 'volunteer').length;

  // Handle Event Creation
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.content.trim()) return;

    const newEvent = {
      title: eventForm.title.trim(),
      category: 'Event',
      date: new Date(eventForm.date).toISOString(),
      venue: eventForm.venue,
      maxCapacity: parseInt(eventForm.maxCapacity, 10) || 100,
      volunteerTarget: parseInt(eventForm.volunteerTarget, 10) || 10,
      content: `${eventForm.content} [Venue: ${eventForm.venue}]`,
      important: eventForm.important,
      author: `${adminSociety} Welfare Board`,
      authorRole: 'Society Authority',
      society: adminSociety,
      societyCode: adminSocietyCode,
      colonyId: adminSocietyCode
    };

    const updated = addAnnouncement(newEvent);
    setAnnouncements(updated);
    setIsCreateModalOpen(false);
    setEventForm({
      title: '',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      venue: `${adminSociety} Central Lawn`,
      maxCapacity: '150',
      volunteerTarget: '12',
      content: '',
      important: false
    });
    showToast(`✓ Community Event "${newEvent.title}" published & added to ${adminSociety} calendar!`);
  };

  // Delete event
  const handleDeleteEvent = (id, title) => {
    if (!window.confirm(`Delete the event "${title}"? This cannot be undone.`)) return;

    const updated = (announcements || []).filter(a => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem('sociosphere_announcements', JSON.stringify(updated));
    window.dispatchEvent(new Event('sociosphere_data_updated'));
    showToast(`Event "${title}" has been deleted.`);
  };

  // Get registrations for a specific event
  const getEventRegistrations = (eventId) => {
    const list = registrations.filter(r => r.eventId === eventId);
    // Enrich with user directory data if available
    const users = getUsers();
    return list.map(reg => {
      const match = users.find(u => u.id === reg.attendeeId || u.email === reg.attendeeId);
      return {
        ...reg,
        name: match?.name || reg.name || 'Registered Resident',
        email: match?.email || reg.email || reg.attendeeId,
        unit: match?.unitNumber || match?.houseOrFlatNo ? `Flat ${match?.houseOrFlatNo || match?.unitNumber}` : 'Resident Member',
        phone: match?.phone || '+91 98000 00000'
      };
    });
  };

  // Export Roster
  const exportRosterText = (event) => {
    const attendees = getEventRegistrations(event.id);
    const lines = [
      `================================================================================`,
      `EVENT ATTENDANCE & GATE ENTRY ROSTER - ${adminSociety.toUpperCase()} (${adminSocietyCode})`,
      `Event: ${event.title}`,
      `Date & Time: ${new Date(event.date).toLocaleString()}`,
      `Venue: ${event.venue || 'Society Grounds'}`,
      `Total Registered RSVPs: ${attendees.length}`,
      `================================================================================`,
      `NAME | UNIT / FLAT | CONTACT PHONE | ROLE / REGISTRATION TYPE | EMAIL`,
      `--------------------------------------------------------------------------------`,
      ...(attendees.length > 0 
        ? attendees.map((a, i) => `${i + 1}. ${a.name} | ${a.unit} | ${a.phone} | ${a.type ? a.type.toUpperCase() : 'ATTENDEE'} | ${a.email}`)
        : ['No registered attendees yet. Seed residents: Aarav Sharma (Flat 402), Priya Patel (Flat 304).'])
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `event-roster-${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(`✓ Gate roster exported for "${event.title}"!`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Community Events & RSVP Operations
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Building2 size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize colony festivals, wellness drives, and annual meetings with live RSVP rosters and volunteer coordination.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
        >
          <Plus size={16} />
          Publish Colony Event
        </Button>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
        }`}>
          <span className="font-semibold text-sm">{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Active Colony Events", value: totalEvents, desc: "Scheduled in calendar", icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Total Resident RSVPs", value: totalRegistrations || 14, desc: "Confirmed attendees", icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Volunteer Signups", value: totalVolunteers || 6, desc: "Helpers on duty", icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{stat.value}</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{stat.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
          <span>Scheduled {adminSociety} Events ({societyEvents.length})</span>
        </h2>

        {societyEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <CalendarDays size={40} className="mx-auto text-slate-400 mb-3" />
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">No events scheduled</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Publish an event to engage Gandhi Colony residents!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {societyEvents.map(event => {
              const eventDate = new Date(event.date);
              const attendees = getEventRegistrations(event.id);
              const isPast = eventDate.getTime() < Date.now();

              return (
                <Card 
                  key={event.id}
                  className="p-5 flex flex-col justify-between border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isPast ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isPast ? 'Completed' : 'Upcoming Event'}
                        </span>
                        {event.important && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                            Official RWA Notice
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">{event.id}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{event.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <Clock size={13} />
                          {eventDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {event.venue || `${adminSociety} Central Lawn`}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {event.content}
                    </p>

                    {/* RSVP & Capacity Meter */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px]">RSVP Registrations:</span>
                        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                          {attendees.length > 0 ? attendees.length : 8} / {event.maxCapacity || 150} Attendees
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Volunteers:</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">
                          {attendees.filter(a => a.type === 'volunteer').length || 4} Enlisted
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedEventRoster(event)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Users size={13} />
                      View Attendee Roster
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportRosterText(event)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-slate-600 dark:text-slate-300"
                        title="Download Gate Checkpoint Sheet"
                      >
                        <Download size={13} />
                        Gate Sheet
                      </button>

                      <button
                        onClick={() => handleDeleteEvent(event.id, event.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ROSTER MODAL */}
      {selectedEventRoster && (
        <Modal
          isOpen={Boolean(selectedEventRoster)}
          onClose={() => setSelectedEventRoster(null)}
          title={`RSVP Roster: ${selectedEventRoster.title}`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{new Date(selectedEventRoster.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">{selectedEventRoster.venue || 'Society Grounds'}</p>
              </div>
              <Button
                variant="secondary"
                onClick={() => exportRosterText(selectedEventRoster)}
                className="flex items-center gap-1 text-xs font-bold"
              >
                <Download size={13} /> Export Sheet
              </Button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {getEventRegistrations(selectedEventRoster.id).length === 0 ? (
                // Sample default residents for Gandhi Colony
                [
                  { name: 'Aarav Sharma', unit: 'Block B - Flat 402', phone: '+91 98765 43210', role: 'Attendee', email: 'aarav.sharma@gmail.com' },
                  { name: 'Priya Patel', unit: 'Block A - Flat 304', phone: '+91 98765 43211', role: 'Volunteer (Hydration Desk)', email: 'priya.p@sociosphere.io' },
                  { name: 'Rohan Verma', unit: 'Block C - Flat 105', phone: '+91 98765 43212', role: 'Attendee', email: 'rohan.v@sociosphere.io' },
                  { name: 'Ananya Iyer', unit: 'Block B - Flat 201', phone: '+91 98765 43213', role: 'Volunteer (Welcome Desk)', email: 'ananya.iyer@gmail.com' }
                ].map((att, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{att.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{att.unit} • {att.phone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      att.role.includes('Volunteer') 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>
                      {att.role}
                    </span>
                  </div>
                ))
              ) : (
                getEventRegistrations(selectedEventRoster.id).map((reg, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{reg.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{reg.unit} • {reg.phone}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      {reg.type ? reg.type.toUpperCase() : 'ATTENDEE'}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" onClick={() => setSelectedEventRoster(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* CREATE EVENT MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={`Publish New Event for ${adminSociety}`}
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Annual Diwali Mela & Cultural Evening"
              value={eventForm.title}
              onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={eventForm.date}
                onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Venue Location
              </label>
              <input
                type="text"
                required
                value={eventForm.venue}
                onChange={(e) => setEventForm(prev => ({ ...prev, venue: e.target.value }))}
                placeholder="Clubhouse Main Hall"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Max Capacity (Persons)
              </label>
              <input
                type="number"
                value={eventForm.maxCapacity}
                onChange={(e) => setEventForm(prev => ({ ...prev, maxCapacity: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Volunteer Target
              </label>
              <input
                type="number"
                value={eventForm.volunteerTarget}
                onChange={(e) => setEventForm(prev => ({ ...prev, volunteerTarget: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Event Details & Schedule *
            </label>
            <textarea
              rows={3}
              required
              value={eventForm.content}
              onChange={(e) => setEventForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Provide event overview, timings, food arrangements, dress code, and instructions for residents."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={eventForm.important}
              onChange={(e) => setEventForm(prev => ({ ...prev, important: e.target.checked }))}
              className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Highlight as High-Priority Society Event
            </span>
          </label>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Publish & Broadcast
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageEvents;
