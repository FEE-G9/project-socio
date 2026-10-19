export const INITIAL_COLONIES = [
  {
    id: "colony-gandhi",
    name: "Gandhi Colony",
    code: "GC-101",
    city: "Rajpura",
    totalResidents: 450,
    activeIssues: 7,
    resolvedIssues: 184,
    healthScore: 94,
    authorityName: "Gandhi Colony Welfare Association",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80",
    description:
      "A peaceful and well-organized residential society featuring solar power, clean parks, and active community civic governance."
  },
  {
    id: "colony-shayam",
    name: "Shayam Nagar",
    code: "SN-202",
    city: "Rajpura",
    totalResidents: 320,
    activeIssues: 4,
    resolvedIssues: 142,
    healthScore: 89,
    authorityName: "Shayam Nagar Resident Welfare Board",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
    description:
      "A vibrant and family-friendly society with 24/7 security surveillance, modern amenities, and dedicated green clubs."
  },
  {
    id: "colony-dalima",
    name: "Dalima Vihar",
    code: "DV-303",
    city: "Rajpura",
    totalResidents: 580,
    activeIssues: 11,
    resolvedIssues: 310,
    healthScore: 92,
    authorityName: "Dalima Vihar Management Council",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
    description:
      "A premium residential enclave known for gated blocks, active rainwater harvesting, and prompt resident service response."
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
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.some(c => c && c.name === "Gandhi Colony")) {
      localStorage.setItem("sociosphere_colonies", JSON.stringify(INITIAL_COLONIES));
      return INITIAL_COLONIES;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse colonies:", error);
    return INITIAL_COLONIES;
  }
};