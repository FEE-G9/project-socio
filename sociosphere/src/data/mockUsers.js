// Complete SocioSphere Multi-Society Directory & Database
// Societies: Gandhi Colony (GC-101), Shayam Nagar (SN-202), Dalima Vihar (DV-303)

export const DEFAULT_USERS = [
  // =========================================================
  // 1. GANDHI COLONY (Code: GC-101)
  // =========================================================
  {
    id: 'gc-admin-1',
    name: 'Vansh Goyal',
    email: 'goyalvansh63708@gmail.com',
    password: 'vansh12345',
    age: 20,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'Software Engineer',
    blockNumber: 'Block A',
    houseOrFlatNo: 'Flat 707',
    unitNumber: 'Block A - Flat 707',
    phone: '+91 90412 08572',
    type: 'member',
    role: 'authority',
    designation: 'RWA President (Flat Owner)',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Jan 2024',
    emergencyContact: '+91 90412 08572',
    badges: ['Board President', 'System Administrator', 'Flat Owner', 'Tech Lead']
  },
  {
    id: 'gc-mem-2',
    name: 'Rajesh Khanna',
    email: 'rajesh.k@sociosphere.io',
    password: 'Rajesh#1982',
    age: 44,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'High Court Advocate',
    blockNumber: 'Block A',
    houseOrFlatNo: 'Flat 601',
    unitNumber: 'Block A - Flat 601',
    phone: '+91 98101 22334',
    type: 'member',
    role: 'authority',
    designation: 'General Secretary',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Mar 2024',
    emergencyContact: '+91 98101 22335',
    badges: ['Executive Board', 'Legal Advisor']
  },
  {
    id: 'gc-mem-3',
    name: 'Meenakshi Sundaram',
    email: 'meenakshi.s@sociosphere.io',
    password: 'Meena@302#',
    age: 41,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'Chartered Accountant',
    blockNumber: 'Block C',
    houseOrFlatNo: 'Flat 302',
    unitNumber: 'Block C - Flat 302',
    phone: '+91 98450 77889',
    type: 'member',
    role: 'authority',
    designation: 'Treasurer',
    status: 'Verified',
    avatarStyle: 'sparkle',
    joinedDate: 'Feb 2024',
    emergencyContact: '+91 98450 77880',
    badges: ['Finance Head', 'Audit Lead']
  },
  {
    id: 'gc-mem-4',
    name: 'Col. Devendra Pratap',
    email: 'devendra.p@sociosphere.io',
    password: 'ColPratap@1968',
    age: 58,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'Retired Defense Veteran',
    blockNumber: 'Block B',
    houseOrFlatNo: 'House 101',
    unitNumber: 'Block B - House 101',
    phone: '+91 98230 44556',
    type: 'member',
    role: 'authority',
    designation: 'Security In-Charge',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Jan 2024',
    emergencyContact: '+91 98230 44550',
    badges: ['Security Head', 'Disaster Protocol']
  },
  {
    id: 'gc-res-1',
    name: 'Aarav Sharma',
    email: 'aarav@sociosphere.io',
    password: 'Aarav@402!',
    age: 29,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'Software Engineer',
    blockNumber: 'Block B',
    houseOrFlatNo: 'Flat 402',
    unitNumber: 'Block B - Flat 402',
    phone: '+91 98765 43210',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Owner)',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Jan 2025',
    emergencyContact: '+91 98765 43219',
    badges: ['Active Reporter', 'Civic Champion', 'Verified Resident']
  },
  {
    id: 'gc-res-2',
    name: 'Priya Patel',
    email: 'priya.p@gmail.com',
    password: 'Priya#1993',
    age: 33,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'Product Designer',
    blockNumber: 'Block A',
    houseOrFlatNo: 'Flat 304',
    unitNumber: 'Block A - Flat 304',
    phone: '+91 98220 11223',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Owner)',
    status: 'Verified',
    avatarStyle: 'smile',
    joinedDate: 'Apr 2024',
    emergencyContact: '+91 98220 11220',
    badges: ['Verified Resident', 'Gardening Club']
  },
  {
    id: 'gc-res-3',
    name: 'Rohan Mehta',
    email: 'rohan.m@gmail.com',
    password: 'RohanM@501',
    age: 27,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'Data Analyst',
    blockNumber: 'Block C',
    houseOrFlatNo: 'Flat 501',
    unitNumber: 'Block C - Flat 501',
    phone: '+91 98330 44556',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Tenant)',
    status: 'Verified',
    avatarStyle: 'nature',
    joinedDate: 'Jun 2024',
    emergencyContact: '+91 98330 44550',
    badges: ['Verified Resident', 'Sports Club']
  },
  {
    id: 'gc-res-4',
    name: 'Sunita Rao',
    email: 'sunita.rao@outlook.com',
    password: 'Sunita@1974',
    age: 52,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'School Principal',
    blockNumber: 'Block D',
    houseOrFlatNo: 'House 102',
    unitNumber: 'Block D - House 102',
    phone: '+91 98440 66778',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Owner)',
    status: 'Verified',
    avatarStyle: 'smile',
    joinedDate: 'Mar 2023',
    emergencyContact: '+91 98440 66770',
    badges: ['Senior Citizen Club', 'Floor Marshall']
  },
  {
    id: 'gc-pend-1',
    name: 'Arjun Nambiar',
    email: 'arjun.n@gmail.com',
    password: 'ArjunN#123',
    age: 31,
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    communityId: 'colony-gandhi',
    communityName: 'Gandhi Colony',
    occupation: 'Banking Professional',
    blockNumber: 'Block B',
    houseOrFlatNo: 'Flat 301',
    unitNumber: 'Block B - Flat 301',
    phone: '+91 98990 12345',
    type: 'resident',
    role: 'citizen',
    designation: 'New Tenant Applicant',
    status: 'Pending Approval',
    avatarStyle: 'classic',
    joinedDate: 'Oct 2026',
    emergencyContact: '+91 98990 12340',
    badges: ['Verification In Progress']
  },

  // =========================================================
  // 2. SHAYAM NAGAR (Code: SN-202)
  // =========================================================
  {
    id: 'sn-admin-1',
    name: 'Ekjyot Kaur',
    email: 'ekjyot@gmail.com',
    password: 'ekjyot123',
    age: 19,
    society: 'Shayam Nagar',
    societyCode: 'SN-202',
    communityId: 'colony-shayam',
    communityName: 'Shayam Nagar',
    occupation: 'Software Engineer',
    blockNumber: 'Block A',
    houseOrFlatNo: 'House 1',
    unitNumber: 'Block A - House 1',
    phone: '+91 98765 43210',
    type: 'member',
    role: 'authority',
    designation: 'RWA President',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Feb 2024',
    emergencyContact: '+91 98765 43210',
    badges: ['Board President', 'Civic Council']
  },
  {
    id: 'sn-mem-2',
    name: 'Harish Batra',
    email: 'harish.b@sociosphere.io',
    password: 'Batra@1980',
    age: 46,
    society: 'Shayam Nagar',
    societyCode: 'SN-202',
    communityId: 'colony-shayam',
    communityName: 'Shayam Nagar',
    occupation: 'Electrical Consultant',
    blockNumber: 'Block B',
    houseOrFlatNo: 'Flat 204',
    unitNumber: 'Block B - Flat 204',
    phone: '+91 98114 55667',
    type: 'member',
    role: 'authority',
    designation: 'Infrastructure Coordinator',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Mar 2024',
    emergencyContact: '+91 98114 55660',
    badges: ['Works Committee', 'Solar & Power Lead']
  },
  {
    id: 'sn-mem-3',
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@sociosphere.io',
    password: 'DrAnanya@504',
    age: 39,
    society: 'Shayam Nagar',
    societyCode: 'SN-202',
    communityId: 'colony-shayam',
    communityName: 'Shayam Nagar',
    occupation: 'Pediatrician',
    blockNumber: 'Block C',
    houseOrFlatNo: 'Flat 504',
    unitNumber: 'Block C - Flat 504',
    phone: '+91 98711 99882',
    type: 'member',
    role: 'authority',
    designation: 'Health & Sanitation Convener',
    status: 'Verified',
    avatarStyle: 'nature',
    joinedDate: 'May 2024',
    emergencyContact: '+91 98711 99880',
    badges: ['Health Committee', 'Green Champion']
  },
  {
    id: 'sn-res-1',
    name: 'Kabir Verma',
    email: 'kabir.v@techcorp.in',
    password: 'KabirV@703#',
    age: 35,
    society: 'Shayam Nagar',
    societyCode: 'SN-202',
    communityId: 'colony-shayam',
    communityName: 'Shayam Nagar',
    occupation: 'Financial Consultant',
    blockNumber: 'Block A',
    houseOrFlatNo: 'Flat 703',
    unitNumber: 'Block A - Flat 703',
    phone: '+91 98550 88990',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Tenant)',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Aug 2024',
    emergencyContact: '+91 98550 88991',
    badges: ['Verified Resident', 'EV Enthusiast']
  },
  {
    id: 'sn-res-2',
    name: 'Fatima Sheikh',
    email: 'fatima.s@gmail.com',
    password: 'Fatima@1998!',
    age: 28,
    society: 'Shayam Nagar',
    societyCode: 'SN-202',
    communityId: 'colony-shayam',
    communityName: 'Shayam Nagar',
    occupation: 'Journalist',
    blockNumber: 'Block B',
    houseOrFlatNo: 'Flat 102',
    unitNumber: 'Block B - Flat 102',
    phone: '+91 98660 33445',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Owner)',
    status: 'Verified',
    avatarStyle: 'sparkle',
    joinedDate: 'May 2023',
    emergencyContact: '+91 98660 33440',
    badges: ['Cultural Lead', 'Verified Resident']
  },
  {
    id: 'sn-res-3',
    name: 'Gurpreet Singh',
    email: 'gurpreet.s@gmail.com',
    password: 'Gurpreet#1984',
    age: 42,
    society: 'Shayam Nagar',
    societyCode: 'SN-202',
    communityId: 'colony-shayam',
    communityName: 'Shayam Nagar',
    occupation: 'Logistics Manager',
    blockNumber: 'Block C',
    houseOrFlatNo: 'House 14',
    unitNumber: 'Block C - House 14',
    phone: '+91 98720 11445',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Owner)',
    status: 'Verified',
    avatarStyle: 'smile',
    joinedDate: 'Feb 2023',
    emergencyContact: '+91 98720 11440',
    badges: ['Verified Resident', 'Neighborhood Watch']
  },
  {
    id: 'sn-pend-1',
    name: 'Deepak Chopra',
    email: 'deepak.c@gmail.com',
    password: 'Chopra@202#',
    age: 36,
    society: 'Shayam Nagar',
    societyCode: 'SN-202',
    communityId: 'colony-shayam',
    communityName: 'Shayam Nagar',
    occupation: 'E-Commerce Merchant',
    blockNumber: 'Block A',
    houseOrFlatNo: 'Flat 202',
    unitNumber: 'Block A - Flat 202',
    phone: '+91 98115 77665',
    type: 'resident',
    role: 'citizen',
    designation: 'New Resident Applicant',
    status: 'Pending Approval',
    avatarStyle: 'classic',
    joinedDate: 'Oct 2026',
    emergencyContact: '+91 98115 77660',
    badges: ['Approval Pending']
  },

  // =========================================================
  // 3. DALIMA VIHAR (Code: DV-303)
  // =========================================================
  {
    id: 'dv-admin-1',
    name: 'Lt. Gen. R. K. Oberoi',
    email: 'admin.dalima@sociosphere.io',
    password: 'Admin@DV303',
    age: 62,
    society: 'Dalima Vihar',
    societyCode: 'DV-303',
    communityId: 'colony-dalima',
    communityName: 'Dalima Vihar',
    occupation: 'Retired Defense Officer & Society President',
    blockNumber: 'Tower A',
    houseOrFlatNo: 'Penthouse 1',
    unitNumber: 'Tower A - Penthouse 1',
    phone: '+91 98140 00112',
    type: 'member',
    role: 'authority',
    designation: 'RWA President',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Jan 2023',
    emergencyContact: '+91 98140 00110',
    badges: ['Board President', 'Security & Safety Lead']
  },
  {
    id: 'dv-mem-2',
    name: 'Shalini Murthy',
    email: 'shalini.m@sociosphere.io',
    password: 'Shalini@1983',
    age: 43,
    society: 'Dalima Vihar',
    societyCode: 'DV-303',
    communityId: 'colony-dalima',
    communityName: 'Dalima Vihar',
    occupation: 'Corporate Counsel',
    blockNumber: 'Block B',
    houseOrFlatNo: 'Flat 303',
    unitNumber: 'Block B - Flat 303',
    phone: '+91 98150 44332',
    type: 'member',
    role: 'authority',
    designation: 'General Secretary',
    status: 'Verified',
    avatarStyle: 'sparkle',
    joinedDate: 'Apr 2024',
    emergencyContact: '+91 98150 44330',
    badges: ['Secretary', 'Legal Affairs']
  },
  {
    id: 'dv-mem-3',
    name: 'Alok Srivastava',
    email: 'alok.s@sociosphere.io',
    password: 'AlokS@102!',
    age: 47,
    society: 'Dalima Vihar',
    societyCode: 'DV-303',
    communityId: 'colony-dalima',
    communityName: 'Dalima Vihar',
    occupation: 'Bank Branch Manager',
    blockNumber: 'Block C',
    houseOrFlatNo: 'Flat 102',
    unitNumber: 'Block C - Flat 102',
    phone: '+91 98160 55443',
    type: 'member',
    role: 'authority',
    designation: 'Treasurer',
    status: 'Verified',
    avatarStyle: 'classic',
    joinedDate: 'Mar 2024',
    emergencyContact: '+91 98160 55440',
    badges: ['Finance Head', 'Maintenance Oversight']
  },
  {
    id: 'dv-res-1',
    name: 'Vikramaditya Rathore',
    email: 'vikram.r@gmail.com',
    password: 'Vikram#P1#',
    age: 38,
    society: 'Dalima Vihar',
    societyCode: 'DV-303',
    communityId: 'colony-dalima',
    communityName: 'Dalima Vihar',
    occupation: 'Solar Energy Entrepreneur',
    blockNumber: 'Block A',
    houseOrFlatNo: 'Penthouse P1',
    unitNumber: 'Block A - Penthouse P1',
    phone: '+91 98770 55667',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Owner)',
    status: 'Verified',
    avatarStyle: 'shield',
    joinedDate: 'Jan 2023',
    emergencyContact: '+91 98770 55660',
    badges: ['Solar Pioneer', 'Verified Resident']
  },
  {
    id: 'dv-res-2',
    name: 'Neha Kapoor',
    email: 'neha.k@designstudio.co',
    password: 'NehaK@2000',
    age: 26,
    society: 'Dalima Vihar',
    societyCode: 'DV-303',
    communityId: 'colony-dalima',
    communityName: 'Dalima Vihar',
    occupation: 'UI/UX Designer',
    blockNumber: 'Block B',
    houseOrFlatNo: 'Flat 204',
    unitNumber: 'Block B - Flat 204',
    phone: '+91 98880 77889',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Tenant)',
    status: 'Verified',
    avatarStyle: 'smile',
    joinedDate: 'Dec 2024',
    emergencyContact: '+91 98880 77880',
    badges: ['Verified Resident', 'Creative Arts']
  },
  {
    id: 'dv-res-3',
    name: 'Tariq Mansoor',
    email: 'tariq.m@yahoo.com',
    password: 'Tariq@401#',
    age: 45,
    society: 'Dalima Vihar',
    societyCode: 'DV-303',
    communityId: 'colony-dalima',
    communityName: 'Dalima Vihar',
    occupation: 'College Professor',
    blockNumber: 'Block C',
    houseOrFlatNo: 'Flat 401',
    unitNumber: 'Block C - Flat 401',
    phone: '+91 98170 88990',
    type: 'resident',
    role: 'citizen',
    designation: 'Resident (Owner)',
    status: 'Verified',
    avatarStyle: 'nature',
    joinedDate: 'Oct 2023',
    emergencyContact: '+91 98170 88991',
    badges: ['Education Lead', 'Verified Resident']
  },
  {
    id: 'dv-pend-1',
    name: 'Deepa Chawla',
    email: 'deepa.c@yahoo.com',
    password: 'DeepaC@1989',
    age: 37,
    society: 'Dalima Vihar',
    societyCode: 'DV-303',
    communityId: 'colony-dalima',
    communityName: 'Dalima Vihar',
    occupation: 'Senior Content Strategist',
    blockNumber: 'Block D',
    houseOrFlatNo: 'Flat 403',
    unitNumber: 'Block D - Flat 403',
    phone: '+91 98110 54321',
    type: 'resident',
    role: 'citizen',
    designation: 'New Flat Owner',
    status: 'Pending Approval',
    avatarStyle: 'smile',
    joinedDate: 'Oct 2026',
    emergencyContact: '+91 98110 54320',
    badges: ['Registry Verification Pending']
  }
];

