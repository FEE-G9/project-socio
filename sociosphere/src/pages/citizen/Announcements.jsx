import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Calendar, 
  AlertCircle,
  Bell,
  Building2,
  BellRing,
  CalendarPlus,
  UserPlus
} from 'lucide-react';
import { getAnnouncements } from '../../data/mockAnnouncements';
import { useAuth } from '../../context/AuthContext';

const EVENT_REGISTRATION_KEY = 'sociosphere_event_registrations';
const calendarStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const escapeCalendarText = (value = '') => value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

const exportCalendarEvent = (event) => {
  const startsAt = new Date(event.date);
  const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
  const file = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SocioSphere//Community Events//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${event.id}@sociosphere`, `DTSTAMP:${calendarStamp(new Date())}`, `DTSTART:${calendarStamp(startsAt)}`, `DTEND:${calendarStamp(endsAt)}`, `SUMMARY:${escapeCalendarText(event.title)}`, `DESCRIPTION:${escapeCalendarText(event.content || 'Community event')}`, 'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:Reminder: ${escapeCalendarText(event.title)}`, 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([file], { type: 'text/calendar;charset=utf-8' }));
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'community-event'}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
};

const Announcements = ({ eventsOnly = false }) => {
  const { user } = useAuth();
  const userSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const userSocietyCode = user?.societyCode || (
    userSociety === 'Gandhi Colony' ? 'GC-101' :
    userSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [announcements, setAnnouncements] = useState([]);
  const [reminderIds, setReminderIds] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const attendeeId = user?.id || user?.email || 'guest';
  const reminderStorageKey = `sociosphere_event_reminders_${attendeeId}`;

  useEffect(() => {
    // Load initially
    setAnnouncements(getAnnouncements());
    
    // Listen for cross-tab or dynamic updates if any
    const handleUpdate = () => {
      setAnnouncements(getAnnouncements());
    };
    window.addEventListener('sociosphere_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('sociosphere_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  useEffect(() => {
    const loadEventPreferences = () => {
      try { setReminderIds(JSON.parse(localStorage.getItem(reminderStorageKey) || '[]')); } catch { setReminderIds([]); }
      try { setRegistrations(JSON.parse(localStorage.getItem(EVENT_REGISTRATION_KEY) || '[]')); } catch { setRegistrations([]); }
    };
    loadEventPreferences();
    window.addEventListener('sociosphere_data_updated', loadEventPreferences);
    window.addEventListener('storage', loadEventPreferences);
    return () => { window.removeEventListener('sociosphere_data_updated', loadEventPreferences); window.removeEventListener('storage', loadEventPreferences); };
  }, [reminderStorageKey]);

  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return undefined;
    const timers = announcements.filter((announcement) => announcement.category === 'Event' && reminderIds.includes(announcement.id)).map((announcement) => {
      const delay = new Date(announcement.date).getTime() - Date.now() - 24 * 60 * 60 * 1000;
      if (delay <= 0 || delay > 2147483647) return null;
      return window.setTimeout(() => new Notification('SocioSphere event reminder', { body: `${announcement.title} is tomorrow.` }), delay);
    }).filter(Boolean);
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [announcements, reminderIds]);

  const toggleReminder = async (eventId) => {
    const next = reminderIds.includes(eventId) ? reminderIds.filter((id) => id !== eventId) : [...reminderIds, eventId];
    setReminderIds(next);
    localStorage.setItem(reminderStorageKey, JSON.stringify(next));
    if (!reminderIds.includes(eventId) && 'Notification' in window && Notification.permission === 'default') await Notification.requestPermission();
  };

  const toggleRegistration = (event) => {
    const alreadyRegistered = registrations.some((registration) => registration.eventId === event.id && registration.attendeeId === attendeeId);
    const next = alreadyRegistered ? registrations.filter((registration) => !(registration.eventId === event.id && registration.attendeeId === attendeeId)) : [...registrations, { eventId: event.id, attendeeId, attendeeName: user?.name || 'Community resident', registeredAt: new Date().toISOString() }];
    setRegistrations(next);
    localStorage.setItem(EVENT_REGISTRATION_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event('sociosphere_data_updated'));
  };

  const getCategoryColor = (cat) => {
    switch ((cat || '').toLowerCase()) {
      case 'maintenance': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
      case 'event': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
      case 'notice': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200 dark:border-slate-500/20';
    }
  };

  const societyAnnouncements = announcements.filter(a => 
    (a.society && a.society.toLowerCase() === userSociety.toLowerCase()) ||
    (userSociety === 'Gandhi Colony' && (!a.society || a.colonyId === 'colony-1' || a.societyCode === 'GC-101'))
  );

  const visibleAnnouncements = societyAnnouncements.filter((announcement) => eventsOnly ? announcement.category === 'Event' : announcement.category !== 'Event');

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Hub
            </p>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-2">
              <Building2 size={12} />
              <span>{userSociety}</span>
              <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1 rounded border border-emerald-500/30">
                {userSocietyCode}
              </span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">{eventsOnly ? `${userSociety} Events` : `${userSociety} Announcements`}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{eventsOnly ? 'Register, volunteer, add events to your calendar, and set reminders.' : `Official notices and updates from ${userSociety} Authority.`}</p>
        </div>
      </div>

      <div className="space-y-4 max-w-4xl">
        {visibleAnnouncements.map(ann => {
          const isEvent = ann.category === 'Event';
          const registered = registrations.some((registration) => registration.eventId === ann.id && registration.attendeeId === attendeeId);
          const registrationCount = registrations.filter((registration) => registration.eventId === ann.id).length;
          return (
          <div key={ann.id} className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0D1524] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryColor(ann.category)}`}>
                    {ann.category}
                  </span>
                  {ann.important && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20 flex items-center gap-1">
                      <AlertCircle size={12} /> Urgent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                  <Calendar size={12} />
                  {new Date(ann.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 leading-snug">
                {ann.title}
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {ann.content}
              </p>

              {isEvent && (
                <div className="mb-5 rounded-xl border border-violet-100 bg-violet-50/60 p-3 dark:border-violet-500/20 dark:bg-violet-500/5">
                  <div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{registrationCount} {registrationCount === 1 ? 'resident is' : 'residents are'} joining</p><span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Calendar reminder: 1 day before</span></div>
                  <div className="flex flex-wrap gap-2"><button onClick={() => toggleRegistration(ann)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-white transition ${registered ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-violet-600 hover:bg-violet-500'}`}><UserPlus size={14} /> {registered ? 'Registered' : 'Register / volunteer'}</button><button onClick={() => exportCalendarEvent(ann)} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500/25 dark:bg-slate-900 dark:text-emerald-400"><CalendarPlus size={14} /> Add to calendar</button><button onClick={() => toggleReminder(ann.id)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition ${reminderIds.includes(ann.id) ? 'border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}><BellRing size={14} /> {reminderIds.includes(ann.id) ? 'Reminder set' : 'Set reminder'}</button></div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Bell size={14} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{ann.author}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-500">{ann.authorRole}</p>
                </div>
              </div>
            </div>
          </div>
          );
        })}
        
        {visibleAnnouncements.length === 0 && (
          <div className="text-center py-16 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl bg-slate-50 dark:bg-[#0D1524]">
            <Megaphone size={48} className="mx-auto text-slate-400 dark:text-slate-700 mb-4" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No {eventsOnly ? 'Events' : 'Announcements'}</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">There are no {eventsOnly ? 'community events' : 'official updates'} at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
