export const DEFAULT_USERS = [
  // ================= COMMITTEE MEMBERS =================
  {
    id: 'mem-1',
    name: 'Chief Authority Admin',
    email: 'admin@sociosphere.io',
    phone: '+91 98765 00000',
    role: 'authority',
    type: 'member',
    designation: 'RWA President',
    committeeRole: 'Board President & Lead Administrator',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Admin Wing Tower A',
    block: 'Tower A',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Aug 2024',
    emergencyContact: '+91 98765 00001 (Security Desk)',
    badges: ['Board President', 'System Administrator', 'Security Lead']
  },
  {
    id: 'mem-2',
    name: 'Rajesh Khanna',
    email: 'rajesh.k@sociosphere.io',
    phone: '+91 98101 22334',
    role: 'authority',
    type: 'member',
    designation: 'General Secretary',
    committeeRole: 'Community Administration & Legal',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block A - 601',
    block: 'Block A',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Sep 2024',
    emergencyContact: '+91 98101 22335',
    badges: ['Executive Board', 'Legal Advisor']
  },
  {
    id: 'mem-3',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@sociosphere.io',
    phone: '+91 98450 77889',
    role: 'authority',
    type: 'member',
    designation: 'Treasurer',
    committeeRole: 'Society Accounts & Maintenance Audit',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block C - 302',
    block: 'Block C',
    status: 'Verified',
    avatarStyle: 'sparkle',
    joinedDate: 'Oct 2024',
    emergencyContact: '+91 98450 77880',
    badges: ['Finance Head', 'Audit Lead']
  },
  {
    id: 'mem-4',
    name: 'Col. Devendra Pratap',
    email: 'devendra.p@sociosphere.io',
    phone: '+91 98230 44556',
    role: 'authority',
    type: 'member',
    designation: 'Security In-Charge',
    committeeRole: 'Gate Patrol & Emergency Protocol',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block B - 101',
    block: 'Block B',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Jul 2024',
    emergencyContact: '+91 98230 44550 (Gate 1 Guard)',
    badges: ['Security Head', 'Disaster Coordinator']
  },
  {
    id: 'mem-5',
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@sociosphere.io',
    phone: '+91 98711 99882',
    role: 'authority',
    type: 'member',
    designation: 'Health & Sanitation Convener',
    committeeRole: 'Water Quality, Hygiene & Waste Mgmt',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block D - 504',
    block: 'Block D',
    status: 'Verified',
    avatarStyle: 'nature',
    joinedDate: 'Nov 2024',
    emergencyContact: '+91 98711 99880',
    badges: ['Health Committee', 'Green Champion']
  },
  {
    id: 'mem-6',
    name: 'Harish Batra',
    email: 'harish.b@sociosphere.io',
    phone: '+91 98114 55667',
    role: 'authority',
    type: 'member',
    designation: 'Infrastructure Coordinator',
    committeeRole: 'Civil Works, Elevators & Electricals',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block A - 204',
    block: 'Block A',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Jan 2025',
    emergencyContact: '+91 98114 55660',
    badges: ['Works Committee', 'Power & Backup Lead']
  },

  // ================= RESIDENTS (VERIFIED) =================
  {
    id: 'usr-1',
    name: 'Aarav Sharma',
    email: 'aarav@sociosphere.io',
    phone: '+91 98765 43210',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Owner)',
    occupancyType: 'Owner',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block B - 402',
    block: 'Block B',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Jan 2025',
    emergencyContact: '+91 98765 43219',
    badges: ['Active Reporter', 'Civic Champion', 'Verified Resident']
  },
  {
    id: 'res-2',
    name: 'Priya Patel',
    email: 'priya.p@gmail.com',
    phone: '+91 98220 11223',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Owner)',
    occupancyType: 'Owner',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block A - 304',
    block: 'Block A',
    status: 'Verified',
    avatarStyle: 'smile',
    joinedDate: 'Feb 2024',
    emergencyContact: '+91 98220 11220',
    badges: ['Verified Resident', 'Gardening Club']
  },
  {
    id: 'res-3',
    name: 'Rohan Mehta',
    email: 'rohan.m@gmail.com',
    phone: '+91 98330 44556',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Tenant)',
    occupancyType: 'Tenant',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block C - 501',
    block: 'Block C',
    status: 'Verified',
    avatarStyle: 'nature',
    joinedDate: 'Jun 2024',
    emergencyContact: '+91 98330 44550',
    badges: ['Verified Resident', 'Sports Rep']
  },
  {
    id: 'res-4',
    name: 'Sunita Rao',
    email: 'sunita.rao@outlook.com',
    phone: '+91 98440 66778',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Owner)',
    occupancyType: 'Owner',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block D - 102',
    block: 'Block D',
    status: 'Verified',
    avatarStyle: 'smile',
    joinedDate: 'Mar 2023',
    emergencyContact: '+91 98440 66770',
    badges: ['Senior Citizen Club', 'Floor Marshall']
  },
  {
    id: 'res-5',
    name: 'Kabir Verma',
    email: 'kabir.v@techcorp.in',
    phone: '+91 98550 88990',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Tenant)',
    occupancyType: 'Tenant',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block B - 703',
    block: 'Block B',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Aug 2024',
    emergencyContact: '+91 98550 88991',
    badges: ['Verified Resident', 'EV Enthusiast']
  },
  {
    id: 'res-6',
    name: 'Fatima Sheikh',
    email: 'fatima.s@gmail.com',
    phone: '+91 98660 33445',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Owner)',
    occupancyType: 'Owner',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block A - 102',
    block: 'Block A',
    status: 'Verified',
    avatarStyle: 'sparkle',
    joinedDate: 'May 2023',
    emergencyContact: '+91 98660 33440',
    badges: ['Cultural Lead', 'Verified Resident']
  },
  {
    id: 'res-7',
    name: 'Vikramaditya Rathore',
    email: 'vikram.r@gmail.com',
    phone: '+91 98770 55667',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Owner)',
    occupancyType: 'Owner',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block C - Penthouse P1',
    block: 'Block C',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Jan 2023',
    emergencyContact: '+91 98770 55660',
    badges: ['Solar Pioneer', 'Verified Resident']
  },
  {
    id: 'res-8',
    name: 'Neha Kapoor',
    email: 'neha.k@designstudio.co',
    phone: '+91 98880 77889',
    role: 'citizen',
    type: 'resident',
    designation: 'Resident (Tenant)',
    occupancyType: 'Tenant',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block D - 204',
    block: 'Block D',
    status: 'Verified',
    avatarStyle: 'smile',
    joinedDate: 'Dec 2024',
    emergencyContact: '+91 98880 77880',
    badges: ['Verified Resident', 'Creative Arts']
  },

  // ================= PENDING APPROVALS =================
  {
    id: 'pend-1',
    name: 'Arjun Nambiar',
    email: 'arjun.n@gmail.com',
    phone: '+91 98990 12345',
    role: 'citizen',
    type: 'resident',
    designation: 'New Tenant Applicant',
    occupancyType: 'Tenant',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block B - 301',
    block: 'Block B',
    status: 'Pending Approval',
    avatarStyle: 'classic',
    joinedDate: 'Oct 2026',
    emergencyContact: '+91 98990 12340',
    badges: ['Verification In Progress']
  },
  {
    id: 'pend-2',
    name: 'Deepa Chawla',
    email: 'deepa.c@yahoo.com',
    phone: '+91 98110 54321',
    role: 'citizen',
    type: 'resident',
    designation: 'New Flat Owner',
    occupancyType: 'Owner',
    communityId: 'colony-1',
    communityName: 'Green Meadows Heights',
    unitNumber: 'Block D - 403',
    block: 'Block D',
    status: 'Pending Approval',
    avatarStyle: 'smile',
    joinedDate: 'Oct 2026',
    emergencyContact: '+91 98110 54320',
    badges: ['Registry Verification Pending']
  }
];