// Pre-mapped human passwords for updating cached data
const DEFAULT_PASSWORDS = DEFAULT_USERS.reduce((acc, user) => {
  acc[user.id] = user.password;
  acc[user.email.toLowerCase()] = user.password;
  return acc;
}, {
  'admin@sociosphere.io': 'vansh12345',
  'ekjyot@gmail.com': 'ekjyot123',
  'admin.shayam@sociosphere.io': 'ekjyot123'
});

export const getUsers = (societyFilter) => {
  let stored = null;
  if (typeof localStorage !== 'undefined') {
    stored = localStorage.getItem('sociosphere_users');
  }
  let userList = DEFAULT_USERS;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.some(u => u.societyCode === 'GC-101')) {
        let needsSave = false;
        userList = parsed.map(u => {
          // If admin profile needs upgrade to Vansh Goyal (Gandhi Colony - One and only admin)
          if (u.id === 'gc-admin-1') {
            if (u.name !== 'Vansh Goyal' || u.email !== 'goyalvansh63708@gmail.com' || u.password !== 'vansh12345') {
              needsSave = true;
              return {
                ...u,
                name: 'Vansh Goyal',
                email: 'goyalvansh63708@gmail.com',
                password: 'vansh12345',
                age: 20,
                occupation: 'Software Engineer',
                blockNumber: 'Block A',
                houseOrFlatNo: 'Flat 707',
                unitNumber: 'Block A - Flat 707',
                phone: '+91 90412 08572',
                designation: 'RWA President (Flat Owner)',
                emergencyContact: '+91 90412 08572',
                badges: ['Board President', 'System Administrator', 'Flat Owner', 'Tech Lead']
              };
            }
          }

          // If Shayam Nagar admin profile needs upgrade to Ekjyot Kaur
          if (u.id === 'sn-admin-1' || u.email === 'admin.shayam@sociosphere.io' || u.email === 'ekjyot@gmail.com') {
            if (u.name !== 'Ekjyot Kaur' || u.email !== 'ekjyot@gmail.com' || u.password !== 'ekjyot123' || u.age !== 19 || u.occupation !== 'Software Engineer') {
              needsSave = true;
              return {
                ...u,
                id: 'sn-admin-1',
                name: 'Ekjyot Kaur',
                email: 'ekjyot@gmail.com',
                password: 'ekjyot123',
                age: 19,
                society: 'Shayam Nagar',
                societyCode: 'SN-202',
                communityId: 'colony-shayam',
                communityName: 'Shayam Nagar',
                occupation: 'Software Engineer',
                blockNumber: 'Block A',
                houseOrFlatNo: 'House 1',
                unitNumber: 'Block A - House 1',
                phone: '+91 98765 43210',
                type: 'member',
                role: 'authority',
                designation: 'RWA President',
                status: 'Verified',
                emergencyContact: '+91 98765 43210',
                badges: ['Board President', 'Civic Council']
              };
            }
          }

          // If user still has the generic placeholder password or out-of-date password, update with their realistic human password
          const defaultHumanPass = DEFAULT_PASSWORDS[u.id] || DEFAULT_PASSWORDS[(u.email || '').toLowerCase()];
          if (defaultHumanPass && u.password !== defaultHumanPass && (u.id.startsWith('gc-') || u.id.startsWith('sn-') || u.id.startsWith('dv-') || u.password === 'password123')) {
            needsSave = true;
            return {
              ...u,
              password: defaultHumanPass
            };
          }
          return u;
        });

        if (needsSave && typeof localStorage !== 'undefined') {
          localStorage.setItem('sociosphere_users', JSON.stringify(userList));
        }
      } else {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('sociosphere_users', JSON.stringify(DEFAULT_USERS));
        }
        userList = DEFAULT_USERS;
      }
    } catch (err) {
      console.error('Failed to parse users:', err);
      userList = DEFAULT_USERS;
    }
  } else {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('sociosphere_users', JSON.stringify(DEFAULT_USERS));
    }
  }

  if (societyFilter && societyFilter !== 'all') {
    const filterLower = societyFilter.toLowerCase().trim();
    return userList.filter(u => 
      (u.society || '').toLowerCase() === filterLower ||
      (u.communityName || '').toLowerCase() === filterLower ||
      (u.societyCode || '').toLowerCase() === filterLower
    );
  }

  return userList;
};

