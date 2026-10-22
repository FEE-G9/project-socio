export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Annual Eco-Energy Solar Upgrade & Maintenance Drive',
    author: 'Gandhi Colony Welfare Board',
    authorRole: 'Society Authority',
    date: '2026-09-06T10:00:00Z',
    category: 'Maintenance',
    important: true,
    colonyId: 'colony-gandhi',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    content: 'Scheduled maintenance of central rooftop solar panels in Gandhi Colony will take place on Sunday, Sep 10, between 10:00 AM and 02:00 PM. Alternate grid power backup will be activated seamlessly.'
  },
  {
    id: 'ann-2',
    title: 'Community Wellness & Yoga Marathon in Main Park',
    author: 'Gandhi Colony Cultural Committee',
    authorRole: 'Community Representative',
    date: '2026-09-04T08:30:00Z',
    category: 'Event',
    important: false,
    colonyId: 'colony-gandhi',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    content: 'Join us for a sunrise yoga & wellness session this Saturday at 06:30 AM in Gandhi Colony Central Lawn. Complimentary herbal drinks and breakfast provided!'
  },
  {
    id: 'ann-3',
    title: 'New AI Waste Sorting Guidelines & Bin Colors',
    author: 'Gandhi Colony Welfare Board',
    authorRole: 'Society Authority',
    date: '2026-09-01T12:00:00Z',
    category: 'Notice',
    important: true,
    colonyId: 'colony-gandhi',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    content: 'Please separate wet organic waste (Green Bin), recyclable plastic/paper (Blue Bin), and electronic waste (Red Bin). AI audit sensors will assist Gandhi Colony sanitation staff.'
  }
];

export const getAnnouncements = () => {
  const stored = localStorage.getItem('sociosphere_announcements');
  if (!stored) {
    localStorage.setItem('sociosphere_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  }
  try {
    const parsed = JSON.parse(stored);
    let changed = false;
    const normalized = parsed.map(a => {
      if (!a.society || a.colonyId === 'colony-1') {
        changed = true;
        return {
          ...a,
          society: 'Gandhi Colony',
          societyCode: 'GC-101',
          colonyId: 'colony-gandhi'
        };
      }
      return a;
    });
    if (changed) {
      localStorage.setItem('sociosphere_announcements', JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
};

export const saveAnnouncements = (announcements) => {
  localStorage.setItem('sociosphere_announcements', JSON.stringify(announcements));
  window.dispatchEvent(new Event('sociosphere_data_updated'));
};

export const addAnnouncement = (newAnnouncement) => {
  const announcements = getAnnouncements();
  const id = `ann-${Date.now()}`;
  const announcementWithDefaults = {
    id,
    date: new Date().toISOString(),
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    ...newAnnouncement
  };

  const updated = [announcementWithDefaults, ...announcements];
  saveAnnouncements(updated);
  return announcementWithDefaults;
};
