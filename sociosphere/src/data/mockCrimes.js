export const STORAGE_KEY = 'sociosphere_crimes_v2';

export const INITIAL_CRIMES = [
  {
    id: "CRM-2026-84721",
    title: "Chain Snatching Incident",
    category: "Theft & Burglary",
    categoryValue: "theft",
    description: "Two individuals on a black motorcycle snatched a gold chain from a senior resident near the Central Promenade. They fled towards Gate 2.",
    location: "Gandhi Colony - Sector 4, Central Promenade (Near Block A Park)",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colony: "Gandhi Colony",
    colonyName: "Gandhi Colony",
    communityName: "Gandhi Colony",
    communityId: "colony-gandhi",
    priority: "CRITICAL PRIORITY",
    priorityClass: "critical",
    status: "Resolved",
    statusClass: "success",
    date: "Sep 15, 2026, 06:45 PM",
    timestamp: "2026-09-15T18:45:00.000Z",
    eta: "Police Report Filed",
    reporterName: "Rajesh Kumar",
    reportedBy: "Rajesh Kumar",
    reportedByEmail: "rajesh.k@sociosphere.io",
    timeline: [
      { step: "Reported", date: "9/15/2026, 6:45:00 PM", note: "Incident logged into Gandhi Colony security portal." },
      { step: "In Progress", date: "9/15/2026, 6:50:00 PM", note: "Security dispatched. Gate 2 CCTV reviewed." },
      { step: "Resolved", date: "9/16/2026, 10:30:00 AM", note: "Local police apprehended the suspects using CCTV footage. Case handed over to law enforcement." }
    ]
  },
  {
    id: "CRM-2026-39204",
    title: "Suspicious Activity & Loitering",
    category: "Suspicious Activity",
    categoryValue: "suspicious",
    description: "An unidentified person has been loitering near the Block B basement parking for the last 30 minutes, looking into parked cars.",
    location: "Gandhi Colony - Block B Basement Parking (Pillar 12)",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colony: "Gandhi Colony",
    colonyName: "Gandhi Colony",
    communityName: "Gandhi Colony",
    communityId: "colony-gandhi",
    priority: "MEDIUM PRIORITY",
    priorityClass: "medium",
    status: "In Progress",
    statusClass: "progress",
    date: "Sep 17, 2026, 08:15 AM",
    timestamp: "2026-09-17T08:15:00.000Z",
    eta: "Guard Patrolling",
    reporterName: "Priya Patel",
    reportedBy: "Priya Patel",
    reportedByEmail: "priya.p@sociosphere.io",
    timeline: [
      { step: "Reported", date: "9/17/2026, 8:15:00 AM", note: "Resident reported suspicious individual in Gandhi Colony Block B." },
      { step: "In Progress", date: "9/17/2026, 8:20:00 AM", note: "Patrol unit checking basement B2." }
    ]
  },
  {
    id: "CRM-2026-15923",
    title: "Attempted Apartment Break-in",
    category: "Theft & Burglary",
    categoryValue: "theft",
    description: "Lock tampering noticed on flat C-404. Deep scratch marks found on the door lock mechanism. Nothing stolen as residents were inside and made noise.",
    location: "Gandhi Colony - Block C, 4th Floor (Flat C-404)",
    society: "Gandhi Colony",
    societyCode: "GC-101",
    colony: "Gandhi Colony",
    colonyName: "Gandhi Colony",
    communityName: "Gandhi Colony",
    communityId: "colony-gandhi",
    priority: "HIGH PRIORITY",
    priorityClass: "high",
    status: "Pending",
    statusClass: "pending",
    date: "Sep 16, 2026, 11:30 PM",
    timestamp: "2026-09-16T23:30:00.000Z",
    eta: "Security Dispatched",
    reporterName: "Simran Kaur",
    reportedBy: "Simran Kaur",
    reportedByEmail: "simran.k@sociosphere.io",
    timeline: [
      { step: "Reported", date: "9/16/2026, 11:30:00 PM", note: "Resident reported lock damage in Block C." }
    ]
  }
];

const normalizeCrimeToColony = (crime) => {
  if (
    !crime.society ||
    crime.colony === 'Green Meadows Heights' ||
    crime.society === 'Green Meadows Heights' ||
    crime.colonyName === 'Green Meadows Heights' ||
    !crime.societyCode
  ) {
    return {
      ...crime,
      society: 'Gandhi Colony',
      societyCode: 'GC-101',
      colony: 'Gandhi Colony',
      colonyName: 'Gandhi Colony',
      communityName: 'Gandhi Colony',
      communityId: 'colony-gandhi'
    };
  }
  return crime;
};

export const getCrimes = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let crimesList;

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CRIMES));
    return INITIAL_CRIMES;
  }

  try {
    crimesList = JSON.parse(stored);
    if (!Array.isArray(crimesList) || crimesList.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CRIMES));
      return INITIAL_CRIMES;
    }

    let hasChanges = false;
    const normalized = crimesList.map(crime => {
      const updated = normalizeCrimeToColony(crime);
      if (updated !== crime) hasChanges = true;
      return updated;
    });

    if (hasChanges) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    return normalized;
  } catch (e) {
    console.error('Failed to parse stored crimes:', e);
    return INITIAL_CRIMES;
  }
};

export const saveCrimes = (crimes) => {
  const normalized = crimes.map(normalizeCrimeToColony);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event('sociosphere_crimes_updated'));
};

export const deleteCrime = (crimeId) => {
  const crimes = getCrimes().filter((crime) => crime.id !== crimeId);
  saveCrimes(crimes);

  const reports = JSON.parse(
    localStorage.getItem('sociosphere_user_reports') || '[]'
  );
  localStorage.setItem(
    'sociosphere_user_reports',
    JSON.stringify(reports.filter((report) => report.id !== crimeId))
  );
  window.dispatchEvent(new Event('sociosphere_data_updated'));
  return crimes;
};

export const addCrime = (newCrime) => {
  const crimes = getCrimes();
  const normalizedNewCrime = normalizeCrimeToColony(newCrime);
  const updated = [normalizedNewCrime, ...crimes];
  saveCrimes(updated);
  return normalizedNewCrime;
};

export const updateCrimeStatus = (crimeId, newStatus, note = '') => {
  const crimes = getCrimes();
  const updated = crimes.map((crime) => {
    if (crime.id === crimeId) {
      const newTimeline = [
        ...(crime.timeline || []),
        {
          step: newStatus,
          date: new Date().toLocaleString(),
          note: note || `Security status updated to ${newStatus}`
        }
      ];

      return {
        ...crime,
        status: newStatus,
        statusClass: newStatus === 'Resolved' ? 'success' : newStatus === 'In Progress' ? 'progress' : 'pending',
        updatedAt: new Date().toISOString(),
        timeline: newTimeline
      };
    }
    return crime;
  });

  saveCrimes(updated);

  // Sync with user reports cache so Citizen Home updates correctly
  const reports = JSON.parse(localStorage.getItem('sociosphere_user_reports') || '[]');
  const updatedReports = reports.map(report => {
    if (report.id === crimeId) {
      const updatedCrime = updated.find(c => c.id === crimeId);
      return { ...report, ...updatedCrime };
    }
    return report;
  });
  localStorage.setItem('sociosphere_user_reports', JSON.stringify(updatedReports));
  window.dispatchEvent(new Event('sociosphere_data_updated'));

  return updated;
};
