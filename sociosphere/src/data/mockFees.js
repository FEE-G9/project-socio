export const INITIAL_FEES = [
  { id: 'fee-1', month: 'September 2026', amount: 3500, dueDate: '2026-09-15', status: 'Paid', transactionId: 'TXN-908123', paidOn: '2026-09-02' },
  { id: 'fee-2', month: 'August 2026', amount: 3500, dueDate: '2026-08-15', status: 'Paid', transactionId: 'TXN-874211', paidOn: '2026-08-04' },
  { id: 'fee-3', month: 'October 2026', amount: 3500, dueDate: '2026-10-15', status: 'Upcoming', transactionId: null, paidOn: null }
];

export const getFees = () => {
  const stored = localStorage.getItem('sociosphere_fees');
  if (!stored) {
    localStorage.setItem('sociosphere_fees', JSON.stringify(INITIAL_FEES));
    return INITIAL_FEES;
  }
  return JSON.parse(stored);
};
