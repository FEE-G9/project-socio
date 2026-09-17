export const INITIAL_COLONIES = [
  {
    id: "colony-1",
    name: "Green Valley",
    code: "GV-01",
    city: "Chandigarh",
    totalResidents: 450,
    activeIssues: 12,
    resolvedIssues: 184,
    healthScore: 94,
    authorityName: "Green Valley Welfare Association",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    description:
      "A connected residential community focused on safety, cleanliness and better civic management."
  },
  {
    id: "colony-2",
    name: "Rose Garden",
    code: "RG-02",
    city: "Chandigarh",
    totalResidents: 320,
    activeIssues: 8,
    resolvedIssues: 142,
    healthScore: 89,
    authorityName: "Rose Garden Residents Association",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    description:
      "A vibrant neighbourhood with active residents and community-driven initiatives."
  },
  {
    id: "colony-3",
    name: "Shanti Nagar",
    code: "SN-03",
    city: "Chandigarh",
    totalResidents: 600,
    activeIssues: 19,
    resolvedIssues: 310,
    healthScore: 86,
    authorityName: "Shanti Nagar Community Council",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    description:
      "A growing residential area focused on accessible services and community safety."
  },
  {
    id: "colony-4",
    name: "Model Town",
    code: "MT-04",
    city: "Chandigarh",
    totalResidents: 280,
    activeIssues: 5,
    resolvedIssues: 98,
    healthScore: 97,
    authorityName: "Model Town Residents Association",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    description:
      "A well-established community with organized civic services and resident facilities."
  }
];

export const getColonies = () => {
  const stored = localStorage.getItem("sociosphere_colonies");

  if (!stored) {
    localStorage.setItem(
      "sociosphere_colonies",
      JSON.stringify(INITIAL_COLONIES)
    );

    return INITIAL_COLONIES;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse colonies:", error);
    return INITIAL_COLONIES;
  }
};