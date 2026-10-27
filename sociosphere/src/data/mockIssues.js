export const INITIAL_ISSUES = [
  {
    id: 'ISSUE-101',
    title: 'Main Avenue Water Pipeline Leakage near Block B Park',
    category: 'Water Supply & Plumbing',
    severity: 'High',
    status: 'In Progress',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    colonyName: 'Gandhi Colony',
    colony: 'Gandhi Colony',
    communityName: 'Gandhi Colony',
    communityId: 'colony-gandhi',
    reportedBy: 'Aarav Sharma',
    reportedByEmail: 'aarav.sharma@gmail.com',
    reporterAvatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-05T09:30:00Z',
    updatedAt: '2026-09-06T14:15:00Z',
    location: 'Gandhi Colony - Block B, Near Central Fountain',
    description:
      'Clean drinking water is leaking profusely from the main pipeline connection. Water pressure in Block B apartments has dropped by 40%. Requires urgent plumbing repairs before water logging damages the park walkway.',
    image:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80',
    upvotes: 42,
    upvotedBy: ['aarav.sharma@gmail.com', 'priya.p@sociosphere.io'],
    aiAnalysis: {
      categoryDetected: 'Infrastructure / Plumbing Failure',
      severityScore: 88,
      suggestedPriority: 'Critical Urgent',
      assignedDepartment: 'Municipal Plumbing & Water Works',
      estimatedResolutionTime: '24 Hours',
      aiSummary:
        'Computer Vision verified high-volume clean water pipe rupture in Gandhi Colony Block B. High priority due to local supply interruption.'
    },
    timeline: [
      {
        step: 'Reported',
        date: '2026-09-05 09:30 AM',
        note: 'Issue submitted by Aarav Sharma with geotagged photo evidence in Gandhi Colony.'
      },
      {
        step: 'AI Classified',
        date: '2026-09-05 09:31 AM',
        note: 'AI routed complaint to Municipal Plumbing. Priority marked Critical.'
      },
      {
        step: 'Assigned',
        date: '2026-09-05 11:00 AM',
        note: 'Dispatched Senior Engineer Ramesh Kumar and maintenance squad.'
      },
      {
        step: 'In Progress',
        date: '2026-09-06 02:15 PM',
        note: 'Replacement pipe section delivered. Water main shut down for installation.'
      }
    ],
    comments: [
      {
        id: 'c1',
        author: 'Priya Patel',
        text: 'Thank you for reporting! Water pressure was very low this morning in Block B.',
        date: '2026-09-05T10:15:00Z'
      },
      {
        id: 'c2',
        author: 'Gandhi Colony Authority - Maintenance',
        text: 'Our team is on-site replacing the split joint valve.',
        date: '2026-09-06T14:20:00Z'
      }
    ]
  },

  {
    id: 'ISSUE-102',
    title: 'Broken Solar Streetlights along Perimeter Road',
    category: 'Electrical & Lighting',
    severity: 'Medium',
    status: 'Open',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    colonyName: 'Gandhi Colony',
    colony: 'Gandhi Colony',
    communityName: 'Gandhi Colony',
    communityId: 'colony-gandhi',
    reportedBy: 'Priya Patel',
    reportedByEmail: 'priya.p@sociosphere.io',
    reporterAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-06T18:45:00Z',
    updatedAt: '2026-09-06T18:45:00Z',
    location: 'Gandhi Colony - Perimeter Wall Gate 3 to Gate 4',
    description:
      'Three consecutive solar streetlights have gone dark since yesterday evening. The stretch is dark during night hours posing safety concerns for senior residents taking evening walks.',
    image:
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    upvotes: 27,
    upvotedBy: ['priya.p@sociosphere.io'],
    aiAnalysis: {
      categoryDetected: 'Public Safety / Electrical Maintenance',
      severityScore: 65,
      suggestedPriority: 'Medium High',
      assignedDepartment: 'Gandhi Colony Electrical Grid Team',
      estimatedResolutionTime: '48 Hours',
      aiSummary:
        'Likely battery failure or solar panel dust buildup on lamps #14, #15, #16 along Gandhi Colony perimeter.'
    },
    timeline: [
      {
        step: 'Reported',
        date: '2026-09-06 06:45 PM',
        note: 'Reported by Priya Patel.'
      },
      {
        step: 'AI Classified',
        date: '2026-09-06 06:46 PM',
        note: 'AI tagged as Electrical & Safety issue.'
      }
    ],
    comments: [
      {
        id: 'c3',
        author: 'Rohan Verma',
        text: 'Agree, it is very dark around Gate 3 after 8 PM.',
        date: '2026-09-06T19:10:00Z'
      }
    ]
  },

  {
    id: 'ISSUE-103',
    title: 'Uncollected Green Waste after Garden Pruning',
    category: 'Sanitation & Waste',
    severity: 'Low',
    status: 'Resolved',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    colonyName: 'Gandhi Colony',
    colony: 'Gandhi Colony',
    communityName: 'Gandhi Colony',
    communityId: 'colony-gandhi',
    reportedBy: 'Rohan Verma',
    reportedByEmail: 'rohan.v@sociosphere.io',
    reporterAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-02T10:00:00Z',
    updatedAt: '2026-09-03T16:00:00Z',
    location: 'Gandhi Colony - Community Center Lawn',
    description:
      'Tree branches and garden clippings were left piled near the recycling bin area following seasonal tree trimming.',
    image:
      'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    upvotes: 18,
    upvotedBy: [],
    aiAnalysis: {
      categoryDetected: 'Sanitation / Organic Waste Disposal',
      severityScore: 30,
      suggestedPriority: 'Standard Routine',
      assignedDepartment: 'Horticulture & Waste Management',
      estimatedResolutionTime: '24 Hours',
      aiSummary:
        'Organic waste heap requiring composting pickup vehicle.'
    },
    timeline: [
      {
        step: 'Reported',
        date: '2026-09-02 10:00 AM',
        note: 'Reported by Rohan Verma.'
      },
      {
        step: 'AI Classified',
        date: '2026-09-02 10:01 AM',
        note: 'Assigned to Sanitation truck.'
      },
      {
        step: 'In Progress',
        date: '2026-09-03 09:00 AM',
        note: 'Waste truck scheduled.'
      },
      {
        step: 'Resolved',
        date: '2026-09-03 04:00 PM',
        note: 'Piles cleared and transferred to Gandhi Colony compost pit.'
      }
    ],
    comments: [
      {
        id: 'c4',
        author: 'Gandhi Colony Sanitation',
        text: 'Cleared and composted on Sep 3rd.',
        date: '2026-09-03T16:05:00Z'
      }
    ]
  },

  {
    id: 'ISSUE-104',
    title: 'Pothole and Loose Pavers near Block A Main Gate',
    category: 'Roads & Pavements',
    severity: 'Medium',
    status: 'Open',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    colonyName: 'Gandhi Colony',
    colony: 'Gandhi Colony',
    communityName: 'Gandhi Colony',
    communityId: 'colony-gandhi',
    reportedBy: 'Neha Gupta',
    reportedByEmail: 'neha.gupta@sociosphere.io',
    createdAt: '2026-10-18T07:45:00Z',
    updatedAt: '2026-10-18T07:45:00Z',
    location: 'Gandhi Colony - Block A Main Gate, Visitor Lane',
    description: 'A pothole beside the speed breaker and several loose pavers are making the visitor lane uneven, especially for two-wheelers and pedestrians during rain.',
    upvotes: 16,
    upvotedBy: ['neha.gupta@sociosphere.io'],
    timeline: [
      { step: 'Reported', date: '2026-10-18 07:45 AM', note: 'Reported with the gate-lane location.' },
      { step: 'AI Classified', date: '2026-10-18 07:46 AM', note: 'Routed to the civil maintenance team.' }
    ],
    comments: []
  },

  {
    id: 'ISSUE-105',
    title: 'Drain Overflow near Community Hall Service Lane',
    category: 'Drainage',
    severity: 'High',
    status: 'In Progress',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    colonyName: 'Gandhi Colony',
    colony: 'Gandhi Colony',
    communityName: 'Gandhi Colony',
    communityId: 'colony-gandhi',
    reportedBy: 'Sunita Mehra',
    reportedByEmail: 'sunita.mehra@sociosphere.io',
    createdAt: '2026-10-20T10:20:00Z',
    updatedAt: '2026-10-21T09:15:00Z',
    location: 'Gandhi Colony - Community Hall Service Lane',
    description: 'The storm-water drain is backing up after morning cleaning, leaving stagnant water along the service lane and a slippery approach to the community hall.',
    upvotes: 31,
    upvotedBy: ['sunita.mehra@sociosphere.io'],
    timeline: [
      { step: 'Reported', date: '2026-10-20 10:20 AM', note: 'Reported by Sunita Mehra.' },
      { step: 'Assigned', date: '2026-10-20 12:10 PM', note: 'Drainage contractor assigned for jetting and debris removal.' },
      { step: 'In Progress', date: '2026-10-21 09:15 AM', note: 'Team started clearing the blocked section.' }
    ],
    comments: []
  },

  {
    id: 'ISSUE-106',
    title: 'Damaged Swing Chain in Children\'s Park',
    category: 'Parks & Recreation',
    severity: 'High',
    status: 'Pending Dispatch',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    colonyName: 'Gandhi Colony',
    colony: 'Gandhi Colony',
    communityName: 'Gandhi Colony',
    communityId: 'colony-gandhi',
    reportedBy: 'Ananya Singh',
    reportedByEmail: 'ananya.singh@sociosphere.io',
    createdAt: '2026-10-22T16:40:00Z',
    updatedAt: '2026-10-22T16:42:00Z',
    location: 'Gandhi Colony - Children\'s Park, Play Area East',
    description: 'One swing chain is visibly worn and the seat is tilted. The equipment has been marked temporarily, but repair is needed before children use it again.',
    upvotes: 24,
    upvotedBy: ['ananya.singh@sociosphere.io'],
    timeline: [
      { step: 'Reported', date: '2026-10-22 04:40 PM', note: 'Safety concern reported from the play area.' },
      { step: 'AI Classified', date: '2026-10-22 04:42 PM', note: 'Marked high priority because it involves playground equipment.' }
    ],
    comments: []
  },

  {
    id: 'CRIME-201',
    title: 'Unidentified Bicycle Theft Attempt near Underground Parking B2',
    category: 'Security & Crime',
    severity: 'High',
    status: 'In Progress',
    society: 'Gandhi Colony',
    societyCode: 'GC-101',
    colonyId: 'colony-gandhi',
    colonyName: 'Gandhi Colony',
    colony: 'Gandhi Colony',
    communityName: 'Gandhi Colony',
    communityId: 'colony-gandhi',
    reportedBy: 'Aarav Sharma',
    reportedByEmail: 'aarav.sharma@gmail.com',
    reporterAvatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-09-06T23:15:00Z',
    updatedAt: '2026-09-07T08:30:00Z',
    location: 'Gandhi Colony - Basement B2, Pillar #14',
    description:
      'Lock on gear cycle was tampered with between 10 PM and 11 PM. CCTV footage request submitted to society security desk.',
    image:
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    upvotes: 35,
    upvotedBy: ['aarav.sharma@gmail.com'],
    aiAnalysis: {
      categoryDetected: 'Security Threat / Vandalism',
      severityScore: 92,
      suggestedPriority: 'Urgent Security Alert',
      assignedDepartment: 'Gandhi Colony Security Officer & Guard Desk',
      estimatedResolutionTime: 'Immediate',
      aiSummary:
        'CCTV timestamps flag non-resident entry via visitor gate at 10:14 PM in Gandhi Colony.'
    },
    timeline: [
      {
        step: 'Reported',
        date: '2026-09-06 11:15 PM',
        note: 'Incident logged into Gandhi Colony security audit portal.'
      },
      {
        step: 'AI Classified',
        date: '2026-09-06 11:16 PM',
        note: 'AI cross-referenced visitor log times.'
      },
      {
        step: 'In Progress',
        date: '2026-09-07 08:30 AM',
        note: 'Security desk reviewing Cam #8 angle.'
      }
    ],
    comments: []
  }
];

