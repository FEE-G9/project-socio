// SocioSphere Community Lost & Found Repository & Mock Database
// Synchronizes with localStorage key: 'sociosphere_lost_found'

export const INITIAL_LOST_FOUND_ITEMS = [
  {
    id: "LF-201",
    type: "lost",
    title: "Black Leather Fossil Wallet with ID & Cards",
    category: "Wallets & IDs",
    status: "open",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colonyId: "colony-gandhi",
    colonyName: "Gandhi Colony",
    location: "Central Park Walkway, near Children Play Area",
    date: "2026-10-18",
    description: "Lost my brown-black Fossil leather bi-fold wallet during the evening walk. Contains Punjab Driving License in name of Aarav Sharma, SBI Debit card, and apartment key card.",
    reportedBy: "Aarav Sharma",
    reportedByEmail: "aarav.sharma@gmail.com",
    reportedById: "gc-res-1",
    reporterAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98765 43210",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    reward: "₹1,000 Cash Reward",
    securityHint: "Initials A.S. embossed on interior card slot",
    claims: [],
    comments: [
      {
        id: "c-101",
        author: "Priya Patel",
        authorEmail: "priya.p@sociosphere.io",
        text: "I saw someone inquiring with the park gardener about a black wallet yesterday around 6 PM!",
        createdAt: "2026-10-18T19:20:00Z",
      },
    ],
    createdAt: "2026-10-18T18:30:00Z",
    updatedAt: "2026-10-18T19:20:00Z",
  },
  {
    id: "LF-202",
    type: "found",
    title: "Set of 3 House Keys with Marvel Shield Keychain",
    category: "Keys",
    status: "open",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colonyId: "colony-gandhi",
    colonyName: "Gandhi Colony",
    location: "Block B Ground Floor Elevator Entrance",
    date: "2026-10-19",
    description: "Found a bunch of 3 silver Godrej keys attached to an iron ring with a Captain America brass shield fob. Kept safe with me or can be handed to Block B security desk upon proof.",
    reportedBy: "Meenakshi Sundaram",
    reportedByEmail: "meenakshi.s@sociosphere.io",
    reportedById: "gc-mem-3",
    reporterAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98112 33445",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    reward: null,
    securityHint: "Owner must state the 4-digit code etched on the main key",
    claims: [],
    comments: [],
    createdAt: "2026-10-19T09:15:00Z",
    updatedAt: "2026-10-19T09:15:00Z",
  },
  {
    id: "LF-203",
    type: "lost",
    title: "Golden Retriever Puppy with Red Collar (Answers to 'Leo')",
    category: "Pets",
    status: "open",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colonyId: "colony-gandhi",
    colonyName: "Gandhi Colony",
    location: "Slipped out of Villa 42 gate towards East Perimeter",
    date: "2026-10-20",
    description: "Our 8-month-old golden retriever Leo got startled by thunder and slipped past the side gate around 6:30 PM. Very friendly and loves children. Has red reflective collar with vaccination tag.",
    reportedBy: "Rohan Verma",
    reportedByEmail: "rohan.verma@sociosphere.io",
    reportedById: "gc-res-5",
    reporterAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98888 12345",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",
    reward: "₹2,500 Reward",
    securityHint: "Small white birthmark patch on left front paw",
    claims: [],
    comments: [
      {
        id: "c-102",
        author: "Vansh Goyal",
        authorEmail: "goyalvansh63708@gmail.com",
        text: "Informed security guard command center. East gate cameras are actively being checked.",
        createdAt: "2026-10-20T19:00:00Z",
      },
    ],
    createdAt: "2026-10-20T18:45:00Z",
    updatedAt: "2026-10-20T19:00:00Z",
  },
  {
    id: "LF-204",
    type: "found",
    title: "Apple AirPods Pro (2nd Gen) in MagSafe Case",
    category: "Electronics",
    status: "open",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colonyId: "colony-gandhi",
    colonyName: "Gandhi Colony",
    location: "Clubhouse Gymnasium - Treadmill #3 Tray",
    date: "2026-10-17",
    description: "Left behind on the cardio treadmill tray around 8:00 AM workout session. In pristine white charging case. Currently placed safely in clubhouse reception desk with manager.",
    reportedBy: "Kavita Chawla",
    reportedByEmail: "kavita.c@sociosphere.io",
    reportedById: "gc-res-8",
    reporterAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    phone: "+91 97777 65432",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80",
    reward: null,
    securityHint: "Case bluetooth device name matches owner Apple ID",
    claims: [],
    comments: [],
    createdAt: "2026-10-17T08:30:00Z",
    updatedAt: "2026-10-17T08:30:00Z",
  },
  {
    id: "LF-205",
    type: "found",
    title: "Ray-Ban Aviator Sunglasses in Black Leather Case",
    category: "Accessories",
    status: "claimed",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colonyId: "colony-gandhi",
    colonyName: "Gandhi Colony",
    location: "Society Swimming Pool Sun Lounger area",
    date: "2026-10-15",
    description: "Classic gold-frame Ray-Ban sunglasses left on the wooden deck chair by poolside after Sunday evening swim.",
    reportedBy: "Vikram Malhotra",
    reportedByEmail: "vikram.m@sociosphere.io",
    reportedById: "gc-res-12",
    reporterAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98222 33441",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    reward: null,
    securityHint: "Cloth cleaner inside pouch has optical store logo",
    claims: [
      {
        id: "cl-201",
        claimantName: "Sunil Mehta",
        claimantEmail: "sunil.mehta@gmail.com",
        claimantPhone: "+91 98111 55667",
        proofDescription: "They are prescription polarized aviators bought from Lawrence & Mayo, cleaning cloth has blue logo.",
        status: "approved",
        createdAt: "2026-10-16T11:00:00Z",
      },
    ],
    comments: [],
    createdAt: "2026-10-15T18:00:00Z",
    updatedAt: "2026-10-16T14:00:00Z",
    resolvedAt: "2026-10-16T14:00:00Z",
    resolvedNote: "Handed over to verified owner Sunil Mehta (Flat 304)!",
  },
  {
    id: "LF-206",
    type: "lost",
    title: "Blue School Backpack (Wildcraft) with 4th Grade Books",
    category: "Bags & Luggage",
    status: "open",
    society: "Shayam Nagar",
    societyCode: "SN-202",
    colonyId: "colony-shayam",
    colonyName: "Shayam Nagar",
    location: "Society Bus Stop near Gate 1",
    date: "2026-10-19",
    description: "Wildcraft blue bag forgotten on the bench while boarding the DPS school bus. Contains class 4 notebooks, pencil box, and cartoon water bottle.",
    reportedBy: "Anita Desai",
    reportedByEmail: "anita.d@shayam.org",
    reportedById: "sn-res-4",
    reporterAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    phone: "+91 98333 44556",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    reward: "₹500 Reward",
    securityHint: "Child's name written on first page of Math notebook",
    claims: [],
    comments: [],
    createdAt: "2026-10-19T08:10:00Z",
    updatedAt: "2026-10-19T08:10:00Z",
  },
  {
    id: "LF-207",
    type: "found",
    title: "Hyundai Car Key Fob with Black Silicone Cover",
    category: "Keys",
    status: "open",
    society: "Dalima Vihar",
    societyCode: "DV-303",
    colonyId: "colony-dalima",
    colonyName: "Dalima Vihar",
    location: "Basement Parking B1, near Lift Lobby 3",
    date: "2026-10-18",
    description: "Found Hyundai Creta smart key fob lying near parking pillar #28. Has black silicone protective cover and a tiny silver charm.",
    reportedBy: "Harish Bakshi",
    reportedByEmail: "harish.b@dalima.org",
    reportedById: "dv-res-9",
    reporterAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    phone: "+91 99110 99887",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    reward: null,
    securityHint: "Owner must mention the initial on the silver charm",
    claims: [],
    comments: [],
    createdAt: "2026-10-18T16:20:00Z",
    updatedAt: "2026-10-18T16:20:00Z",
  },
];

const STORAGE_KEY = "sociosphere_lost_found";

export const getLostFoundItems = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return INITIAL_LOST_FOUND_ITEMS;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOST_FOUND_ITEMS));
    return INITIAL_LOST_FOUND_ITEMS;
  }

  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOST_FOUND_ITEMS));
    return INITIAL_LOST_FOUND_ITEMS;
  } catch (err) {
    console.error("Failed to parse lost & found storage:", err);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOST_FOUND_ITEMS));
    return INITIAL_LOST_FOUND_ITEMS;
  }
};

export const saveLostFoundItems = (items) => {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event("sociosphere_lostfound_updated"));
  } catch (err) {
    console.error("Failed to save lost & found items:", err);
  }
};
