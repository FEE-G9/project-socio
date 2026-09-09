export const INITIAL_EXPENSES = [
  { id: 'exp-1', title: 'Solar Panel Maintenance & Battery Care', category: 'Energy & Tech', amount: 45000, date: '2026-08-28', vendor: 'EcoSolar Dynamics' },
  { id: 'exp-2', title: 'Security Staff Monthly Wages & CCTV Audit', category: 'Security', amount: 120000, date: '2026-09-01', vendor: 'Vanguard Guarding' },
  { id: 'exp-3', title: 'Park Landscaping & Drip Irrigation Service', category: 'Greenery & Sanitation', amount: 28000, date: '2026-09-03', vendor: 'GreenThumb Agency' },
  { id: 'exp-4', title: 'Elevator Safety Inspection & Lubrication', category: 'Infrastructure', amount: 35000, date: '2026-09-05', vendor: 'Otis Tech Services' }
];

export const getExpenses = () => {
  const stored = localStorage.getItem('sociosphere_expenses');
  if (!stored) {
    localStorage.setItem('sociosphere_expenses', JSON.stringify(INITIAL_EXPENSES));
    return INITIAL_EXPENSES;
  }
  return JSON.parse(stored);
};
