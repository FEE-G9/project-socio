export const INITIAL_COLONIES = [
  {
    id: 'colony-1',
    name: 'Green Meadows Heights',
    code: 'GMH-01',
    city: 'Metropolis',
    totalResidents: 450,
    activeIssues: 12,
    resolvedIssues: 184,
    healthScore: 94,
    authorityName: 'Green Meadows Welfare Board',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    description: 'A modern gated eco-friendly residential society focused on clean solar energy and smart civic management.'
  },
  {
    id: 'colony-2',
    name: 'Harmony Park Enclave',
    code: 'HPE-02',
    city: 'Metropolis',
    totalResidents: 320,
    activeIssues: 8,
    resolvedIssues: 142,
    healthScore: 89,
    authorityName: 'Harmony Society Council',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
    description: 'Vibrant urban community with lush parks, 24/7 solar security, and active resident sports clubs.'
  },
  {
    id: 'colony-3',
    name: 'Sunrise Boulevard Estates',
    code: 'SBE-03',
    city: 'Metropolis',
    totalResidents: 600,
    activeIssues: 19,
    resolvedIssues: 310,
    healthScore: 86,
    authorityName: 'Sunrise Civic Authority',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
    description: 'Sprawling smart township featuring rainwater harvesting, automated waste sorting, and digital security.'
  },
  {
    id: 'colony-4',
    name: 'Silver Oak Smart Township',
    code: 'SOST-04',
    city: 'Metropolis',
    totalResidents: 280,
    activeIssues: 5,
    resolvedIssues: 98,
    healthScore: 97,
    authorityName: 'Silver Oak Resident Association',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
    description: 'Boutique luxury enclave with smart streetlight grids and automated gate management.'
  }
];

export const getColonies = () => {
  const stored = localStorage.getItem('sociosphere_colonies');
  if (!stored) {
    localStorage.setItem('sociosphere_colonies', JSON.stringify(INITIAL_COLONIES));
    return INITIAL_COLONIES;
  }
  return JSON.parse(stored);
};
