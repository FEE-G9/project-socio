import { getUsers } from './mockUsers.js';

// Seed Maintenance Fee records for Gandhi Colony
const SEED_FEES_GC = [
  { id: 'TXN-gc-admin-1', userId: 'gc-admin-1', name: 'Vansh Goyal', unit: 'Block A - Flat 707', amount: 3500, status: 'Paid', date: '2026-10-01', method: 'Online UPI', receiptNo: 'REC-2026-707' },
  { id: 'TXN-gc-mem-2', userId: 'gc-mem-2', name: 'Rajesh Khanna', unit: 'Block A - Flat 601', amount: 3500, status: 'Paid', date: '2026-10-02', method: 'Net Banking', receiptNo: 'REC-2026-601' },
  { id: 'TXN-gc-mem-3', userId: 'gc-mem-3', name: 'Meenakshi Sundaram', unit: 'Block C - Flat 302', amount: 3500, status: 'Paid', date: '2026-10-03', method: 'Online UPI', receiptNo: 'REC-2026-302' },
  { id: 'TXN-gc-res-1', userId: 'gc-res-1', name: 'Aarav Sharma', unit: 'Block B - Flat 402', amount: 3500, status: 'Paid', date: '2026-10-03', method: 'Net Banking', receiptNo: 'REC-2026-402' },
  { id: 'TXN-gc-res-2', userId: 'gc-res-2', name: 'Priya Patel', unit: 'Block A - Flat 304', amount: 3500, status: 'Paid', date: '2026-10-05', method: 'Online UPI', receiptNo: 'REC-2026-304' },
  { id: 'TXN-gc-res-3', userId: 'gc-res-3', name: 'Rohan Verma', unit: 'Block C - Flat 105', amount: 3500, status: 'Overdue', date: '2026-09-01', method: 'Pending', receiptNo: null },
  { id: 'TXN-gc-res-4', userId: 'gc-res-4', name: 'Ananya Iyer', unit: 'Block B - Flat 201', amount: 3500, status: 'Paid', date: '2026-10-04', method: 'Credit Card', receiptNo: 'REC-2026-201' },
  { id: 'TXN-gc-res-5', userId: 'gc-res-5', name: 'Vikram Malhotra', unit: 'Block A - Flat 502', amount: 3500, status: 'Pending', date: '2026-10-15', method: 'Pending', receiptNo: null },
  { id: 'TXN-gc-res-6', userId: 'gc-res-6', name: 'Neha Gupta', unit: 'Block C - Flat 301', amount: 3500, status: 'Paid', date: '2026-10-02', method: 'Online UPI', receiptNo: 'REC-2026-301' },
  { id: 'TXN-gc-res-7', userId: 'gc-res-7', name: 'Arjun Nambiar', unit: 'Block A - Flat 204', amount: 3500, status: 'Overdue', date: '2026-09-10', method: 'Pending', receiptNo: null }
];

// Seed Maintenance Fee records for Shayam Nagar
const SEED_FEES_SN = [
  { id: 'TXN-sn-admin-1', userId: 'sn-admin-1', name: 'Ekjyot Kaur', unit: 'Block A - House 1', amount: 3500, status: 'Paid', date: '2026-10-01', method: 'Online UPI', receiptNo: 'REC-SN-001' },
  { id: 'TXN-sn-mem-2', userId: 'sn-mem-2', name: 'Harish Batra', unit: 'Block B - Flat 204', amount: 3500, status: 'Paid', date: '2026-10-02', method: 'Net Banking', receiptNo: 'REC-SN-204' },
  { id: 'TXN-sn-mem-3', userId: 'sn-mem-3', name: 'Dr. Ananya Sen', unit: 'Block C - Flat 504', amount: 3500, status: 'Paid', date: '2026-10-03', method: 'Online UPI', receiptNo: 'REC-SN-504' },
  { id: 'TXN-sn-res-1', userId: 'sn-res-1', name: 'Kabir Verma', unit: 'Block A - Flat 703', amount: 3500, status: 'Paid', date: '2026-10-04', method: 'Online UPI', receiptNo: 'REC-SN-703' },
  { id: 'TXN-sn-res-2', userId: 'sn-res-2', name: 'Fatima Sheikh', unit: 'Block B - Flat 102', amount: 3500, status: 'Pending', date: '2026-10-14', method: 'Pending', receiptNo: null },
  { id: 'TXN-sn-res-3', userId: 'sn-res-3', name: 'Gurpreet Singh', unit: 'Block C - House 14', amount: 3500, status: 'Paid', date: '2026-10-05', method: 'Cheque', receiptNo: 'REC-SN-014' }
];

