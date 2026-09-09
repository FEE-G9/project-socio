export const INITIAL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Annual Eco-Energy Solar Upgrade & Maintenance Drive',
    author: 'Green Meadows Welfare Board',
    authorRole: 'Society Authority',
    date: '2026-09-06T10:00:00Z',
    category: 'Maintenance',
    important: true,
    colonyId: 'colony-1',
    content: 'Scheduled maintenance of central rooftop solar panels will take place on Sunday, Sep 10, between 10:00 AM and 02:00 PM. Alternate grid power backup will be activated seamlessly.'
  },
  {
    id: 'ann-2',
    title: 'Community Wellness & Yoga Marathon in Main Park',
    author: 'Resident Cultural Committee',
    authorRole: 'Community Representative',
    date: '2026-09-04T08:30:00Z',
    category: 'Event',
    important: false,
    colonyId: 'colony-1',
    content: 'Join us for a sunrise yoga & wellness session this Saturday at 06:30 AM in the Central Lawn. Complimentary herbal drinks and breakfast provided!'
  },
  {
    id: 'ann-3',
    title: 'New AI Waste Sorting Guidelines & Bin Colors',
    author: 'Green Meadows Welfare Board',
    authorRole: 'Society Authority',
    date: '2026-09-01T12:00:00Z',
    category: 'Notice',
    important: true,
    colonyId: 'colony-1',
    content: 'Please separate wet organic waste (Green Bin), recyclable plastic/paper (Blue Bin), and electronic waste (Red Bin). AI audit sensors will assist sanitation staff.'
  }
];

export const getAnnouncements = () => {
  const stored = localStorage.getItem('sociosphere_announcements');
  if (!stored) {
    localStorage.setItem('sociosphere_announcements', JSON.stringify(INITIAL_ANNOUNCEMENTS));
    return INITIAL_ANNOUNCEMENTS;
  }
  return JSON.parse(stored);
};