export const saveUsers = (users) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('sociosphere_users', JSON.stringify(users));
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sociosphere_users_updated'));
    window.dispatchEvent(new Event('sociosphere_data_updated'));
  }
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  const normalized = (email || '').trim().toLowerCase();
  return users.find(u => u.email.toLowerCase() === normalized);
};

export const authenticateUser = (identifier, password) => {
  const users = getUsers();
  const idLower = (identifier || '').trim().toLowerCase();
  const cleanIdPhone = idLower.replace(/\D/g, '');

  // Find user by email, username, phone, or name
  const foundUser = users.find(u => {
    const userEmail = (u.email || '').toLowerCase();
    const userName = (u.name || '').toLowerCase();
    const userPhoneClean = (u.phone || '').replace(/\D/g, '');

    return (
      userEmail === idLower ||
      (idLower === 'admin@sociosphere.io' && u.id === 'gc-admin-1') ||
      userName === idLower ||
      (cleanIdPhone.length >= 10 && userPhoneClean.includes(cleanIdPhone))
    );
  });

  if (!foundUser) {
    return {
      success: false,
      error: 'No account found with this email / identifier. Please check your spelling or sign up.'
    };
  }

  // Password verification: strictly matches user's specific realistic password
  const expectedPassword = foundUser.password || DEFAULT_PASSWORDS[foundUser.id] || DEFAULT_PASSWORDS[foundUser.email.toLowerCase()] || 'password123';
  if (password !== expectedPassword) {
    return {
      success: false,
      error: 'Incorrect password. Please verify your credentials and try again.'
    };
  }

  // Check if pending verification by society admin
  if (foundUser.status === 'Pending Approval') {
    const isAuth = foundUser.role === 'authority' || foundUser.type === 'member';
    return {
      success: false,
      isPending: true,
      user: foundUser,
      error: isAuth
        ? `Your administrative access request for ${foundUser.society || foundUser.communityName} is currently awaiting verification from the Society Board / RWA President.`
        : `Your registration request for ${foundUser.society || foundUser.communityName} is currently awaiting Society Admin approval.`
    };
  }

  return {
    success: true,
    user: foundUser
  };
};

