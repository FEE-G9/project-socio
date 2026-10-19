import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BadgeCheck,
  AlertCircle,
  Trash2,
  CheckCircle2,
  X,
  ChevronRight,
  Eye,
  EyeOff,
  Key,
  Award,
  Building,
  Building2,
  Clock,
  Sparkles,
  ShieldAlert,
  Briefcase,
  Home
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import UserAvatar from '../../components/ui/UserAvatar';
import { useAuth } from '../../context/AuthContext';
import { getUsers, addUser, approveUser, deleteUser } from '../../data/mockUsers';
import { getColonies } from '../../data/mockColonies';

/* =========================================================
   TREND ARROW SVG (Consistent with SocioSphere KPIs)
========================================================= */
const TrendArrow = ({ direction = "up" }) => {
  const isUp = direction === "up";
  return (
    <svg
      viewBox="0 0 90 60"
      className={`h-10 w-14 ${isUp ? "text-emerald-400" : "text-rose-500"}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {isUp ? (
        <>
          <polyline points="6,40 25,50 48,27 62,38 84,8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="69,8 84,8 84,23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <polyline points="6,15 27,7 47,30 61,20 84,48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="69,48 84,48 84,33" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
};

const Members = () => {
  const location = useLocation();
  const { user: currentAdmin } = useAuth();
  const colonies = getColonies();

  const [users, setUsers] = useState([]);

  // Default society: current admin's society if set, else 'Gandhi Colony'
  const defaultSociety = currentAdmin?.society || currentAdmin?.communityName || 'Gandhi Colony';
  const [selectedSociety, setSelectedSociety] = useState(defaultSociety);

  // URL query check (?tab=pending)
  const initialTab = new URLSearchParams(location.search).get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab); // 'all', 'members', 'residents', 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');

  // Modals
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add person form state & validation
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    society: defaultSociety,
    occupation: '',
    blockNumber: 'Block A',
    houseOrFlatNo: '',
    type: 'resident',
    designation: 'Resident (Owner)',
    emergencyContact: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Sync users from storage & listen for changes
  useEffect(() => {
    const loadData = () => {
      setUsers(getUsers());
    };
    loadData();

    window.addEventListener('sociosphere_users_updated', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('sociosphere_users_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // Update society default if admin changes
  useEffect(() => {
    if (currentAdmin?.society || currentAdmin?.communityName) {
      const adminSoc = currentAdmin.society || currentAdmin.communityName;
      setSelectedSociety(adminSoc);
      setAddFormData(prev => ({ ...prev, society: adminSoc }));
    }
  }, [currentAdmin?.society, currentAdmin?.communityName]);

  // Filter users first by society
  const societyUsers = useMemo(() => {
    if (selectedSociety === 'all') return users;
    return users.filter(u => 
      (u.society || '').toLowerCase() === selectedSociety.toLowerCase() ||
      (u.communityName || '').toLowerCase() === selectedSociety.toLowerCase()
    );
  }, [users, selectedSociety]);

  // Compute counts for the selected society
  const totalCount = societyUsers.length;
  const committeeCount = societyUsers.filter(u => u.type === 'member' || u.role === 'authority').length;
  const residentsCount = societyUsers.filter(u => u.type === 'resident' && u.status === 'Verified').length;
  const pendingCount = societyUsers.filter(u => u.status === 'Pending Approval').length;

  // Secondary filtering: tab, search query, block
  const filteredUsers = useMemo(() => {
    return societyUsers.filter(person => {
      // 1. Tab filter
      if (activeTab === 'members') {
        if (person.type !== 'member' && person.role !== 'authority') return false;
      } else if (activeTab === 'residents') {
        if (person.type !== 'resident' || person.status === 'Pending Approval') return false;
      } else if (activeTab === 'pending') {
        if (person.status !== 'Pending Approval') return false;
      }

      // 2. Block filter
      if (selectedBlock !== 'all') {
        const blk = person.blockNumber || person.block || '';
        const unit = person.unitNumber || '';
        if (!blk.includes(selectedBlock) && !unit.includes(selectedBlock)) {
          return false;
        }
      }

      // 3. Search query filter (Name, flat, occupation, phone, email, designation)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (person.name || '').toLowerCase().includes(q);
        const matchesUnit = (person.unitNumber || '').toLowerCase().includes(q) || (person.houseOrFlatNo || '').toLowerCase().includes(q);
        const matchesOcc = (person.occupation || '').toLowerCase().includes(q);
        const matchesDesig = (person.designation || '').toLowerCase().includes(q);
        const matchesPhone = (person.phone || '').toLowerCase().includes(q);
        const matchesEmail = (person.email || '').toLowerCase().includes(q);
        const matchesAge = (person.age ? person.age.toString() : '').includes(q);
        return matchesName || matchesUnit || matchesOcc || matchesDesig || matchesPhone || matchesEmail || matchesAge;
      }

      return true;
    });
  }, [societyUsers, activeTab, selectedBlock, searchQuery]);

  // Actions
  const handleApprove = (userId, e) => {
    if (e) e.stopPropagation();
    approveUser(userId);
    if (selectedPerson && selectedPerson.id === userId) {
      setSelectedPerson(prev => prev ? { ...prev, status: 'Verified' } : null);
    }
  };

  const handleDelete = (userId, name, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove ${name} from the society database?`)) {
      deleteUser(userId);
      if (selectedPerson && selectedPerson.id === userId) {
        setSelectedPerson(null);
      }
    }
  };

  // Form Validation for Adding Person
  const validateAddForm = () => {
    const errs = {};
    if (!addFormData.name.trim()) {
      errs.name = "Full Name is required";
    } else if (addFormData.name.trim().length < 3) {
      errs.name = "Name must be at least 3 characters";
    }

    if (!addFormData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addFormData.email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!addFormData.phone.trim()) {
      errs.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(addFormData.phone.trim().replace(/\D/g, ""))) {
      errs.phone = "Must be a valid 10-digit phone number";
    }

    if (!addFormData.age) {
      errs.age = "Age is required";
    } else {
      const a = parseInt(addFormData.age, 10);
      if (isNaN(a) || a < 18 || a > 100) errs.age = "Age must be between 18 and 100";
    }

    if (!addFormData.occupation.trim()) {
      errs.occupation = "Occupation is required";
    }

    if (!addFormData.houseOrFlatNo.trim()) {
      errs.houseOrFlatNo = "House / Flat No is required";
    }

    return errs;
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const errs = validateAddForm();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const colonyObj = colonies.find(c => c.name === addFormData.society) || colonies[0];
    const socCode = colonyObj?.code || (
      addFormData.society === "Gandhi Colony" ? "GC-101" :
      addFormData.society === "Shayam Nagar" ? "SN-202" : "DV-303"
    );

    const isMember = addFormData.type === 'member';

    addUser({
      name: addFormData.name.trim(),
      email: addFormData.email.trim().toLowerCase(),
      phone: `+91 ${addFormData.phone.trim().replace(/\D/g, "")}`,
      age: parseInt(addFormData.age, 10),
      society: addFormData.society,
      societyCode: socCode,
      communityName: addFormData.society,
      communityId: colonyObj.id,
      occupation: addFormData.occupation.trim(),
      blockNumber: addFormData.blockNumber,
      houseOrFlatNo: addFormData.houseOrFlatNo.trim(),
      unitNumber: `${addFormData.blockNumber} - ${addFormData.houseOrFlatNo.trim()}`,
      type: addFormData.type,
      role: isMember ? 'authority' : 'citizen',
      designation: addFormData.designation || (isMember ? 'Committee Official' : 'Resident (Owner)'),
      emergencyContact: addFormData.emergencyContact.trim(),
      status: 'Verified',
      avatarStyle: isMember ? 'shield' : 'classic',
      badges: isMember ? ['Committee Member'] : ['Verified Resident']
    });

    setIsAddModalOpen(false);
    setFormErrors({});
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      society: selectedSociety !== 'all' ? selectedSociety : 'Gandhi Colony',
      occupation: '',
      blockNumber: 'Block A',
      houseOrFlatNo: '',
      type: 'resident',
      designation: 'Resident (Owner)',
      emergencyContact: ''
    });
  };

  const activeColonyObj = colonies.find(c => c.name === selectedSociety);

  return (
    <div className="space-y-8 pb-14">
      {/* =====================================================
          HEADER SECTION WITH SOCIETY SWITCHER
      ===================================================== */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Society Directory & Members
            </h1>
            {activeColonyObj && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-black tracking-wider text-emerald-700 dark:text-emerald-400">
                Code: {activeColonyObj.code}
              </span>
            )}
            <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
              Live Database
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Registered residents, council members, and pending verification requests for {selectedSociety === 'all' ? 'all communities' : selectedSociety}.
          </p>
        </div>

        {/* TOP CONTROLS: SOCIETY SELECTOR + ADD BUTTON */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Building2 size={16} className="text-emerald-500" />
            <select
              value={selectedSociety}
              onChange={(e) => {
                setSelectedSociety(e.target.value);
                setAddFormData(prev => ({ ...prev, society: e.target.value !== 'all' ? e.target.value : 'Gandhi Colony' }));
              }}
              aria-label="Switch active society database view"
              className="bg-transparent outline-none cursor-pointer pr-2 font-bold"
            >
              <option value="Gandhi Colony" className="dark:bg-slate-800">Gandhi Colony (GC-101)</option>
              <option value="Shayam Nagar" className="dark:bg-slate-800">Shayam Nagar (SN-202)</option>
              <option value="Dalima Vihar" className="dark:bg-slate-800">Dalima Vihar (DV-303)</option>
              <option value="all" className="dark:bg-slate-800">All Societies (Combined)</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95"
          >
            <UserPlus size={17} />
            <span>Add Person</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          KPI SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Directory",
            value: totalCount.toString(),
            trendLabel: `enrolled in ${selectedSociety === 'all' ? 'all societies' : selectedSociety}`,
            trendDirection: "up",
            icon: Users,
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500 dark:text-blue-400",
            tabKey: "all"
          },
          {
            label: "Committee Members",
            value: committeeCount.toString(),
            trendLabel: "governing body & leads",
            trendDirection: "up",
            icon: Award,
            iconBg: "bg-purple-500/10",
            iconColor: "text-purple-500 dark:text-purple-400",
            tabKey: "members"
          },
          {
            label: "Verified Residents",
            value: residentsCount.toString(),
            trendLabel: "active verified households",
            trendDirection: "up",
            icon: UserCheck,
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500 dark:text-emerald-400",
            tabKey: "residents"
          },
          {
            label: "Pending Approvals",
            value: pendingCount.toString(),
            trendLabel: pendingCount > 0 ? "needs admin verification" : "no pending requests",
            trendDirection: pendingCount > 0 ? "down" : "up",
            icon: pendingCount > 0 ? AlertCircle : ShieldCheck,
            iconBg: pendingCount > 0 ? "bg-amber-500/10" : "bg-teal-500/10",
            iconColor: pendingCount > 0 ? "text-amber-500 dark:text-amber-400" : "text-teal-500 dark:text-teal-400",
            tabKey: "pending"
          }
        ].map((stat) => {
          const Icon = stat.icon;
          const isSelected = activeTab === stat.tabKey;
          return (
            <div
              key={stat.label}
              onClick={() => setActiveTab(stat.tabKey)}
              className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isSelected
                  ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-[#0D1524]"
                  : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-[#0D1524] dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon size={19} className={stat.iconColor} />
                </div>
                <div className="transition-transform duration-200 group-hover:scale-105">
                  <TrendArrow direction={stat.trendDirection} />
                </div>
              </div>
              <div className="mt-5">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">{stat.label}</p>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{stat.trendLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          FILTER TABS & SEARCH CONTROLS
      ===================================================== */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All People', count: totalCount },
            { id: 'members', label: 'Committee Members', count: committeeCount, icon: Award },
            { id: 'residents', label: 'Residents', count: residentsCount, icon: Users },
            { id: 'pending', label: 'Pending Approvals', count: pendingCount, icon: AlertCircle, badgeColor: 'bg-amber-500 text-white' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md dark:bg-emerald-500 dark:text-slate-950'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-700/60'
                }`}
              >
                {Icon && <Icon size={16} />}
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950'
                      : tab.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH AND BLOCK FILTER */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* SEARCH BAR */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, flat, age, job..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/60 dark:bg-slate-800/90 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* BLOCK FILTER DROPDOWN */}
          <div className="relative">
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              aria-label="Filter by Society Block"
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-8 text-sm font-semibold text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/60 dark:bg-slate-800/90 dark:text-slate-200 cursor-pointer"
            >
              <option value="all">All Blocks</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
              <option value="Tower A">Tower A</option>
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          RESULTS BAR
      ===================================================== */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredUsers.length}</strong> {filteredUsers.length === 1 ? 'person' : 'people'} in <strong className="text-emerald-600 dark:text-emerald-400">{selectedSociety}</strong>
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedBlock !== 'all' && ` (${selectedBlock})`}
        </span>
        {(searchQuery || selectedBlock !== 'all' || activeTab !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBlock('all');
              setActiveTab('all');
            }}
            className="text-emerald-600 hover:underline dark:text-emerald-400 font-bold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* =====================================================
          DIRECTORY CARDS GRID
      ===================================================== */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-[#0D1524]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 mb-4">
            <Search size={26} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No people found</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {searchQuery
              ? `No residents or committee members in ${selectedSociety} match "${searchQuery}".`
              : activeTab === 'pending'
              ? `No pending join requests waiting for approval in ${selectedSociety}.`
              : `There are currently no records under this filter.`}
          </p>
          {(searchQuery || selectedBlock !== 'all') && (
            <Button
              variant="secondary"
              className="mt-4 text-xs"
              onClick={() => {
                setSearchQuery('');
                setSelectedBlock('all');
              }}
            >
              Clear Search & Filter
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredUsers.map((person) => {
            const isMember = person.type === 'member' || person.role === 'authority';
            const isPending = person.status === 'Pending Approval';

            return (
              <div
                key={person.id}
                onClick={() => setSelectedPerson(person)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                  isPending
                    ? 'border-amber-300 bg-gradient-to-br from-amber-500/10 via-white to-white dark:border-amber-500/40 dark:from-amber-500/15 dark:via-[#0D1524] dark:to-[#0D1524]'
                    : isMember
                    ? 'border-purple-200/80 bg-gradient-to-br from-purple-500/5 via-white to-white dark:border-purple-500/30 dark:from-purple-500/10 dark:via-[#0D1524] dark:to-[#0D1524]'
                    : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0D1524]'
                }`}
              >
                {/* TOP ROW: AVATAR & BADGES */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <UserAvatar user={person} className="h-12 w-12 text-base" iconSize={20} />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            isPending ? 'bg-amber-400' : 'bg-emerald-500'
                          }`}
                          title={isPending ? 'Pending Admin Approval' : 'Verified Resident'}
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400 text-base transition-colors">
                          {person.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                          <span>{person.unitNumber || `${person.blockNumber} - ${person.houseOrFlatNo}`}</span>
                        </p>
                      </div>
                    </div>

                    {/* STATUS OR ROLE BADGE */}
                    {isPending ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse">
                        Join Request
                      </span>
                    ) : isMember ? (
                      <span className="shrink-0 rounded-full bg-purple-100 px-2.5 py-1 text-[11px] font-bold text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 flex items-center gap-1">
                        <Award size={12} />
                        Committee
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {person.occupancyType || 'Resident'}
                      </span>
                    )}
                  </div>

                  {/* DESIGNATION & SOCIETY CODE */}
                  <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                    <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${
                      isMember 
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40' 
                        : 'bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40'
                    }`}>
                      {person.designation || (isMember ? 'Committee Official' : 'Resident')}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {person.societyCode || (person.society === 'Gandhi Colony' ? 'GC-101' : person.society === 'Shayam Nagar' ? 'SN-202' : 'DV-303')}
                    </span>
                  </div>

                  {/* AGE & OCCUPATION INFO */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/60 pt-2.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <Briefcase size={13} className="text-slate-400 shrink-0" />
                      <span className="truncate">{person.occupation || 'Professional'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400 shrink-0" />
                      <span>{person.age ? `${person.age} yrs` : 'Adult'}</span>
                    </div>
                  </div>

                  {/* CONTACT INFO */}
                  <div className="mt-2.5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    {person.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-700 dark:text-slate-300">{person.phone}</span>
                      </div>
                    )}
                    {person.email && (
                      <div className="flex items-center gap-2 truncate">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{person.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Clock size={12} />
                    {person.joinedDate || '2024'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isPending ? (
                      <>
                        <button
                          onClick={(e) => handleApprove(person.id, e)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-95"
                          title="Approve join request"
                        >
                          <CheckCircle2 size={13} />
                          <span>Approve & Admit</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(person.id, person.name, e)}
                          className="flex items-center gap-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-400 px-2.5 py-1.5 text-xs font-bold transition-all"
                          title="Decline request"
                        >
                          <X size={13} />
                          <span>Decline</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPerson(person);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                        >
                          <Eye size={13} />
                          <span>Details</span>
                        </button>
                        <button
                          onClick={(e) => handleDelete(person.id, person.name, e)}
                          title="Remove Person"
                          aria-label="Remove person from directory"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================
          PERSON DETAIL MODAL
      ===================================================== */}
      <Modal
        isOpen={!!selectedPerson}
        onClose={() => {
          setSelectedPerson(null);
          setShowPasswordInModal(false);
        }}
        title={selectedPerson?.type === 'member' ? "Committee Member Record" : "Resident Society Dossier"}
        size="md"
      >
        {selectedPerson && (
          <div className="space-y-5">
            {/* PROFILE HEADER */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <UserAvatar user={selectedPerson} className="h-16 w-16 text-xl shadow-md" iconSize={26} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                    {selectedPerson.name}
                  </h2>
                  {selectedPerson.status === 'Verified' && (
                    <BadgeCheck size={18} className="text-emerald-500 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedPerson.designation || 'Resident'}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    {selectedPerson.societyCode || 'GC-101'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {selectedPerson.society || selectedPerson.communityName || 'Gandhi Colony'}
                </p>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Block & Flat</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{selectedPerson.unitNumber || `${selectedPerson.blockNumber} - ${selectedPerson.houseOrFlatNo}`}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Occupation / Job</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-blue-500 shrink-0" />
                  <span className="truncate">{selectedPerson.occupation || 'Resident'}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Age</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <Calendar size={14} className="text-purple-500 shrink-0" />
                  <span>{selectedPerson.age ? `${selectedPerson.age} years old` : 'Adult'}</span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Account Status</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${selectedPerson.status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{selectedPerson.status}</span>
                </p>
              </div>
            </div>

            {/* CONTACT INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Mobile Phone</span>
                <p className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <Phone size={14} className="text-slate-400" />
                  <a href={`tel:${selectedPerson.phone}`} className="hover:underline">{selectedPerson.phone || 'N/A'}</a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Email Address</span>
                <p className="font-medium text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5 truncate">
                  <Mail size={14} className="text-slate-400 shrink-0" />
                  <a href={`mailto:${selectedPerson.email}`} className="text-emerald-600 hover:underline dark:text-emerald-400 truncate">{selectedPerson.email}</a>
                </p>
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            {selectedPerson.emergencyContact && (
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-sm">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert size={14} />
                  Emergency Guard / Family Contact
                </span>
                <p className="font-mono font-bold text-rose-900 dark:text-rose-200 mt-1">
                  {selectedPerson.emergencyContact}
                </p>
              </div>
            )}

            {/* PORTAL ACCESS PASSWORD (ADMIN CREDENTIAL INSPECTION) */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Key size={13} className="text-amber-500" />
                  Resident Portal Password (Admin View)
                </span>
                <button
                  type="button"
                  onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  {showPasswordInModal ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPasswordInModal ? 'Hide Password' : 'Show Password'}</span>
                </button>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className="font-mono font-bold text-slate-900 dark:text-slate-100">
                  {showPasswordInModal ? (selectedPerson.password || 'password123') : '••••••••••••'}
                </p>
                <span className="text-[10px] text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">
                  Realistic Human Password
                </span>
              </div>
            </div>

            {/* MODAL ACTIONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={(e) => handleDelete(selectedPerson.id, selectedPerson.name, e)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete Record
              </button>

              <div className="flex items-center gap-2">
                {selectedPerson.status === 'Pending Approval' && (
                  <Button
                    onClick={() => handleApprove(selectedPerson.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={15} />
                    Approve Registration
                  </Button>
                )}
                <Button variant="secondary" onClick={() => { setSelectedPerson(null); setShowPasswordInModal(false); }} className="text-xs">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* =====================================================
          ADD RESIDENT / MEMBER MODAL (WITH COMPLETE VALIDATION)
      ===================================================== */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Person to Society"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4" noValidate>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add a verified resident, tenant, or council member to the society database with validation.
          </p>

          {/* NAME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={addFormData.name}
              onChange={(e) => {
                setAddFormData({ ...addFormData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: null });
              }}
              placeholder="e.g. Ramesh Chandra"
              className={`w-full rounded-xl border p-2.5 text-sm outline-none transition ${
                formErrors.name 
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" 
                  : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              }`}
            />
            {formErrors.name && <p className="mt-1 text-xs text-rose-500 font-semibold">{formErrors.name}</p>}
          </div>

          {/* EMAIL & PHONE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={addFormData.email}
                onChange={(e) => {
                  setAddFormData({ ...addFormData, email: e.target.value });
                  if (formErrors.email) setFormErrors({ ...formErrors, email: null });
                }}
                placeholder="name@sociosphere.io"
                className={`w-full rounded-xl border p-2.5 text-sm outline-none transition ${
                  formErrors.email 
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" 
                    : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              />
              {formErrors.email && <p className="mt-1 text-xs text-rose-500 font-semibold">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Phone (10 Digits) *
              </label>
              <input
                type="tel"
                value={addFormData.phone}
                onChange={(e) => {
                  setAddFormData({ ...addFormData, phone: e.target.value });
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: null });
                }}
                placeholder="9876543210"
                maxLength={10}
                className={`w-full rounded-xl border p-2.5 text-sm outline-none transition ${
                  formErrors.phone 
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" 
                    : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              />
              {formErrors.phone && <p className="mt-1 text-xs text-rose-500 font-semibold">{formErrors.phone}</p>}
            </div>
          </div>

          {/* AGE & OCCUPATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Age *
              </label>
              <input
                type="number"
                min={18}
                max={100}
                value={addFormData.age}
                onChange={(e) => {
                  setAddFormData({ ...addFormData, age: e.target.value });
                  if (formErrors.age) setFormErrors({ ...formErrors, age: null });
                }}
                placeholder="e.g. 34"
                className={`w-full rounded-xl border p-2.5 text-sm outline-none transition ${
                  formErrors.age 
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" 
                    : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              />
              {formErrors.age && <p className="mt-1 text-xs text-rose-500 font-semibold">{formErrors.age}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Occupation / Job *
              </label>
              <input
                type="text"
                value={addFormData.occupation}
                onChange={(e) => {
                  setAddFormData({ ...addFormData, occupation: e.target.value });
                  if (formErrors.occupation) setFormErrors({ ...formErrors, occupation: null });
                }}
                placeholder="e.g. Doctor, Architect"
                className={`w-full rounded-xl border p-2.5 text-sm outline-none transition ${
                  formErrors.occupation 
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" 
                    : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              />
              {formErrors.occupation && <p className="mt-1 text-xs text-rose-500 font-semibold">{formErrors.occupation}</p>}
            </div>
          </div>

          {/* SOCIETY SELECTION */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Society / Colony *
            </label>
            <select
              value={addFormData.society}
              onChange={(e) => setAddFormData({ ...addFormData, society: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer"
            >
              <option value="Gandhi Colony">Gandhi Colony (Code: GC-101)</option>
              <option value="Shayam Nagar">Shayam Nagar (Code: SN-202)</option>
              <option value="Dalima Vihar">Dalima Vihar (Code: DV-303)</option>
            </select>
          </div>

          {/* BLOCK & HOUSE / FLAT NUMBER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Block Number *
              </label>
              <select
                value={addFormData.blockNumber}
                onChange={(e) => setAddFormData({ ...addFormData, blockNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
                <option value="Block D">Block D</option>
                <option value="Tower A">Tower A</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                House / Flat No *
              </label>
              <input
                type="text"
                value={addFormData.houseOrFlatNo}
                onChange={(e) => {
                  setAddFormData({ ...addFormData, houseOrFlatNo: e.target.value });
                  if (formErrors.houseOrFlatNo) setFormErrors({ ...formErrors, houseOrFlatNo: null });
                }}
                placeholder="e.g. Flat 304"
                className={`w-full rounded-xl border p-2.5 text-sm outline-none transition ${
                  formErrors.houseOrFlatNo 
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" 
                    : "border-slate-200 bg-slate-50 focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                }`}
              />
              {formErrors.houseOrFlatNo && <p className="mt-1 text-xs text-rose-500 font-semibold">{formErrors.houseOrFlatNo}</p>}
            </div>
          </div>

          {/* CATEGORY & DESIGNATION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Role Category *
              </label>
              <select
                value={addFormData.type}
                onChange={(e) => {
                  const t = e.target.value;
                  setAddFormData({
                    ...addFormData,
                    type: t,
                    designation: t === 'member' ? 'Committee Lead' : 'Resident (Owner)'
                  });
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="resident">Resident Citizen</option>
                <option value="member">Committee Official</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                value={addFormData.designation}
                onChange={(e) => setAddFormData({ ...addFormData, designation: e.target.value })}
                placeholder="e.g. Resident (Owner), Treasurer"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* EMERGENCY CONTACT */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Emergency Contact (Optional)
            </label>
            <input
              type="text"
              value={addFormData.emergencyContact}
              onChange={(e) => setAddFormData({ ...addFormData, emergencyContact: e.target.value })}
              placeholder="+91 98765 00000 (Gate Guard / Relative)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save to Database
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Members;
