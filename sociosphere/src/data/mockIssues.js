export const INITIAL_ISSUES = [
  {
    id: 'ISSUE-101',
    title: 'Main Avenue Water Pipeline Leakage near Block B Park',
    category: 'Water Supply & Plumbing',
    severity: 'High',
    status: 'In Progress',
    colonyId: 'colony-1',
    colonyName: 'Green Meadows Heights',
    reportedBy: 'Aarav Sharma',
    reportedByEmail: 'aarav@sociosphere.io',
    reporterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-05T09:30:00Z',
    updatedAt: '2026-09-06T14:15:00Z',
    location: 'Block B, Near Central Fountain',
    description: 'Clean drinking water is leaking profusely from the main pipeline connection. Water pressure in Block B apartments has dropped by 40%. Requires urgent plumbing repairs before water logging damages the park walkway.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    upvotes: 42,
    upvotedBy: ['aarav@sociosphere.io', 'priya@sociosphere.io'],
    aiAnalysis: {
      categoryDetected: 'Infrastructure / Plumbing Failure',
      severityScore: 88,
      suggestedPriority: 'Critical Urgent',
      assignedDepartment: 'Municipal Plumbing & Water Works',
      estimatedResolutionTime: '24 Hours',
      aiSummary: 'Computer Vision verified high-volume clean water pipe rupture. High priority due to local supply interruption.'
    },
    timeline: [
      { step: 'Reported', date: '2026-09-05 09:30 AM', note: 'Issue submitted by Aarav Sharma with geotagged photo evidence.' },
      { step: 'AI Classified', date: '2026-09-05 09:31 AM', note: 'AI routed complaint to Municipal Plumbing. Priority marked Critical.' },
      { step: 'Assigned', date: '2026-09-05 11:00 AM', note: 'Dispatched Senior Engineer Ramesh Kumar and maintenance squad.' },
      { step: 'In Progress', date: '2026-09-06 02:15 PM', note: 'Replacement pipe section delivered. Water main shut down for installation.' }
    ],
    comments: [
      { id: 'c1', author: 'Priya Patel', text: 'Thank you for reporting! Water pressure was very low this morning.', date: '2026-09-05T10:15:00Z' },
      { id: 'c2', author: 'Authority - Maintenance', text: 'Our team is on-site replacing the split joint valve.', date: '2026-09-06T14:20:00Z' }
    ]
  },
  {
    id: 'ISSUE-102',
    title: 'Broken Solar Streetlights along Perimeter Road',
    category: 'Electrical & Lighting',
    severity: 'Medium',
    status: 'Open',
    colonyId: 'colony-1',
    colonyName: 'Green Meadows Heights',
    reportedBy: 'Priya Patel',
    reportedByEmail: 'priya@sociosphere.io',
    reporterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-06T18:45:00Z',
    updatedAt: '2026-09-06T18:45:00Z',
    location: 'Perimeter Wall Gate 3 to Gate 4',
    description: 'Three consecutive solar streetlights have gone dark since yesterday evening. The stretch is dark during night hours posing safety concerns for senior residents taking evening walks.',
    image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    upvotes: 27,
    upvotedBy: ['priya@sociosphere.io'],
    aiAnalysis: {
      categoryDetected: 'Public Safety / Electrical Maintenance',
      severityScore: 65,
      suggestedPriority: 'Medium High',
      assignedDepartment: 'Society Electrical Grid Team',
      estimatedResolutionTime: '48 Hours',
      aiSummary: 'Likely battery failure or solar panel dust buildup on lamps #14, #15, #16.'
    },
    timeline: [
      { step: 'Reported', date: '2026-09-06 06:45 PM', note: 'Reported by Priya Patel.' },
      { step: 'AI Classified', date: '2026-09-06 06:46 PM', note: 'AI tagged as Electrical & Safety issue.' }
    ],
    comments: [
      { id: 'c3', author: 'Rohan Verma', text: 'Agree, it is very dark around Gate 3 after 8 PM.', date: '2026-09-06T19:10:00Z' }
    ]
  },
  {
    id: 'ISSUE-103',
    title: 'Uncollected Green Waste after Garden Pruning',
    category: 'Sanitation & Waste',
    severity: 'Low',
    status: 'Resolved',
    colonyId: 'colony-1',
    colonyName: 'Green Meadows Heights',
    reportedBy: 'Rohan Verma',
    reportedByEmail: 'rohan@sociosphere.io',
    reporterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-03T16:00:00Z',
    location: 'Community Center Lawn',
    description: 'Tree branches and garden clippings were left piled near the recycling bin area following seasonal tree trimming.',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    upvotes: 18,
    upvotedBy: [],
    aiAnalysis: {
      categoryDetected: 'Sanitation / Organic Waste Disposal',
      severityScore: 30,
      suggestedPriority: 'Standard Routine',
      assignedDepartment: 'Horticulture & Waste Management',
      estimatedResolutionTime: '24 Hours',
      aiSummary: 'Organic waste heap requiring composting pickup vehicle.'
    },
    timeline: [
      { step: 'Reported', date: '2026-09-02 10:00 AM', note: 'Reported by Rohan Verma.' },
      { step: 'AI Classified', date: '2026-09-02 10:01 AM', note: 'Assigned to Sanitation truck.' },
      { step: 'In Progress', date: '2026-09-03 09:00 AM', note: 'Waste truck scheduled.' },
      { step: 'Resolved', date: '2026-09-03 04:00 PM', note: 'Piles cleared and transferred to society compost pit.' }
    ],
    comments: [
      { id: 'c4', author: 'Sanitation Dept', text: 'Cleared and composted on Sep 3rd.', date: '2026-09-03T16:05:00Z' }
    ]
  },
  {
    id: 'CRIME-201',
    title: 'Unidentified Bicycle Theft Attempt near Underground Parking B2',
    category: 'Security & Crime',
    severity: 'High',
    status: 'In Progress',
    colonyId: 'colony-1',
    colonyName: 'Green Meadows Heights',
    reportedBy: 'Aarav Sharma',
    reportedByEmail: 'aarav@sociosphere.io',
    reporterAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-06T23:15:00Z',
    updatedAt: '2026-09-07T08:30:00Z',
    location: 'Basement B2, Pillar #14',
    description: 'Lock on gear cycle was tampered with between 10 PM and 11 PM. CCTV footage request submitted to society security desk.',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    upvotes: 35,
    upvotedBy: ['aarav@sociosphere.io'],
    aiAnalysis: {
      categoryDetected: 'Security Threat / Vandalism',
      severityScore: 92,
      suggestedPriority: 'Urgent Security Alert',
      assignedDepartment: 'Chief Security Officer & Guard Desk',
      estimatedResolutionTime: 'Immediate',
      aiSummary: 'CCTV timestamps flag non-resident entry via visitor gate at 10:14 PM.'
    },
    timeline: [
      { step: 'Reported', date: '2026-09-06 11:15 PM', note: 'Incident logged into security audit portal.' },
      { step: 'AI Classified', date: '2026-09-06 11:16 PM', note: 'AI cross-referenced visitor log times.' },
      { step: 'In Progress', date: '2026-09-07 08:30 AM', note: 'Security desk reviewing Cam #8 angle.' }
    ],
    comments: []
  }
];