export const registerUser = (userData) => {
  const users = getUsers();
  const emailLower = (userData.email || '').trim().toLowerCase();

  const existing = users.find(u => u.email.toLowerCase() === emailLower);
  if (existing) {
    return {
      success: false,
      error: `An account with email "${userData.email}" already exists in the database.`
    };
  }

  const id = `user-${Date.now().toString().slice(-6)}`;
  const isAuthority = userData.role === 'authority' || userData.type === 'member';

  const newUser = {
    ...userData,
    id,
    email: emailLower,
    password: userData.password || `${(userData.name || 'User').split(' ')[0]}@${userData.age || '2026'}#`,
    age: parseInt(userData.age, 10) || 30,
    status: userData.status || 'Pending Approval',
    type: userData.type || (isAuthority ? 'member' : 'resident'),
    role: isAuthority ? 'authority' : 'citizen',
    unitNumber: userData.unitNumber || `${userData.blockNumber || 'Block A'} - ${userData.houseOrFlatNo || 'Unit 1'}`,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    badges: isAuthority ? ['Authority Request Pending'] : ['Verification In Progress']
  };

  const updated = [newUser, ...users];
  saveUsers(updated);

  return {
    success: true,
    user: newUser
  };
};

export const addUser = (newUser) => {
  const result = registerUser({
    ...newUser,
    status: 'Verified'
  });
  return result.user || newUser;
};