// Helper to normalize any item to Gandhi Colony if not specifically assigned elsewhere
const normalizeIssueToColony = (issue) => {
  if (
    !issue.society ||
    issue.colonyName === 'Green Meadows Heights' ||
    issue.society === 'Green Meadows Heights' ||
    issue.communityName === 'Green Meadows Heights' ||
    !issue.societyCode
  ) {
    return {
      ...issue,
      society: 'Gandhi Colony',
      societyCode: 'GC-101',
      colonyName: 'Gandhi Colony',
      colony: 'Gandhi Colony',
      communityName: 'Gandhi Colony',
      communityId: 'colony-gandhi',
    };
  }
  return issue;
};

const GANDHI_COLONY_ISSUE_SEED_VERSION = 'gandhi-colony-issues-v2';
const LATEST_GANDHI_COLONY_ISSUES = INITIAL_ISSUES.filter((issue) =>
  ['ISSUE-104', 'ISSUE-105', 'ISSUE-106'].includes(issue.id)
);

/*
 * Get issues from localStorage.
 */
export const getIssues = () => {
  const stored = localStorage.getItem('sociosphere_issues');

  if (!stored) {
    localStorage.setItem('sociosphere_issues', JSON.stringify(INITIAL_ISSUES));
    return INITIAL_ISSUES;
  }

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem('sociosphere_issues', JSON.stringify(INITIAL_ISSUES));
      return INITIAL_ISSUES;
    }

    // Add the new Gandhi Colony sample reports once without overwriting reports
    // already created by a resident.
    const hasLatestSeeds = localStorage.getItem('sociosphere_issue_seed_version') === GANDHI_COLONY_ISSUE_SEED_VERSION;
    const existingIds = new Set(parsed.map((issue) => issue.id));
    const withLatestSeeds = hasLatestSeeds
      ? parsed
      : [
          ...LATEST_GANDHI_COLONY_ISSUES.filter((issue) => !existingIds.has(issue.id)),
          ...parsed,
        ];

    if (!hasLatestSeeds) {
      localStorage.setItem('sociosphere_issue_seed_version', GANDHI_COLONY_ISSUE_SEED_VERSION);
    }

    // Ensure all existing issues belong to Gandhi Colony
    let hasChanges = false;
    const normalized = withLatestSeeds.map(issue => {
      const updated = normalizeIssueToColony(issue);
      if (updated !== issue) hasChanges = true;
      return updated;
    });

    if (hasChanges || !hasLatestSeeds) {
      localStorage.setItem('sociosphere_issues', JSON.stringify(normalized));
    }

    return normalized;
  } catch (error) {
    console.error('Failed to parse stored issues:', error);
    return INITIAL_ISSUES;
  }
};

