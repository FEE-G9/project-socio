export const DEFAULT_USERS = [
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'aarav@sociosphere.io',
    role: 'citizen',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block B - 402',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'Jan 2025',
    badges: ['Active Reporter', 'Civic Champion', 'Verified Resident']
  },
  {
    id: 'usr-2',
    name: 'Chief Authority Admin',
    email: 'admin@sociosphere.io',
    role: 'authority',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Admin Wing Tower A',
    phone: '+91 98765 00000',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    joinedDate: 'Aug 2024',
    badges: ['Board President', 'System Administrator', 'Security Lead']
  }
];

export const getUsers = () => {
  const stored = localStorage.getItem('sociosphere_users');
  if (!stored) {
    localStorage.setItem('sociosphere_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  return JSON.parse(stored);
};