// Seed Expenses for Gandhi Colony
const SEED_EXPENSES_GC = [
  { id: 'EXP-101', category: 'Security Salaries', vendor: 'SIS Security Agency Pvt Ltd', invoiceNo: 'INV-2026-901', amount: 45000, date: '2026-10-01', status: 'Paid', method: 'Bank Transfer' },
  { id: 'EXP-102', category: 'Common Electricity', vendor: 'PSPCL Power Grid', invoiceNo: 'BILL-OCT-4412', amount: 28500, date: '2026-10-05', status: 'Paid', method: 'Online Portal' },
  { id: 'EXP-103', category: 'Lift AMC Maintenance', vendor: 'Schindler Elevators India', invoiceNo: 'AMC-Q3-199', amount: 15000, date: '2026-10-10', status: 'Paid', method: 'NEFT' },
  { id: 'EXP-104', category: 'Sanitation & Housekeeping', vendor: 'CleanTech Facility Solutions', invoiceNo: 'INV-2026-88', amount: 18000, date: '2026-10-12', status: 'Paid', method: 'Bank Transfer' },
  { id: 'EXP-105', category: 'Diesel Generator Backup', vendor: 'HPCL Fuel Station Rajpura', invoiceNo: 'DSL-2026-402', amount: 12000, date: '2026-10-18', status: 'Paid', method: 'Card' },
  { id: 'EXP-106', category: 'Gardening & Landscape', vendor: 'GreenFlora Nursery & Landscaping', invoiceNo: 'GF-OCT-12', amount: 8500, date: '2026-10-20', status: 'Pending Approval', method: 'Cheque' },
  { id: 'EXP-107', category: 'CCTV Cloud & Server Storage', vendor: 'SecureCloud Technologies', invoiceNo: 'SC-2026-009', amount: 4200, date: '2026-10-22', status: 'Pending Approval', method: 'Online' },
];

// Seed Expenses for Shayam Nagar
const SEED_EXPENSES_SN = [
  { id: 'EXP-SN-101', category: 'Security Salaries', vendor: 'G4S Secure Solutions', invoiceNo: 'G4S-OCT-201', amount: 42000, date: '2026-10-01', status: 'Paid', method: 'Bank Transfer' },
  { id: 'EXP-SN-102', category: 'Common Electricity', vendor: 'PSPCL Power Grid', invoiceNo: 'BILL-SN-9981', amount: 24000, date: '2026-10-04', status: 'Paid', method: 'Online Portal' },
  { id: 'EXP-SN-103', category: 'Lift AMC Maintenance', vendor: 'Otis Elevator Company', invoiceNo: 'OTIS-SN-55', amount: 14000, date: '2026-10-08', status: 'Paid', method: 'NEFT' },
  { id: 'EXP-SN-104', category: 'Sanitation & Housekeeping', vendor: 'EcoClean Facility Care', invoiceNo: 'ECO-2026-41', amount: 16500, date: '2026-10-11', status: 'Paid', method: 'Bank Transfer' },
  { id: 'EXP-SN-105', category: 'Gardening & Landscape', vendor: 'Bloom Nursery', invoiceNo: 'BL-OCT-301', amount: 7500, date: '2026-10-19', status: 'Pending Approval', method: 'Cheque' },
];

const resolveSocietyCode = (societyCode, societyName) => {
  if (societyCode) return societyCode;
  const name = (societyName || '').toLowerCase().trim();
  if (name.includes('shayam')) return 'SN-202';
  if (name.includes('dalima')) return 'DV-303';
  return 'GC-101';
};