export const saveIssues = (issues) => {
  const normalized = issues.map(normalizeIssueToColony);
  localStorage.setItem('sociosphere_issues', JSON.stringify(normalized));
  window.dispatchEvent(new Event('sociosphere_data_updated'));
};

export const deleteIssue = (issueId) => {
  const issues = getIssues().filter((issue) => issue.id !== issueId);
  saveIssues(issues);

  const reports = JSON.parse(
    localStorage.getItem('sociosphere_user_reports') || '[]'
  );
  localStorage.setItem(
    'sociosphere_user_reports',
    JSON.stringify(reports.filter((report) => report.id !== issueId))
  );
  window.dispatchEvent(new Event('sociosphere_data_updated'));
  return issues;
};

export const addIssue = (newIssue) => {
  const issues = getIssues();

  const id = `ISSUE-${Math.floor(1000 + Math.random() * 9000)}`;

  const issueWithDefaults = normalizeIssueToColony({
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upvotes: 1,
    upvotedBy: [newIssue.reportedByEmail],
    status: 'Open',

    timeline: [
      {
        step: 'Reported',
        date: new Date().toLocaleString(),
        note: `Reported by ${newIssue.reportedBy}`
      },
      {
        step: 'AI Classified',
        date: new Date().toLocaleString(),
        note: `AI automated categorization: ${newIssue.category}`
      }
    ],

    comments: [],

    aiAnalysis: {
      categoryDetected: `${newIssue.category} Automated Assessment`,
      severityScore:
        newIssue.severity === 'High'
          ? 85
          : newIssue.severity === 'Medium'
            ? 60
            : 35,
      suggestedPriority:
        newIssue.severity === 'High'
          ? 'High Priority'
          : 'Standard Priority',
      assignedDepartment: 'Community Maintenance & Dispatch',
      estimatedResolutionTime: '24 to 48 Hours',
      aiSummary:
        'AI analysis verified complete issue data. Dispatched to appropriate department team.'
    },

    ...newIssue
  });

  const updated = [issueWithDefaults, ...issues];

  saveIssues(updated);

  return issueWithDefaults;
};

