import React, { useState } from 'react';
import { 
  TrendingDown, 
  IndianRupee, 
  Receipt, 
  Building2, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  PieChart,
  Calendar
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';

const INITIAL_EXPENSES = [
  { id: 'EXP-101', category: 'Security Salaries', vendor: 'SIS Security Agency Pvt Ltd', invoiceNo: 'INV-2026-901', amount: 45000, date: '2026-10-01', status: 'Paid', method: 'Bank Transfer' },
  { id: 'EXP-102', category: 'Common Electricity', vendor: 'PSPCL Power Grid', invoiceNo: 'BILL-OCT-4412', amount: 28500, date: '2026-10-05', status: 'Paid', method: 'Online Portal' },
  { id: 'EXP-103', category: 'Lift AMC Maintenance', vendor: 'Schindler Elevators India', invoiceNo: 'AMC-Q3-199', amount: 15000, date: '2026-10-10', status: 'Paid', method: 'NEFT' },
  { id: 'EXP-104', category: 'Sanitation & Housekeeping', vendor: 'CleanTech Facility Solutions', invoiceNo: 'INV-2026-88', amount: 18000, date: '2026-10-12', status: 'Paid', method: 'Bank Transfer' },
  { id: 'EXP-105', category: 'Diesel Generator Backup', vendor: 'HPCL Fuel Station Rajpura', invoiceNo: 'DSL-2026-402', amount: 12000, date: '2026-10-18', status: 'Paid', method: 'Card' },
  { id: 'EXP-106', category: 'Gardening & Landscape', vendor: 'GreenFlora Nursery & Landscaping', invoiceNo: 'GF-OCT-12', amount: 8500, date: '2026-10-20', status: 'Pending Approval', method: 'Cheque' },
  { id: 'EXP-107', category: 'CCTV Cloud & Server Storage', vendor: 'SecureCloud Technologies', invoiceNo: 'SC-2026-009', amount: 4200, date: '2026-10-22', status: 'Pending Approval', method: 'Online' },
];

const ManageExpenses = () => {
  const { user } = useAuth();
  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  const [formData, setFormData] = useState({
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

  const totalSpent = expenses.filter(e => e.status === 'Paid').reduce((acc, e) => acc + e.amount, 0);
  const pendingInvoices = expenses.filter(e => e.status !== 'Paid').reduce((acc, e) => acc + e.amount, 0);
  const monthlyBudget = 160000;
  const budgetUtilization = Math.round((totalSpent / monthlyBudget) * 100);

  const filteredExpenses = expenses.filter(e => {
    if (categoryFilter !== 'All' && e.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return e.vendor.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.invoiceNo.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApproveBill = (id, vendor) => {
    setExpenses(prev => prev.map(e => {
      if (e.id === id) {
        return { ...e, status: 'Paid' };
      }
      return e;
    }));
    showToast(`✓ Vendor invoice for ${vendor} approved & payout authorized!`);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.vendor.trim() || !formData.amount) return;

    const newExpense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      category: formData.category,
      vendor: formData.vendor.trim(),
      invoiceNo: formData.invoiceNo.trim() || `INV-${Date.now().toString().slice(-5)}`,
      amount: parseInt(formData.amount, 10) || 5000,
      date: new Date().toISOString().split('T')[0],
      status: 'Paid',
      method: formData.method
    };

    setExpenses(prev => [newExpense, ...prev]);
    setIsAddModalOpen(false);
    setFormData({
      category: 'Repairs & Plumbing',
      vendor: '',
      invoiceNo: '',
      amount: '',
      method: 'Bank Transfer',
      notes: ''
    });
    showToast(`✓ Expense of ₹${newExpense.amount} logged for ${newExpense.vendor}!`);
  };

  const exportAuditReport = () => {
    const lines = [
      `================================================================================`,
      `SOCIETY EXPENDITURE & AUDIT LEDGER - ${adminSociety.toUpperCase()} (${adminSocietyCode})`,
      `Generated: ${new Date().toLocaleString()} | Officer: ${user?.name || 'Administrator'}`,
      `Monthly Budget: ₹${monthlyBudget.toLocaleString()} | Total Spent: ₹${totalSpent.toLocaleString()} | Utilization: ${budgetUtilization}%`,
      `================================================================================`,
      `EXP ID | CATEGORY | VENDOR NAME | INVOICE # | AMOUNT | STATUS | PAYMENT METHOD | DATE`,
      `--------------------------------------------------------------------------------`,
      ...expenses.map(e => `${e.id} | ${e.category} | ${e.vendor} | ${e.invoiceNo} | ₹${e.amount.toLocaleString()} | ${e.status} | ${e.method} | ${e.date}`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `society-expenses-${adminSociety.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Expenditure audit report exported!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Colony Expenditure & Vendor Ledger
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Building2 size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain vendor contracts, AMC payments, operational bills, and budget utilization audits.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="secondary"
            onClick={exportAuditReport}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Download size={14} />
            Export Audit
          </Button>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            <Plus size={16} />
            Log Vendor Bill
          </Button>
        </div>
      </div>

      {/* Toast Alert */}
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

      {/* Metrics Row */}
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
            {['All', 'Security Salaries', 'Common Electricity', 'Lift AMC Maintenance', 'Sanitation & Housekeeping', 'Diesel Generator Backup'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  categoryFilter === cat 
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                        ₹{expense.amount.toLocaleString()}
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

      {/* LOG VENDOR BILL MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Vendor Bill / Society Expenditure"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Vendor Name / Contractor *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Schindler Elevators India Pvt Ltd"
              value={formData.vendor}
              onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Expenditure Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
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
                value={formData.invoiceNo}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNo: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData(prev => ({ ...prev, method: e.target.value }))}
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
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Record & Authorize Bill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageExpenses;