/**
 * Retrieves all maintenance fee records for a society, fully reconciled with the society users database.
 * If new members/residents were added via signup approval or "Add Person", they are automatically
 * assigned a maintenance record and included in the database.
 */
export const getSocietyMaintenanceRecords = (societyCode, societyName) => {
  const socCode = resolveSocietyCode(societyCode, societyName);
  const storageKey = `sociosphere_fees_${socCode}`;
  
  // 1. Fetch current verified residents & members for this colony from users database
  const allUsers = getUsers(socCode);
  const verifiedUsers = allUsers.filter(u => u.status === 'Verified');

  // 2. Fetch stored records from localStorage
  let stored = null;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) stored = JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing stored fees:', e);
    }
  }

  // Initial base if no storage exists yet
  let currentRecords = stored;
  if (!currentRecords || !Array.isArray(currentRecords)) {
    currentRecords = socCode === 'SN-202' ? [...SEED_FEES_SN] : [...SEED_FEES_GC];
  }

  // 3. Reconcile with verified users (detect new members/residents!)
  let changed = false;
  const reconciled = [...currentRecords];

  verifiedUsers.forEach(user => {
    const existingIndex = reconciled.findIndex(r => 
      (r.userId && r.userId === user.id) ||
      (r.id && r.id === `TXN-${user.id}`) ||
      (r.name && user.name && r.name.toLowerCase().trim() === user.name.toLowerCase().trim())
    );

    const userUnit = user.unitNumber || `${user.blockNumber || 'Block A'} - ${user.houseOrFlatNo || 'Unit 1'}`;

    if (existingIndex >= 0) {
      // Update details if resident name or unit updated
      const existing = reconciled[existingIndex];
      if (existing.name !== user.name || existing.unit !== userUnit || !existing.userId) {
        reconciled[existingIndex] = {
          ...existing,
          userId: user.id,
          name: user.name,
          unit: userUnit
        };
        changed = true;
      }
    } else {
      // NEW MEMBER FOUND! Automatically create their maintenance fee record in the ledger
      const isAuthorityAdmin = user.role === 'authority' || user.badges?.some(b => b.includes('President'));
      const newEntry = {
        id: `TXN-${user.id}`,
        userId: user.id,
        name: user.name,
        unit: userUnit,
        amount: 3500,
        status: isAuthorityAdmin ? 'Paid' : 'Pending',
        date: new Date().toISOString().split('T')[0],
        method: isAuthorityAdmin ? 'Online UPI' : 'Pending',
        receiptNo: isAuthorityAdmin ? `REC-${user.id.toUpperCase()}` : null
      };
      reconciled.push(newEntry);
      changed = true;
    }
  });

  // Save back if reconciled had changes or storage was initialized
  if (changed || !stored) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(reconciled));
    }
  }

  return reconciled;
};

/**
 * Records an offline payment or updates an existing maintenance record to 'Paid'.
 */
export const recordMaintenancePayment = (societyCode, paymentData) => {
  const socCode = resolveSocietyCode(societyCode, paymentData.society);
  const storageKey = `sociosphere_fees_${socCode}`;
  const current = getSocietyMaintenanceRecords(socCode);

  const amountVal = parseInt(paymentData.amount, 10) || 3500;
  const dateVal = paymentData.date || new Date().toISOString().split('T')[0];
  const methodVal = paymentData.method || 'Cash (Received at RWA Office)';
  const receiptNoVal = paymentData.receiptNo || `REC-${Date.now().toString().slice(-6)}`;

  let found = false;
  const updated = current.map(rec => {
    const isTarget = 
      (paymentData.recordId && rec.id === paymentData.recordId) ||
      (paymentData.userId && rec.userId === paymentData.userId) ||
      (paymentData.name && rec.name.toLowerCase().trim() === paymentData.name.toLowerCase().trim()) ||
      (paymentData.unit && rec.unit.toLowerCase().trim() === paymentData.unit.toLowerCase().trim());

    if (isTarget && !found) {
      found = true;
      return {
        ...rec,
        amount: amountVal,
        status: 'Paid',
        date: dateVal,
        method: methodVal,
        receiptNo: receiptNoVal,
        notes: paymentData.notes || rec.notes || ''
      };
    }
    return rec;
  });

  if (!found) {
    // New entry if user/unit was not previously in the ledger
    const newRecord = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      name: paymentData.name.trim(),
      unit: paymentData.unit.trim(),
      amount: amountVal,
      status: 'Paid',
      date: dateVal,
      method: methodVal,
      receiptNo: receiptNoVal,
      notes: paymentData.notes || ''
    };
    updated.unshift(newRecord);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sociosphere_finance_updated'));
    window.dispatchEvent(new Event('sociosphere_data_updated'));
  }

  return updated;
};

