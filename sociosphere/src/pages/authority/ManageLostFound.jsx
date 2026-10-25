import React, { useState, useMemo } from 'react';
import { 
  PackageSearch, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Shield, 
  MapPin, 
  Tag, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Eye, 
  Check, 
  X, 
  Building2, 
  Archive,
  Download,
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import { useLostFound } from '../../context/LostFoundContext';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  "All",
  "Electronics",
  "Wallets & Cards",
  "Keys",
  "Jewelry & Watches",
  "Clothing & Bags",
  "Documents",
  "Pets",
  "Other"
];

const ManageLostFound = () => {
  const { items, addItem, updateItem, deleteItem, resolveClaim, markAsResolved } = useLostFound();
  const { user } = useAuth();

  const adminSociety = user?.society || user?.communityName || 'Gandhi Colony';
  const adminSocietyCode = user?.societyCode || (
    adminSociety === 'Gandhi Colony' ? 'GC-101' :
    adminSociety === 'Shayam Nagar' ? 'SN-202' : 'DV-303'
  );

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'custody' | 'claims' | 'resolved'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [actionToast, setActionToast] = useState(null);

  // New deposit form state
  const [depositForm, setDepositForm] = useState({
    title: '',
    type: 'found',
    category: 'Electronics',
    location: 'Gate 1 Security Desk',
    storageLocker: 'Locker B-04',
    description: '',
    securityHint: '',
    depositedBy: 'Security Guard Vikram Singh',
    contactPhone: '+91 98000 00001',
    image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
  });

  const showToast = (message, type = 'success') => {
    setActionToast({ message, type });
    setTimeout(() => setActionToast(null), 4000);
  };

  // Filter items strictly for this admin's society
  const societyItems = useMemo(() => {
    return (items || []).filter(item => {
      if (!item) return false;
      const itemSoc = (item.society || item.communityName || item.colonyName || item.colony || '').trim().toLowerCase();
      if (itemSoc && itemSoc === adminSociety.toLowerCase()) return true;
      if (adminSociety.toLowerCase() === 'gandhi colony' && (!itemSoc || itemSoc === 'green meadows heights' || item.societyCode === 'GC-101')) {
        return true;
      }
      return false;
    });
  }, [items, adminSociety]);

  // Derived counts
  const totalCount = societyItems.length;
  const inCustodyCount = societyItems.filter(i => i.type === 'found' && i.status !== 'claimed' && i.status !== 'resolved').length;
  const pendingClaimsList = useMemo(() => {
    const list = [];
    societyItems.forEach(item => {
      (item.claims || []).forEach(claim => {
        if (claim.status === 'pending') {
          list.push({ item, claim });
        }
      });
    });
    return list;
  }, [societyItems]);
  const reunitedCount = societyItems.filter(i => i.status === 'claimed' || i.status === 'resolved').length;

  // Filter by tab, category, search
  const filteredItems = useMemo(() => {
    return societyItems.filter(item => {
      // Tab filter
      if (activeTab === 'custody') {
        if (item.type !== 'found' || item.status === 'claimed' || item.status === 'resolved') return false;
      } else if (activeTab === 'resolved') {
        if (item.status !== 'claimed' && item.status !== 'resolved') return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesLoc = item.location?.toLowerCase().includes(q);
        const matchesReporter = item.reportedBy?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLoc && !matchesReporter) return false;
      }

      return true;
    });
  }, [societyItems, activeTab, selectedCategory, searchTerm]);

  // Handle new item deposit
  const handleDepositSubmit = (e) => {
    e.preventDefault();
    if (!depositForm.title.trim()) return;

    addItem({
      title: depositForm.title,
      type: depositForm.type,
      category: depositForm.category,
      location: depositForm.location,
      description: `${depositForm.description} [RWA Storage: ${depositForm.storageLocker}]`,
      securityHint: depositForm.securityHint,
      reportedBy: depositForm.depositedBy,
      phone: depositForm.contactPhone,
      society: adminSociety,
      societyCode: adminSocietyCode,
      colonyName: adminSociety,
      image: depositForm.image,
      storageLocker: depositForm.storageLocker,
      status: 'open'
    });

    setIsDepositModalOpen(false);
    setDepositForm({
      title: '',
      type: 'found',
      category: 'Electronics',
      location: 'Gate 1 Security Desk',
      storageLocker: 'Locker B-04',
      description: '',
      securityHint: '',
      depositedBy: 'Security Guard Vikram Singh',
      contactPhone: '+91 98000 00001',
      image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    });
    showToast(`✓ Item "${depositForm.title}" logged in security custody at ${depositForm.storageLocker}!`);
  };

  // Handle claim approval / rejection
  const handleClaimAction = (itemId, claimId, action, claimantName) => {
    resolveClaim(itemId, claimId, action);
    if (action === 'approved') {
      showToast(`✓ Claim approved for ${claimantName}. Property verified and marked reunited!`);
    } else {
      showToast(`Claim rejected for ${claimantName}. Status updated.`, 'info');
    }
  };

  // Export custody ledger
  const exportCustodyLedger = () => {
    const lines = [
      `SOCIOSPHERE PROPERTY CUSTODY REGISTRY - ${adminSociety.toUpperCase()} (${adminSocietyCode})`,
      `Generated: ${new Date().toLocaleString()}`,
      `Officer: ${user?.name || 'Administrator'}`,
      '--------------------------------------------------------------------------------',
      'ID | TYPE | TITLE | CATEGORY | STATUS | LOCATION / CUSTODY | REPORTED BY',
      '--------------------------------------------------------------------------------',
      ...societyItems.map(i => `${i.id} | ${i.type.toUpperCase()} | ${i.title} | ${i.category} | ${i.status.toUpperCase()} | ${i.location} | ${i.reportedBy}`)
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lost-found-custody-${adminSociety.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Custody ledger exported successfully!');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Lost & Found Custody Desk
            </h1>
            <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Building2 size={12} />
              {adminSociety} ({adminSocietyCode})
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage society lost property, security gate custody lockers, and resident ownership claim verifications.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button 
            variant="secondary"
            onClick={exportCustodyLedger}
            className="flex items-center gap-1.5 text-xs font-bold"
          >
            <Download size={14} />
            Export Ledger
          </Button>

          <Button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            <Plus size={16} />
            Log Guard Custody Deposit
          </Button>
        </div>
      </div>

      {/* Action Toast */}
      {actionToast && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in fade-in duration-200 ${
          actionToast.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
            : 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200'
        }`}>
          <span className="font-semibold text-sm">{actionToast.message}</span>
          <button onClick={() => setActionToast(null)} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: "Total Colony Reports", 
            value: totalCount, 
            desc: "Lost & found combined", 
            icon: PackageSearch, 
            color: "text-blue-500", 
            bg: "bg-blue-500/10",
            tab: "all"
          },
          { 
            label: "In Guard Custody", 
            value: inCustodyCount, 
            desc: "Stored in RWA lockers", 
            icon: ShieldCheck, 
            color: "text-emerald-500", 
            bg: "bg-emerald-500/10",
            tab: "custody"
          },
          { 
            label: "Pending Claim Reviews", 
            value: pendingClaimsList.length, 
            desc: "Awaiting ownership verification", 
            icon: AlertTriangle, 
            color: "text-amber-500", 
            bg: "bg-amber-500/10",
            badge: pendingClaimsList.length > 0 ? `${pendingClaimsList.length} Action Needed` : null,
            tab: "claims"
          },
          { 
            label: "Reunited to Owners", 
            value: reunitedCount, 
            desc: "Successfully returned", 
            icon: CheckCircle2, 
            color: "text-purple-500", 
            bg: "bg-purple-500/10",
            tab: "resolved"
          }
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              onClick={() => setActiveTab(stat.tab)}
              className={`rounded-2xl border p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm ${
                activeTab === stat.tab 
                  ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-sm' 
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#0D1524]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
                {stat.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-amber-500 text-white animate-pulse">
                    {stat.badge}
                  </span>
                )}
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

      {/* Tabs & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Items', count: totalCount },
              { id: 'custody', label: 'Security Custody', count: inCustodyCount },
              { id: 'claims', label: 'Pending Claims', count: pendingClaimsList.length, alert: pendingClaimsList.length > 0 },
              { id: 'resolved', label: 'Returned Archive', count: reunitedCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  tab.alert 
                    ? 'bg-amber-500 text-white' 
                    : activeTab === tab.id 
                    ? 'bg-white/20 text-white dark:text-slate-950' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search items, lockers, residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CLAIMS REVIEW DESK VIEW */}
        {activeTab === 'claims' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Ownership Claims Requiring Admin / Security Verification
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verify claimant identity, unique markings, or serial numbers before authorizing property release.
                </p>
              </div>
            </div>

            {pendingClaimsList.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-3" />
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">All Claims Cleared</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">There are no pending resident property claims at this time.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingClaimsList.map(({ item, claim }) => (
                  <Card key={claim.id} className="p-5 border-2 border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/10 dark:from-amber-950/20 dark:via-[#0D1524] dark:to-amber-950/10">
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-200/60 dark:border-amber-700/40">
                      <div className="flex items-start gap-3">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" 
                        />
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 uppercase">
                            {item.category}
                          </span>
                          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-1">{item.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> {item.location}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">{item.id}</span>
                    </div>

                    <div className="py-3 space-y-2">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          <span className="flex items-center gap-1">
                            <User size={13} className="text-emerald-500" />
                            Claimant: {claim.claimantName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {new Date(claim.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap mb-2">
                          {claim.claimantPhone && <span className="flex items-center gap-1"><Phone size={11} /> {claim.claimantPhone}</span>}
                          {claim.claimantEmail && <span className="flex items-center gap-1"><Mail size={11} /> {claim.claimantEmail}</span>}
                        </div>
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-slate-700 dark:text-slate-300">
                          <p className="font-bold text-amber-800 dark:text-amber-300 text-[11px] mb-0.5">Proof Description / Identifying Marks:</p>
                          <p className="italic">"{claim.proofDescription || 'Resident did not leave explicit note; claimed ownership directly.'}"</p>
                        </div>
                      </div>

                      {item.securityHint && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 p-2 rounded-lg">
                          <strong className="text-slate-700 dark:text-slate-300">Secret Verification Hint:</strong> {item.securityHint}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={() => handleClaimAction(item.id, claim.id, 'rejected', claim.claimantName)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        Reject False Claim
                      </button>
                      <button
                        onClick={() => handleClaimAction(item.id, claim.id, 'approved', claim.claimantName)}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all flex items-center gap-1"
                      >
                        <Check size={14} />
                        Approve Handover & Reunited
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ALL ITEMS & CUSTODY GRID */
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <Card className="p-12 text-center">
                <PackageSearch size={40} className="mx-auto text-slate-400 mb-3" />
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">No items match your filter</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search criteria or log a new custody item.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => {
                  const isClaimed = item.status === 'claimed' || item.status === 'resolved';
                  const isFound = item.type === 'found';
                  const pendingClaims = (item.claims || []).filter(c => c.status === 'pending');

                  return (
                    <Card 
                      key={item.id} 
                      className={`overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                        isClaimed ? 'opacity-85 border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        {/* Image & Type Pill */}
                        <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden group">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${
                              isFound 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-rose-600 text-white'
                            }`}>
                              {isFound ? 'Found / In Custody' : 'Reported Lost'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur">
                              {item.category}
                            </span>
                          </div>

                          <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                            isClaimed 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-emerald-500/90 text-white'
                          }`}>
                            {isClaimed ? 'Reunited ✓' : 'Active'}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                              <span>{item.date || 'Recently logged'}</span>
                              <span className="font-mono text-[11px] font-bold">{item.id}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base line-clamp-1">{item.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                              <MapPin size={13} className="text-emerald-500 shrink-0" />
                              <span className="line-clamp-1">{item.location}</span>
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {item.description || 'No description provided.'}
                          </p>

                          {/* Storage & Reporter Tag */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-medium">
                              <User size={12} /> {item.reportedBy || 'Security Staff'}
                            </span>
                            {item.storageLocker && (
                              <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                {item.storageLocker}
                              </span>
                            )}
                          </div>

                          {/* Pending Claims Pill */}
                          {pendingClaims.length > 0 && (
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-700 dark:text-amber-400">
                                {pendingClaims.length} Claim Pending
                              </span>
                              <button 
                                onClick={() => setActiveTab('claims')}
                                className="text-[11px] font-bold text-amber-800 dark:text-amber-300 underline"
                              >
                                Review Now
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 pt-0 border-t-0 flex items-center justify-between gap-2">
                        <Button
                          variant="secondary"
                          className="w-full text-xs font-bold py-1.5"
                          onClick={() => setSelectedItem(item)}
                        >
                          View Details
                        </Button>
                        {!isClaimed && (
                          <Button
                            className="w-full text-xs font-bold py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => {
                              markAsResolved(item.id, 'Verified and returned to owner by RWA Authority.');
                              showToast(`✓ Item "${item.title}" marked as reunited to owner!`);
                            }}
                          >
                            Mark Reunited
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ITEM DETAILS MODAL */}
      {selectedItem && (
        <Modal 
          isOpen={Boolean(selectedItem)} 
          onClose={() => setSelectedItem(null)} 
          title={`Property Record: ${selectedItem.id}`}
        >
          <div className="space-y-4">
            <div className="relative h-48 w-full rounded-xl overflow-hidden">
              <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-slate-900/90 text-white">
                  {selectedItem.type.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                  {selectedItem.category}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedItem.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                <MapPin size={13} className="text-emerald-500" />
                {selectedItem.location} • Logged on {selectedItem.date || 'Recent'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Society Campus:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedItem.society || adminSociety} ({selectedItem.societyCode || adminSocietyCode})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Storage / Custody Locker:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedItem.storageLocker || 'Security Control Desk'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Logged By:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{selectedItem.reportedBy} ({selectedItem.phone || 'On File'})</span>
              </div>
              {selectedItem.securityHint && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-amber-700 dark:text-amber-400">Secret Verification Hint:</span>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">{selectedItem.securityHint}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedItem.description}
            </p>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                Close
              </Button>
              {selectedItem.status !== 'claimed' && selectedItem.status !== 'resolved' && (
                <Button 
                  onClick={() => {
                    markAsResolved(selectedItem.id, 'Handed over by RWA Office.');
                    setSelectedItem(null);
                    showToast(`✓ Item "${selectedItem.title}" marked as reunited!`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Mark Reunited & Handed Over
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* LOG GUARD CUSTODY DEPOSIT MODAL */}
      <Modal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        title="Log Security Guard Property Deposit"
      >
        <form onSubmit={handleDepositSubmit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log an item turned into the {adminSociety} security control room or found on society grounds.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Apple AirPods Pro in White Case"
              value={depositForm.title}
              onChange={(e) => setDepositForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={depositForm.category}
                onChange={(e) => setDepositForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Storage Locker / Shelf #
              </label>
              <input
                type="text"
                value={depositForm.storageLocker}
                onChange={(e) => setDepositForm(prev => ({ ...prev, storageLocker: e.target.value }))}
                placeholder="e.g., Locker A-12"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location Found
              </label>
              <input
                type="text"
                value={depositForm.location}
                onChange={(e) => setDepositForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., Central Park Jogging Track"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Deposited By (Guard / Staff)
              </label>
              <input
                type="text"
                value={depositForm.depositedBy}
                onChange={(e) => setDepositForm(prev => ({ ...prev, depositedBy: e.target.value }))}
                placeholder="Guard Vikram Singh"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description / Condition Notes
            </label>
            <textarea
              rows={2}
              value={depositForm.description}
              onChange={(e) => setDepositForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., White charging case has slight scratch on bottom right. 80% battery."
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Secret Verification Hint (Hidden from public)
            </label>
            <input
              type="text"
              value={depositForm.securityHint}
              onChange={(e) => setDepositForm(prev => ({ ...prev, securityHint: e.target.value }))}
              placeholder="e.g., Serial number ends in 8910 or sticker on back"
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs outline-none focus:border-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsDepositModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Save Custody Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageLostFound;