export const approveUser = (userId) => {
  const users = getUsers();
  let approvedUser = null;
  const updated = users.map(user => {
    if (user.id === userId) {
      const isAuth = user.role === 'authority' || user.type === 'member';
      const updatedBadges = (user.badges || []).map(b => 
        b.includes('Pending') || b.includes('Progress') 
          ? (isAuth ? 'Committee Member' : 'Verified Resident') 
          : b
      );
      if (updatedBadges.length === 0) {
        updatedBadges.push(isAuth ? 'Committee Member' : 'Verified Resident');
      }
      approvedUser = {
        ...user,
        status: 'Verified',
        badges: updatedBadges
      };
      return approvedUser;
    }
    return user;
  });
  saveUsers(updated);

  // Sync with cached accounts if present
  if (approvedUser && approvedUser.email) {
    try {
      const accounts = JSON.parse(localStorage.getItem('sociosphere_accounts') || '{}');
      const emailKey = approvedUser.email.trim().toLowerCase();
      if (accounts[emailKey]) {
        accounts[emailKey] = {
          ...accounts[emailKey],
          status: 'Verified',
          badges: approvedUser.badges
        };
        localStorage.setItem('sociosphere_accounts', JSON.stringify(accounts));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return { success: true, user: approvedUser, users: updated };
};

export const updateUser = (userId, updatedFields) => {
  const users = getUsers();
  let updatedRecord = null;
  const updated = users.map(user => {
    if (
      user.id === userId || 
      (user.email && updatedFields.email && user.email.toLowerCase() === updatedFields.email.toLowerCase())
    ) {
      updatedRecord = {
        ...user,
        ...updatedFields
      };
      return updatedRecord;
    }
    return user;
  });
  if (updatedRecord) {
    saveUsers(updated);
  }
  return updatedRecord;
};

export const deleteUser = (userId) => {
  const users = getUsers();
  const updated = users.filter(u => u.id !== userId);
  saveUsers(updated);
  return updated;
};
