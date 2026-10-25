import React, { useState } from 'react';
import { 
  Wallet, 
  IndianRupee, 
  TrendingUp, 
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
  Receipt
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import { mockFinance } from '../../data/mockFinance';
import { getUsers } from '../../data/mockUsers';

const SAMPLE_FEES_RECORDS = [
  { id: 'TXN-801', name: 'Vansh Goyal', unit: 'Block A - Flat 707', amount: 3500, status: 'Paid', date: '2026-10-01', method: 'Online UPI', receiptNo: 'REC-2026-707' },
  { id: 'TXN-802', name: 'Aarav Sharma', unit: 'Block B - Flat 402', amount: 3500, status: 'Paid', date: '2026-10-03', method: 'Net Banking', receiptNo: 'REC-2026-402' },
  { id: 'TXN-803', name: 'Priya Patel', unit: 'Block A - Flat 304', amount: 3500, status: 'Paid', date: '2026-10-05', method: 'Online UPI', receiptNo: 'REC-2026-304' },
  { id: 'TXN-804', name: 'Rohan Verma', unit: 'Block C - Flat 105', amount: 3500, status: 'Overdue', date: '2026-09-01', method: 'Pending', receiptNo: null },
  { id: 'TXN-805', name: 'Ananya Iyer', unit: 'Block B - Flat 201', amount: 3500, status: 'Paid', date: '2026-10-04', method: 'Credit Card', receiptNo: 'REC-2026-201' },
  { id: 'TXN-806', name: 'Vikram Malhotra', unit: 'Block A - Flat 502', amount: 3500, status: 'Pending', date: '2026-10-15', method: 'Pending', receiptNo: null },
  { id: 'TXN-807', name: 'Neha Gupta', unit: 'Block C - Flat 301', amount: 3500, status: 'Paid', date: '2026-10-02', method: 'Online UPI', receiptNo: 'REC-2026-301' },
  { id: 'TXN-808', name: 'Arjun Nambiar', unit: 'Block A - Flat 204', amount: 3500, status: 'Overdue', date: '2026-09-10', method: 'Pending', receiptNo: null },
];

const ManageFees = () => {
  const { user } = useAuth();
  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [records, setRecords] = useState(SAMPLE_FEES_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // New offline payment form
  const [paymentForm, setPaymentForm] = useState({
    name: '',
    unit: 'Block A - Flat 101',
    amount: '3500',
    method: 'Cash',
    notes: ''
  });

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  const totalCollected = records.filter(r => r.status === 'Paid').reduce((acc, r) => acc + r.amount, 0);
  const pendingDues = records.filter(r => r.status !== 'Paid').reduce((acc, r) => acc + r.amount, 0);
  const collectionRate = Math.round((totalCollected / (totalCollected + pendingDues)) * 100);

  const filteredRecords = records.filter(r => {
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.unit.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleMarkPaid = (id, name) => {
    setRecords(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'Paid',
          date: new Date().toISOString().split('T')[0],
          method: 'Cheque / Cash Verified',
          receiptNo: `REC-${Date.now().toString().slice(-6)}`
        };
      }
      return r;
    }));
    showToast(`✓ Payment recorded as Paid for ${name}! Receipt generated.`);
  };

  const handleSendReminder = (name, unit) => {
    showToast(`✓ Due payment reminder notice sent to ${name} (${unit}).`);
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentForm.name.trim()) return;

    const newRecord = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      name: paymentForm.name.trim(),
      unit: paymentForm.unit.trim(),
      amount: parseInt(paymentForm.amount, 10) || 3500,
      status: 'Paid',
      date: new Date().toISOString().split('T')[0],
      method: paymentForm.method,
      receiptNo: `REC-${Date.now().toString().slice(-6)}`
    };

    setRecords(prev => [newRecord, ...prev]);
    setIsRecordPaymentModalOpen(false);
    setPaymentForm({
      name: '',
      unit: 'Block A - Flat 101',
      amount: '3500',
      method: 'Cash',
      notes: ''
    });
    showToast(`✓ Payment of ₹${newRecord.amount} recorded for ${newRecord.name}!`);
  };

  const exportLedger = () => {
    const lines = [
      `SOCIETY MAINTENANCE COLLECTION REGISTER - ${adminSociety.toUpperCase()} (${adminSocietyCode})`,
      `Generated: ${new Date().toLocaleString()}`,
      `Total Collected: ₹${totalCollected.toLocaleString()} | Pending: ₹${pendingDues.toLocaleString()} | Rate: ${collectionRate}%`,
      '--------------------------------------------------------------------------------',
      'TXN ID | RESIDENT NAME | UNIT | AMOUNT | STATUS | METHOD | RECEIPT NO | DATE',
      '--------------------------------------------------------------------------------',
      ...records.map(r => `${r.id} | ${r.name} | ${r.unit} | ₹${r.amount} | ${r.status} | ${r.method} | ${r.receiptNo || 'N/A'} | ${r.date}`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maintenance-ledger-${adminSociety.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Monthly maintenance ledger downloaded successfully!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Maintenance Fees & Resident Ledger
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Building2 size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track monthly maintenance dues, offline payments, resident receipts, and society reserve collections.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="secondary"
            onClick={exportLedger}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Download size={14} />
            Export Ledger
          </Button>

          <Button
            onClick={() => setIsRecordPaymentModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            <Plus size={16} />
            Record Offline Payment
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
          { label: "Total Collected", value: `₹${(totalCollected / 1000).toFixed(1)}k`, desc: `${records.filter(r => r.status === 'Paid').length} Units Paid`, icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Dues", value: `₹${(pendingDues / 1000).toFixed(1)}k`, desc: `${records.filter(r => r.status !== 'Paid').length} Units Pending`, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: "Collection Rate", value: `${collectionRate}%`, desc: "Target: 95% on-time", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Society Reserve Fund", value: "₹4.80L", desc: "Emergency maintenance pool", icon: IndianRupee, color: "text-purple-500", bg: "bg-purple-500/10" },
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
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  statusFilter === status 
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
              placeholder="Search by name, flat, or TXN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 font-bold">Resident / Flat</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Payment Method</th>
                  <th className="py-3 px-4 font-bold">Receipt ID</th>
                  <th className="py-3 px-4 font-bold">Date Paid</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRecords.map(record => {
                  const isPaid = record.status === 'Paid';
                  const isOverdue = record.status === 'Overdue';

                  return (
                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{record.name}</p>
                        <p className="text-[11px] text-slate-400">{record.unit}</p>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-slate-100">
                        ₹{record.amount.toLocaleString()}
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
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* RECORD PAYMENT MODAL */}
      <Modal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
        title="Record Offline Maintenance Payment"
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
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
              <option value="Cash">Cash (Received at RWA Office)</option>
              <option value="Cheque">Bank Cheque / Demand Draft</option>
              <option value="NEFT / Direct Transfer">Bank NEFT / IMPS Transfer</option>
              <option value="Offline POS">Office Card POS Swipe</option>
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
    </div>
  );
};

export default ManageFees;