/**
 * One-click mark maintenance as Paid
 */
export const markFeePaid = (societyCode, recordId, residentName) => {
  return recordMaintenancePayment(societyCode, {
    recordId,
    name: residentName,
    method: 'Cheque / Cash Verified',
    receiptNo: `REC-${Date.now().toString().slice(-6)}`
  });
};

/**
 * Retrieves colony expenditure bills
 */
export const getSocietyExpenses = (societyCode, societyName) => {
  const socCode = resolveSocietyCode(societyCode, societyName);
  const storageKey = `sociosphere_expenses_${socCode}`;

  let stored = null;
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) stored = JSON.parse(raw);
    } catch (e) {
      console.error('Error parsing stored expenses:', e);
    }
  }

  if (stored && Array.isArray(stored)) {
    return stored;
  }

  const initial = socCode === 'SN-202' ? [...SEED_EXPENSES_SN] : [...SEED_EXPENSES_GC];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(initial));
  }
  return initial;
};

/**
 * Logs a new colony expenditure
 */
export const addSocietyExpense = (societyCode, expenseData) => {
  const socCode = resolveSocietyCode(societyCode, expenseData.society);
  const storageKey = `sociosphere_expenses_${socCode}`;
  const current = getSocietyExpenses(socCode);

  const newExpense = {
    id: `EXP-${Date.now().toString().slice(-5)}`,
    category: expenseData.category || 'Repairs & Plumbing',
    vendor: expenseData.vendor.trim(),
    invoiceNo: expenseData.invoiceNo?.trim() || `INV-${Date.now().toString().slice(-5)}`,
    amount: parseInt(expenseData.amount, 10) || 5000,
    date: expenseData.date || new Date().toISOString().split('T')[0],
    status: expenseData.status || 'Paid',
    method: expenseData.method || 'Bank Transfer'
  };

  const updated = [newExpense, ...current];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sociosphere_finance_updated'));
    window.dispatchEvent(new Event('sociosphere_data_updated'));
  }

  return updated;
};

/**
 * Authorizes a pending vendor bill
 */
export const approveSocietyExpense = (societyCode, expenseId) => {
  const socCode = resolveSocietyCode(societyCode);
  const storageKey = `sociosphere_expenses_${socCode}`;
  const current = getSocietyExpenses(socCode);

  const updated = current.map(e => e.id === expenseId ? { ...e, status: 'Paid' } : e);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(updated));
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sociosphere_finance_updated'));
    window.dispatchEvent(new Event('sociosphere_data_updated'));
  }

  return updated;
};

// Legacy object export for widgets in Admin.jsx
export const mockFinance = {
  totalCollected: 154000,
  pendingDues: 23000,
  monthlyExpenses: 89000,
  reserveFund: 480000,
  recentTransactions: [
    { id: 'TXN-01', type: 'Income', category: 'Maintenance Fee', amount: 3500, date: '2026-10-01', user: 'Block A - 707' },
    { id: 'TXN-02', type: 'Expense', category: 'Security Salaries', amount: 45000, date: '2026-10-01', user: 'Admin' },
    { id: 'TXN-03', type: 'Income', category: 'Maintenance Fee', amount: 3500, date: '2026-10-03', user: 'Block B - 402' },
  ]
};