export const toggleUpvote = (issueId, userEmail) => {
  const issues = getIssues();

  const updated = issues.map((iss) => {
    if (iss.id === issueId) {
      const hasUpvoted = iss.upvotedBy?.includes(userEmail);

      const newUpvotedBy = hasUpvoted
        ? (iss.upvotedBy || []).filter((e) => e !== userEmail)
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

  const updated = issues.map((iss) => {
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

      return {
        ...iss,
        comments: newComments
      };
    }

    return iss;
  });

  saveIssues(updated);

  return updated;
};

export const updateIssueStatus = (
  issueId,
  newStatus,
  note = ''
) => {
  const issues = getIssues();

  const updated = issues.map((iss) => {
    if (iss.id === issueId) {
      const newTimeline = [
        ...(iss.timeline || []),
        {
          step: newStatus,
          date: new Date().toLocaleString(),
          note: note || `Status updated to ${newStatus}`
        }
      ];

      return {
        ...iss,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        timeline: newTimeline
      };
    }

    return iss;
  });

  saveIssues(updated);

  // Sync with user reports cache so Citizen Home updates correctly
  const reports = JSON.parse(localStorage.getItem('sociosphere_user_reports') || '[]');
  const updatedReports = reports.map(report => {
    if (report.id === issueId) {
      const updatedIssue = updated.find(i => i.id === issueId);
      return { ...report, ...updatedIssue };
    }
    return report;
  });
  localStorage.setItem('sociosphere_user_reports', JSON.stringify(updatedReports));
  window.dispatchEvent(new Event('sociosphere_data_updated'));

  return updated;
};
