import React, { useState, useEffect, useCallback } from 'react';
import { 
  Wallet, 
  IndianRupee, 
  TrendingUp, 
  TrendingDown,
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Send, 
  FileText, 
  Building2, 
  Plus, 
  User, 
  Phone, 
  X,
  CreditCard,
  Receipt,
  PieChart,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { 
  getSocietyMaintenanceRecords, 
  recordMaintenancePayment, 
  markFeePaid, 
  getSocietyExpenses, 
  addSocietyExpense, 
  approveSocietyExpense 
} from '../../data/mockFinance';
import { getUsers } from '../../data/mockUsers';

const ManageFees = () => {
  const { user } = useAuth();
  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  // Active Hub Tab: 'collections' | 'expenses' | 'overview'
  const [activeTab, setActiveTab] = useState('collections');

  // Maintenance Records & Expenses State (Loaded dynamically from persistent society database)
  const [records, setRecords] = useState(() => getSocietyMaintenanceRecords(adminSocietyCode, adminSociety));
  const [expenses, setExpenses] = useState(() => getSocietyExpenses(adminSocietyCode, adminSociety));

  const [feesSearch, setFeesSearch] = useState('');
  const [feesFilter, setFeesFilter] = useState('All');
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);

  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Toast State
  const [toastMsg, setToastMsg] = useState(null);

  // Form: Offline Maintenance Payment
  const [paymentForm, setPaymentForm] = useState({
    recordId: '',
    name: '',
    unit: '',
    amount: '3500',
    method: 'Cash (Received at RWA Office)',
    notes: ''
  });

  // Form: Vendor Bill / Colony Expense
  const [expenseForm, setExpenseForm] = useState({
    category: 'Repairs & Plumbing',
    vendor: '',
    invoiceNo: '',
    amount: '',
    method: 'Bank Transfer',
    notes: ''
  });

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Re-synchronize data whenever database changes or society changes
  const reloadData = useCallback(() => {
    const updatedRecords = getSocietyMaintenanceRecords(adminSocietyCode, adminSociety);
    const updatedExpenses = getSocietyExpenses(adminSocietyCode, adminSociety);
    setRecords(updatedRecords);
    setExpenses(updatedExpenses);
  }, [adminSocietyCode, adminSociety]);

  useEffect(() => {
    reloadData();

    const handleSync = () => {
      reloadData();
    };

    window.addEventListener('sociosphere_users_updated', handleSync);
    window.addEventListener('sociosphere_finance_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener('sociosphere_users_updated', handleSync);
      window.removeEventListener('sociosphere_finance_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [reloadData]);

  // Calculations for Maintenance Collections
  const totalCollected = records.filter(r => r.status === 'Paid').reduce((acc, r) => acc + (r.amount || 0), 0);
  const pendingDues = records.filter(r => r.status !== 'Paid').reduce((acc, r) => acc + (r.amount || 0), 0);
  const totalDuesExpected = totalCollected + pendingDues;
  const collectionRate = totalDuesExpected > 0 ? Math.round((totalCollected / totalDuesExpected) * 100) : 100;

  // Calculations for Colony Expenses
  const totalSpent = expenses.filter(e => e.status === 'Paid').reduce((acc, e) => acc + (e.amount || 0), 0);
  const pendingInvoices = expenses.filter(e => e.status !== 'Paid').reduce((acc, e) => acc + (e.amount || 0), 0);
  const monthlyBudget = adminSocietyCode === 'SN-202' ? 140000 : 160000;
  const budgetUtilization = Math.round((totalSpent / monthlyBudget) * 100);

  // Calculations for Reserve & Net Balance
  const netMonthlyCashflow = totalCollected - totalSpent;
  const reserveFundBalance = adminSocietyCode === 'SN-202' ? 390000 : 480000;

  // Filtered Collections
  const filteredRecords = records.filter(r => {
    if (feesFilter !== 'All' && r.status !== feesFilter) return false;
    if (feesSearch.trim()) {
      const q = feesSearch.toLowerCase();
      return (
        (r.name && r.name.toLowerCase().includes(q)) || 
        (r.unit && r.unit.toLowerCase().includes(q)) || 
        (r.id && r.id.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Filtered Expenses
  const filteredExpenses = expenses.filter(e => {
    if (expenseCategoryFilter !== 'All' && e.category !== expenseCategoryFilter) return false;
    if (expenseSearch.trim()) {
      const q = expenseSearch.toLowerCase();
      return (
        (e.vendor && e.vendor.toLowerCase().includes(q)) || 
        (e.category && e.category.toLowerCase().includes(q)) || 
        (e.invoiceNo && e.invoiceNo.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Actions: Collections
  const handleMarkPaid = (id, name) => {
    const updated = markFeePaid(adminSocietyCode, id, name);
    setRecords(updated);
    showToast(`✓ Payment recorded as Paid for ${name}! Receipt generated.`);
  };

  const handleSendReminder = (name, unit) => {
    showToast(`✓ Due payment reminder notice sent to ${name} (${unit}).`);
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentForm.name.trim()) return;

    const updated = recordMaintenancePayment(adminSocietyCode, {
      ...paymentForm,
      society: adminSociety
    });

    setRecords(updated);
    setIsRecordPaymentModalOpen(false);
    setPaymentForm({
      recordId: '',
      name: '',
      unit: '',
      amount: '3500',
      method: 'Cash (Received at RWA Office)',
      notes: ''
    });
    showToast(`✓ Payment of ₹${paymentForm.amount || 3500} recorded for ${paymentForm.name}! Receipt generated.`);
  };

  // Actions: Expenses
  const handleApproveBill = (id, vendor) => {
    const updated = approveSocietyExpense(adminSocietyCode, id);
    setExpenses(updated);
    showToast(`✓ Vendor invoice for ${vendor} approved & payout authorized!`);
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.vendor.trim() || !expenseForm.amount) return;

    const updated = addSocietyExpense(adminSocietyCode, {
      ...expenseForm,
      society: adminSociety
    });

    setExpenses(updated);
    setIsAddExpenseModalOpen(false);
    setExpenseForm({
      category: 'Repairs & Plumbing',
      vendor: '',
      invoiceNo: '',
      amount: '',
      method: 'Bank Transfer',
      notes: ''
    });
    showToast(`✓ Expense of ₹${expenseForm.amount} logged for ${expenseForm.vendor}!`);
  };

  // Export Combined Audit Report
  const exportFullAuditReport = () => {
    const lines = [
      `================================================================================`,
      `SOCIOSPHERE COMPREHENSIVE FINANCIAL AUDIT & LEDGER - ${adminSociety.toUpperCase()} (${adminSocietyCode})`,
      `Generated: ${new Date().toLocaleString()} | Officer: ${user?.name || 'Administrator'}`,
      `================================================================================`,
      ``,
      `--- FINANCIAL HEALTH SUMMARY ---`,
      `Total Maintenance Inflow Collected : ₹${totalCollected.toLocaleString()}`,
      `Total Outstanding Resident Dues    : ₹${pendingDues.toLocaleString()}`,
      `Total Colony Operating Outflow     : ₹${totalSpent.toLocaleString()}`,
      `Pending Vendor Invoices Awaiting   : ₹${pendingInvoices.toLocaleString()}`,
      `Monthly Operational Budget Cap     : ₹${monthlyBudget.toLocaleString()} (${budgetUtilization}% used)`,
      `Current Month Net Operating Balance: ₹${netMonthlyCashflow.toLocaleString()} (${netMonthlyCashflow >= 0 ? 'Surplus' : 'Deficit'})`,
      `Society Emergency Reserve Pool     : ₹${reserveFundBalance.toLocaleString()}`,
      ``,
      `--- SECTION 1: RESIDENT MAINTENANCE COLLECTIONS LEDGER (${records.length} Society Flats) ---`,
      `TXN ID          | RESIDENT NAME        | UNIT               | AMOUNT | STATUS   | METHOD               | RECEIPT NO    | DATE`,
      `------------------------------------------------------------------------------------------------------------------------`,
      ...records.map(r => `${(r.id || '').padEnd(15)} | ${(r.name || '').padEnd(20)} | ${(r.unit || '').padEnd(18)} | ₹${(r.amount || 0).toString().padEnd(5)} | ${(r.status || '').padEnd(8)} | ${(r.method || '').padEnd(20)} | ${(r.receiptNo || 'N/A').padEnd(13)} | ${r.date || 'N/A'}`),
      ``,
      `--- SECTION 2: COLONY EXPENDITURE & VENDOR PAYOUTS (${expenses.length} Invoices) ---`,
      `EXP ID   | CATEGORY                       | VENDOR                          | INVOICE #    | AMOUNT   | STATUS   | METHOD`,
      `------------------------------------------------------------------------------------------------------------------------`,
      ...expenses.map(e => `${(e.id || '').padEnd(8)} | ${(e.category || '').padEnd(30)} | ${(e.vendor || '').padEnd(31)} | ${(e.invoiceNo || '').padEnd(12)} | ₹${(e.amount || 0).toString().padEnd(7)} | ${(e.status || '').padEnd(8)} | ${e.method || 'Online'}`),
      ``,
      `================================================================================`,
      `AUDIT VERIFICATION: Certified compliant with RWA Society By-laws & Governance SOP.`,
      `================================================================================`
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-statement-${adminSociety.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Comprehensive Society Audit Statement exported successfully!');
  };

  return (
    <div className="space-y-8 pb-14">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Finance & Maintenance Hub
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Building2 size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <UserCheck size={12} />
              {records.length} Units Enrolled
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Live database synchronizing maintenance collections for all verified residents, vendor bills, and society balance sheet.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button 
            variant="secondary"
            onClick={reloadData}
            title="Refresh database records"
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw size={14} />
            Sync
          </Button>

          <Button 
            variant="secondary"
            onClick={exportFullAuditReport}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Download size={14} />
            Export Audit
          </Button>

          {activeTab === 'expenses' ? (
            <Button
              onClick={() => setIsAddExpenseModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              <Plus size={16} />
              Log Vendor Bill
            </Button>
          ) : (
            <Button
              onClick={() => {
                setPaymentForm({
                  recordId: '',
                  name: '',
                  unit: '',
                  amount: '3500',
                  method: 'Cash (Received at RWA Office)',
                  notes: ''
                });
                setIsRecordPaymentModalOpen(true);
              }}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              <Plus size={16} />
              Record Offline Payment
            </Button>
          )}
        </div>
      </div>

      {/* TOAST ALERT */}
      {toastMsg && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          toastMsg.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
        }`}>
          <span className="font-semibold text-sm">{toastMsg.text}</span>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* PRIMARY TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('collections')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'collections'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Wallet size={16} />
          <span>Maintenance Collections</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'collections' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            ₹{(totalCollected / 1000).toFixed(1)}k
          </span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingDown size={16} />
          <span>Colony Expenses & Payouts</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
            activeTab === 'expenses' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}>
            ₹{(totalSpent / 1000).toFixed(1)}k
          </span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 size={16} />
          <span>Financial Audit & Reserve</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-700 dark:text-purple-300 font-extrabold">
            Reserve: ₹{(reserveFundBalance / 100000).toFixed(2)}L
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MAINTENANCE COLLECTIONS                            */}
      {/* ========================================================= */}
      {activeTab === 'collections' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Collected", value: `₹${(totalCollected / 1000).toFixed(1)}k`, desc: `${records.filter(r => r.status === 'Paid').length} of ${records.length} Units Paid`, icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Pending Dues", value: `₹${(pendingDues / 1000).toFixed(1)}k`, desc: `${records.filter(r => r.status !== 'Paid').length} Flats Outstanding`, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Collection Rate", value: `${collectionRate}%`, desc: "Target: 95% on-time", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Society Reserve Fund", value: `₹${(reserveFundBalance / 100000).toFixed(2)}L`, desc: "Emergency maintenance pool", icon: IndianRupee, color: "text-purple-500", bg: "bg-purple-500/10" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{stat.value}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{stat.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filters & Search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['All', 'Paid', 'Pending', 'Overdue'].map(status => (
                  <button
                    key={status}
                    onClick={() => setFeesFilter(status)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      feesFilter === status 
                        ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {status} ({status === 'All' ? records.length : records.filter(r => r.status === status).length})
                  </button>
                ))}
              </div>

              <div className="relative sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resident, flat, or TXN..."
                  value={feesSearch}
                  onChange={(e) => setFeesSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Collections Table */}
            <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4 font-bold">Resident / Unit</th>
                      <th className="py-3 px-4 font-bold">Amount</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Payment Method</th>
                      <th className="py-3 px-4 font-bold">Receipt ID</th>
                      <th className="py-3 px-4 font-bold">Date Paid</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          No maintenance records match your search or filter.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map(record => {
                        const isPaid = record.status === 'Paid';
                        const isOverdue = record.status === 'Overdue';

                        return (
                          <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900 dark:text-slate-100">{record.name}</p>
                              <p className="text-[11px] text-slate-400">{record.unit}</p>
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-slate-100">
                              ₹{(record.amount || 3500).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                isPaid 
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                                  : isOverdue 
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' 
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                              {record.method}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                              {record.receiptNo || '—'}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {record.date}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {!isPaid ? (
                                  <>
                                    <button
                                      onClick={() => handleMarkPaid(record.id, record.name)}
                                      className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                    >
                                      Mark Paid
                                    </button>
                                    <button
                                      onClick={() => handleSendReminder(record.name, record.unit)}
                                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                      Remind
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 size={13} /> Paid
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: COLONY EXPENSES & VENDOR BILLS                     */}
      {/* ========================================================= */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {/* Expense KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Spent this Month", value: `₹${(totalSpent / 1000).toFixed(1)}k`, desc: `${expenses.filter(e => e.status === 'Paid').length} Invoices Cleared`, icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10" },
              { label: "Pending Approvals", value: `₹${(pendingInvoices / 1000).toFixed(1)}k`, desc: `${expenses.filter(e => e.status !== 'Paid').length} Vendor Bills`, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Budget Utilization", value: `${budgetUtilization}%`, desc: `₹${monthlyBudget.toLocaleString()} Total Cap`, icon: PieChart, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Projected Surplus", value: `₹${((monthlyBudget - totalSpent - pendingInvoices) / 1000).toFixed(1)}k`, desc: "Retained in reserve", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"
                >
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                      <Icon size={20} className={stat.color} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{stat.value}</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">{stat.label}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Filter and Search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['All', 'Security Salaries', 'Common Electricity', 'Lift AMC Maintenance', 'Sanitation & Housekeeping', 'Diesel Generator Backup', 'Gardening & Landscape'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setExpenseCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                      expenseCategoryFilter === cat 
                        ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search vendor, invoice, or category..."
                  value={expenseSearch}
                  onChange={(e) => setExpenseSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Expenses Table */}
            <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4 font-bold">Category & Vendor</th>
                      <th className="py-3 px-4 font-bold">Invoice #</th>
                      <th className="py-3 px-4 font-bold">Amount</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Payment Method</th>
                      <th className="py-3 px-4 font-bold">Date Paid</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredExpenses.map(expense => {
                      const isPaid = expense.status === 'Paid';

                      return (
                        <tr key={expense.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-slate-900 dark:text-slate-100">{expense.category}</p>
                            <p className="text-[11px] text-slate-400">{expense.vendor}</p>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            {expense.invoiceNo}
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-slate-100">
                            ₹{(expense.amount || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isPaid 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            }`}>
                              {expense.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                            {expense.method}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {expense.date}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {!isPaid ? (
                              <button
                                onClick={() => handleApproveBill(expense.id, expense.vendor)}
                                className="px-3 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                              >
                                Approve Payout
                              </button>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                                <CheckCircle2 size={13} /> Paid
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: FINANCIAL AUDIT & RESERVE FUND OVERVIEW            */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Balance Sheet KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Monthly Inflow</span>
                <ArrowUpRight size={20} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-emerald-900 dark:text-emerald-200 mt-3">₹{totalCollected.toLocaleString()}</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">From {records.filter(r => r.status === 'Paid').length} paid resident units</p>
            </div>

            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">Monthly Outflow</span>
                <ArrowDownRight size={20} className="text-rose-600 dark:text-rose-400" />
              </div>
              <p className="text-3xl font-black text-rose-900 dark:text-rose-200 mt-3">₹{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">Vendor contracts & utilities</p>
            </div>

            <div className={`rounded-2xl border p-5 ${
              netMonthlyCashflow >= 0 
                ? 'border-blue-500/30 bg-blue-500/10' 
                : 'border-amber-500/30 bg-amber-500/10'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  netMonthlyCashflow >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-amber-700 dark:text-amber-300'
                }`}>
                  Net Operational Balance
                </span>
                <ShieldCheck size={20} className={netMonthlyCashflow >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'} />
              </div>
              <p className={`text-3xl font-black mt-3 ${
                netMonthlyCashflow >= 0 ? 'text-blue-900 dark:text-blue-200' : 'text-amber-900 dark:text-amber-200'
              }`}>
                {netMonthlyCashflow >= 0 ? `+₹${netMonthlyCashflow.toLocaleString()}` : `-₹${Math.abs(netMonthlyCashflow).toLocaleString()}`}
              </p>
              <p className={`text-xs mt-1 ${
                netMonthlyCashflow >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-amber-700 dark:text-amber-300'
              }`}>
                {netMonthlyCashflow >= 0 ? 'Operating cash surplus' : 'Operating cash deficit'}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Reserve Fund Pool</span>
                <IndianRupee size={20} className="text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-3xl font-black text-purple-900 dark:text-purple-200 mt-3">₹{(reserveFundBalance / 100000).toFixed(2)}L</p>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">RWA Fixed Deposit & Emergency Corpus</p>
            </div>
          </div>

          {/* Breakdown & Governance Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-4">
                <PieChart size={18} className="text-indigo-500" />
                Expenditure Distribution Breakdown
              </h3>
              <div className="space-y-3.5">
                {expenses.slice(0, 6).map((item, idx) => {
                  const pct = totalSpent > 0 ? Math.round(((item.amount || 0) / totalSpent) * 100) : 0;
                  const colors = ['bg-indigo-600', 'bg-blue-500', 'bg-teal-500', 'bg-amber-500', 'bg-rose-500', 'bg-emerald-500'];
                  return (
                    <div key={item.id || idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{item.vendor} ({item.category})</span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">₹{(item.amount || 0).toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[idx % colors.length]} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-3">
                  <ShieldCheck size={18} className="text-emerald-500" />
                  RWA Financial Governance & Compliance
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  In compliance with Society By-laws and State Cooperative Regulations, all expenditures exceeding ₹10,000 are verified by dual authorization from the Treasurer and President.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="font-bold text-slate-900 dark:text-slate-100">Annual Audit Status</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">FY 2025-2026 books cleared with Zero Auditor Exceptions.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="font-bold text-slate-900 dark:text-slate-100">Emergency Reserve Sinking Fund</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">₹{(reserveFundBalance / 100000).toFixed(2)}L locked in State Bank Fixed Deposit (Interest: 7.1% p.a.).</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">Official Society Ledger</span>
                <Button 
                  onClick={exportFullAuditReport}
                  className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Download size={14} />
                  Download Complete Statement
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: RECORD OFFLINE MAINTENANCE PAYMENT               */}
      {/* ========================================================= */}
      <Modal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
        title="Record Offline Maintenance Payment"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
          {/* QUICK SELECT RESIDENT FROM LIVE SOCIETY DATABASE */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Society Resident (Quick Select)
            </label>
            <select
              value={paymentForm.recordId || ''}
              onChange={(e) => {
                const selId = e.target.value;
                if (!selId) {
                  setPaymentForm(prev => ({ ...prev, recordId: '', name: '', unit: '' }));
                  return;
                }
                const found = records.find(r => r.id === selId);
                if (found) {
                  setPaymentForm(prev => ({
                    ...prev,
                    recordId: found.id,
                    name: found.name,
                    unit: found.unit,
                    amount: (found.amount || 3500).toString()
                  }));
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">-- Choose Resident or Enter Manually Below --</option>
              {records.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.unit}) — Due: ₹{(r.amount || 3500).toLocaleString()} [{r.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Resident Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Vikram Malhotra"
              value={paymentForm.name}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Apartment / Unit *
              </label>
              <input
                type="text"
                required
                placeholder="Block A - Flat 502"
                value={paymentForm.unit}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentForm.method}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, method: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="Cash (Received at RWA Office)">Cash (Received at RWA Office)</option>
              <option value="Bank Cheque / Demand Draft">Bank Cheque / Demand Draft</option>
              <option value="NEFT / Direct IMPS Transfer">Bank NEFT / Direct IMPS Transfer</option>
              <option value="Office POS Card Swipe">Office POS Card Swipe</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Cheque Number
            </label>
            <input
              type="text"
              placeholder="e.g., Cheque #492011 HDFC Bank"
              value={paymentForm.notes}
              onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsRecordPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Record & Generate Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: LOG VENDOR BILL / COLONY EXPENSE                 */}
      {/* ========================================================= */}
      <Modal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setIsAddExpenseModalOpen(false)}
        title="Log Vendor Bill / Society Expenditure"
      >
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Vendor Name / Contractor *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Schindler Elevators India Pvt Ltd"
              value={expenseForm.vendor}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, vendor: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Expenditure Category
              </label>
              <select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Security Salaries">Security Salaries</option>
                <option value="Common Electricity">Common Electricity</option>
                <option value="Lift AMC Maintenance">Lift AMC Maintenance</option>
                <option value="Sanitation & Housekeeping">Sanitation & Housekeeping</option>
                <option value="Diesel Generator Backup">Diesel Generator Backup</option>
                <option value="Gardening & Landscape">Gardening & Landscape</option>
                <option value="Repairs & Plumbing">Repairs & Plumbing</option>
                <option value="Administration & Legal">Administration & Legal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="15000"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Invoice / Bill Number
              </label>
              <input
                type="text"
                placeholder="INV-2026-904"
                value={expenseForm.invoiceNo}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, invoiceNo: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={expenseForm.method}
                onChange={(e) => setExpenseForm(prev => ({ ...prev, method: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Bank Transfer">Bank Transfer (NEFT / RTGS)</option>
                <option value="Cheque">Society Official Cheque</option>
                <option value="Online Portal">Online Portal / Card</option>
                <option value="Petty Cash">RWA Office Petty Cash</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsAddExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Record & Authorize Bill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFees;
