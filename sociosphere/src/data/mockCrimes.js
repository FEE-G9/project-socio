export const STORAGE_KEY = 'sociosphere_crimes_v2';

export const INITIAL_CRIMES = [
  {
    id: "CRM-2026-84721",
    title: "Chain Snatching Incident",
    category: "Theft & Burglary",
    categoryValue: "theft",
    description: "Two individuals on a black motorcycle snatched a gold chain from a senior resident near the Central Promenade. They fled towards Gate 2.",
    location: "Sector 4 - Central Promenade (Near Park)",
    priority: "CRITICAL PRIORITY",
    priorityClass: "critical",
    status: "Resolved",
    statusClass: "success",
    date: "Sep 15, 2026, 06:45 PM",
    timestamp: "2026-09-15T18:45:00.000Z",
    eta: "Police Report Filed",
    reporterName: "Rajesh Kumar",
    timeline: [
      { step: "Reported", date: "9/15/2026, 6:45:00 PM", note: "Incident logged into security portal." },
      { step: "In Progress", date: "9/15/2026, 6:50:00 PM", note: "Security dispatched. Gate 2 CCTV reviewed." },
      { step: "Resolved", date: "9/16/2026, 10:30:00 AM", note: "Local police apprehended the suspects using CCTV footage. Case handed over to law enforcement." }
    ]
  },
  {
    id: "CRM-2026-39204",
    title: "Suspicious Activity & Loitering",
    category: "Suspicious Activity",
    categoryValue: "suspicious",
    description: "An unidentified person has been loitering near the B-Block basement parking for the last 30 minutes, looking into parked cars.",
    location: "B-Block Basement Parking (Pillar 12)",
    priority: "MEDIUM PRIORITY",
    priorityClass: "medium",
    status: "In Progress",
    statusClass: "progress",
    date: "Sep 17, 2026, 08:15 AM",
    timestamp: "2026-09-17T08:15:00.000Z",
    eta: "Guard Patrolling",
    reporterName: "",
    timeline: [
      { step: "Reported", date: "9/17/2026, 8:15:00 AM", note: "Anonymous resident reported suspicious individual." },
      { step: "In Progress", date: "9/17/2026, 8:20:00 AM", note: "Patrol unit checking basement B2." }
    ]
  },
  {
    id: "CRM-2026-15923",
    title: "Attempted Apartment Break-in",
    category: "Theft & Burglary",
    categoryValue: "theft",
    description: "Lock tampering noticed on flat C-404. Deep scratch marks found on the door lock mechanism. Nothing stolen as residents were inside and made noise.",
    location: "Block C, 4th Floor (C-404)",
    priority: "HIGH PRIORITY",
    priorityClass: "high",
    status: "Pending",
    statusClass: "pending",
    date: "Sep 16, 2026, 11:30 PM",
    timestamp: "2026-09-16T23:30:00.000Z",
    eta: "Security Dispatched",
    reporterName: "Simran Kaur",
    timeline: [
      { step: "Reported", date: "9/16/2026, 11:30:00 PM", note: "Resident reported lock damage." }
    ]
  }
];

export const getCrimes = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CRIMES));
    return INITIAL_CRIMES;
  }
  return JSON.parse(stored);
};

export const saveCrimes = (crimes) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(crimes));
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
  const updated = [newCrime, ...crimes];
  saveCrimes(updated);
  return newCrime;
};

export const updateCrimeStatus = (crimeId, newStatus, note = '') => {
  const crimes = getCrimes();
  const updated = crimes.map(crm => {
    if (crm.id === crimeId) {
      const newTimeline = crm.timeline ? [...crm.timeline] : [];
      newTimeline.push({ step: newStatus, date: new Date().toLocaleString(), note: note || `Status updated to ${newStatus}` });
      
      let newClass = crm.statusClass;
      if (newStatus === "Resolved") newClass = "success";
      else if (newStatus === "In Progress") newClass = "progress";
      else if (newStatus === "Pending") newClass = "pending";

      return { ...crm, status: newStatus, statusClass: newClass, timeline: newTimeline };
    }
    return crm;
  });
  saveCrimes(updated);
  return updated;
};