export const getIssues = () => {
  const stored = localStorage.getItem('sociosphere_issues');
  if (!stored) {
    localStorage.setItem('sociosphere_issues', JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  }
  return JSON.parse(stored);
};

export const saveIssues = (issues) => {
  localStorage.setItem('sociosphere_issues', JSON.stringify(issues));
  window.dispatchEvent(new Event('sociosphere_data_updated'));
};

export const addIssue = (newIssue) => {
  const issues = getIssues();
  const id = `ISSUE-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueWithDefaults = {
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upvotes: 1,
    upvotedBy: [newIssue.reportedByEmail],
    status: 'Open',
    timeline: [
      { step: 'Reported', date: new Date().toLocaleString(), note: `Reported by ${newIssue.reportedBy}` },
      { step: 'AI Classified', date: new Date().toLocaleString(), note: `AI automated categorization: ${newIssue.category}` }
    ],
    comments: [],
    aiAnalysis: {
      categoryDetected: `${newIssue.category} Automated Assessment`,
      severityScore: newIssue.severity === 'High' ? 85 : newIssue.severity === 'Medium' ? 60 : 35,
      suggestedPriority: newIssue.severity === 'High' ? 'High Priority' : 'Standard Priority',
      assignedDepartment: 'Community Maintenance & Dispatch',
      estimatedResolutionTime: '24 to 48 Hours',
      aiSummary: 'AI analysis verified complete issue data. Dispatched to appropriate department team.'
    },
    ...newIssue
  };

  const updated = [issueWithDefaults, ...issues];
  saveIssues(updated);
  return issueWithDefaults;
};

export const toggleUpvote = (issueId, userEmail) => {
  const issues = getIssues();
  const updated = issues.map(iss => {
    if (iss.id === issueId) {
      const hasUpvoted = iss.upvotedBy?.includes(userEmail);
      const newUpvotedBy = hasUpvoted
        ? (iss.upvotedBy || []).filter(e => e !== userEmail)
        : [...(iss.upvotedBy || []), userEmail];
      return {
        ...iss,
        upvotes: newUpvotedBy.length,
        upvotedBy: newUpvotedBy
      };
    }
    return iss;
  });
  saveIssues(updated);
  return updated;
};

export const addComment = (issueId, authorName, commentText) => {
  const issues = getIssues();
  const updated = issues.map(iss => {
    if (iss.id === issueId) {
      const newComments = [
        ...(iss.comments || []),
        {
          id: `comment-${Date.now()}`,
          author: authorName,
          text: commentText,
          date: new Date().toISOString()
        }
      ];
      return { ...iss, comments: newComments };
    }
    return iss;
  });
  saveIssues(updated);
  return updated;
};

export const updateIssueStatus = (issueId, newStatus, note = '') => {
  const issues = getIssues();
  const updated = issues.map(iss => {
    if (iss.id === issueId) {
      const newTimeline = [
        ...iss.timeline,
        { step: newStatus, date: new Date().toLocaleString(), note: note || `Status updated to ${newStatus}` }
      ];
      return { ...iss, status: newStatus, updatedAt: new Date().toISOString(), timeline: newTimeline };
    }
    return iss;
  });
  saveIssues(updated);
  return updated;
};