export const getUsers = () => {
  const stored = localStorage.getItem('sociosphere_users');
  if (!stored) {
    localStorage.setItem('sociosphere_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  }
  try {
    const parsed = JSON.parse(stored);
    // If user has old cache with only 2 users, merge the rich dataset
    if (Array.isArray(parsed) && parsed.length < DEFAULT_USERS.length) {
      const existingIds = new Set(parsed.map(u => u.id));
      const merged = [...parsed];
      DEFAULT_USERS.forEach(defUser => {
        if (!existingIds.has(defUser.id)) {
          merged.push(defUser);
        }
      });
      localStorage.setItem('sociosphere_users', JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (err) {
    console.error('Failed to parse users:', err);
    return DEFAULT_USERS;
  }
};

export const saveUsers = (users) => {
  localStorage.setItem('sociosphere_users', JSON.stringify(users));
  window.dispatchEvent(new Event('sociosphere_users_updated'));
  window.dispatchEvent(new Event('sociosphere_data_updated'));
};

export const addUser = (newUser) => {
  const users = getUsers();
  const id = `user-${Date.now().toString().slice(-5)}`;
  const createdUser = {
    ...newUser,
    id,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    status: newUser.status || 'Verified',
    badges: newUser.badges || (newUser.type === 'member' ? ['Committee Member'] : ['Verified Resident'])
  };
  const updated = [createdUser, ...users];
  saveUsers(updated);
  return createdUser;
};

export const approveUser = (userId) => {
  const users = getUsers();
  const updated = users.map(user => {
    if (user.id === userId) {
      return {
        ...user,
        status: 'Verified',
        badges: user.badges.map(b => b.includes('Pending') || b.includes('Progress') ? 'Verified Resident' : b)
      };
    }
    return user;
  });
  saveUsers(updated);
  return updated;
};

export const deleteUser = (userId) => {
  const users = getUsers();
  const updated = users.filter(u => u.id !== userId);
  saveUsers(updated);
  return updated;
};
