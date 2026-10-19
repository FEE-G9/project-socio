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
  Award,
  Building,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import UserAvatar from '../../components/ui/UserAvatar';
import { getUsers, addUser, approveUser, deleteUser } from '../../data/mockUsers';

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
  const [users, setUsers] = useState([]);
  
  // URL params check (e.g. ?tab=pending)
  const initialTab = new URLSearchParams(location.search).get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab); // 'all', 'members', 'residents', 'pending'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');

  // Modals
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New person form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    unitNumber: '',
    block: 'Block A',
    type: 'resident',
    designation: 'Resident (Owner)',
    avatarStyle: 'classic',
    emergencyContact: ''
  });

  // Load and listen for data updates
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

  // Compute counts
  const totalCount = users.length;
  const committeeCount = users.filter(u => u.type === 'member' || u.role === 'authority').length;
  const residentsCount = users.filter(u => u.type === 'resident' && u.status === 'Verified').length;
  const pendingCount = users.filter(u => u.status === 'Pending Approval').length;

  // Filter users based on tab, search query, and block
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // 1. Tab filter
      if (activeTab === 'members') {
        if (user.type !== 'member' && user.role !== 'authority') return false;
      } else if (activeTab === 'residents') {
        if (user.type !== 'resident' || user.status === 'Pending Approval') return false;
      } else if (activeTab === 'pending') {
        if (user.status !== 'Pending Approval') return false;
      }

      // 2. Block filter
      if (selectedBlock !== 'all') {
        const userBlock = user.block || '';
        const userUnit = user.unitNumber || '';
        if (!userBlock.includes(selectedBlock) && !userUnit.includes(selectedBlock)) {
          return false;
        }
      }

      // 3. Search filter (name, flat/unit, designation, phone, email)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = (user.name || '').toLowerCase().includes(query);
        const matchesUnit = (user.unitNumber || '').toLowerCase().includes(query);
        const matchesDesig = (user.designation || '').toLowerCase().includes(query);
        const matchesPhone = (user.phone || '').toLowerCase().includes(query);
        const matchesEmail = (user.email || '').toLowerCase().includes(query);
        return matchesName || matchesUnit || matchesDesig || matchesPhone || matchesEmail;
      }

      return true;
    });
  }, [users, activeTab, selectedBlock, searchQuery]);

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
    if (window.confirm(`Are you sure you want to remove ${name} from the directory?`)) {
      deleteUser(userId);
      if (selectedPerson && selectedPerson.id === userId) {
        setSelectedPerson(null);
      }
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.unitNumber.trim()) {
      alert('Please fill in at least the Name and Unit Number.');
      return;
    }

    const newUser = {
      ...formData,
      communityId: 'colony-1',
      communityName: 'Green Meadows Heights',
      status: 'Verified',
      role: formData.type === 'member' ? 'authority' : 'citizen'
    };

    addUser(newUser);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      unitNumber: '',
      block: 'Block A',
      type: 'resident',
      designation: 'Resident (Owner)',
      avatarStyle: 'classic',
      emergencyContact: ''
    });
  };

  return (
    <div className="space-y-8 pb-14">
      {/* =====================================================
          HEADER SECTION
      ===================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Society Directory
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              Live Synced
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Directory of verified residents, flat owners, and governing committee members of Green Meadows Heights.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-600/30 active:scale-95"
        >
          <UserPlus size={18} />
          <span>Add Person</span>
        </button>
      </div>

      {/* =====================================================
          KPI SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Directory",
            value: totalCount.toString(),
            trendLabel: "registered in society",
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
            trendLabel: "active households",
            trendDirection: "up",
            icon: UserCheck,
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500 dark:text-emerald-400",
            tabKey: "residents"
          },
          {
            label: "Pending Approvals",
            value: pendingCount.toString(),
            trendLabel: pendingCount > 0 ? "needs admin verification" : "all up to date",
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
        {/* CATEGORY TABS */}
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
              placeholder="Search by name, flat, role..."
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
          RESULTS STATS BAR
      ===================================================== */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-800 dark:text-slate-200">{filteredUsers.length}</strong> {filteredUsers.length === 1 ? 'person' : 'people'}
          {searchQuery && ` matching "${searchQuery}"`}
          {selectedBlock !== 'all' && ` in ${selectedBlock}`}
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
              ? `No members or residents match the search "${searchQuery}". Try a different name or unit.`
              : 'There are no records in this category.'}
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
                    ? 'border-amber-300 bg-gradient-to-br from-amber-500/5 via-white to-white dark:border-amber-500/40 dark:from-amber-500/10 dark:via-[#0D1524] dark:to-[#0D1524]'
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
                          title={isPending ? 'Pending Verification' : 'Verified Resident'}
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400 text-base transition-colors">
                          {person.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <MapPin size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
                          <span>{person.unitNumber || 'Unit unassigned'}</span>
                        </p>
                      </div>
                    </div>

                    {/* STATUS OR ROLE BADGE */}
                    {isPending ? (
                      <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 animate-pulse">
                        Pending
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

                  {/* DESIGNATION */}
                  <div className="mt-4">
                    <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${
                      isMember 
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40' 
                        : 'bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/40'
                    }`}>
                      {person.designation || (isMember ? 'Committee Lead' : 'Resident')}
                    </span>
                  </div>

                  {/* CONTACT INFO */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
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

                  {/* BADGES TAGS */}
                  {person.badges && person.badges.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {person.badges.slice(0, 2).map((badge, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        >
                          {badge}
                        </span>
                      ))}
                      {person.badges.length > 2 && (
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 dark:bg-slate-800">
                          +{person.badges.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {person.joinedDate || '2024'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isPending ? (
                      <button
                        onClick={(e) => handleApprove(person.id, e)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-all active:scale-95"
                      >
                        <CheckCircle2 size={13} />
                        <span>Approve</span>
                      </button>
                    ) : (
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
                    )}

                    <button
                      onClick={(e) => handleDelete(person.id, person.name, e)}
                      title="Remove Person"
                      aria-label="Remove person from directory"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
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
        onClose={() => setSelectedPerson(null)}
        title={selectedPerson?.type === 'member' ? "Committee Member Details" : "Resident Profile"}
        size="md"
      >
        {selectedPerson && (
          <div className="space-y-6">
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
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {selectedPerson.designation || 'Resident'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedPerson.communityName || 'Green Meadows Heights'}
                </p>
              </div>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Unit / Flat</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-500" />
                  {selectedPerson.unitNumber || 'Unassigned'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Status</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${selectedPerson.status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {selectedPerson.status}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Contact Number</span>
                <p className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <Phone size={14} className="text-blue-500" />
                  <a href={`tel:${selectedPerson.phone}`} className="hover:underline">{selectedPerson.phone || 'N/A'}</a>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-400">Member Since</span>
                <p className="font-bold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <Calendar size={14} className="text-purple-500" />
                  {selectedPerson.joinedDate || '2024'}
                </p>
              </div>
            </div>

            {/* EMAIL */}
            {selectedPerson.email && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-sm">
                <span className="text-xs font-semibold text-slate-400">Email Address</span>
                <p className="font-medium text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                  <Mail size={14} className="text-slate-400" />
                  <a href={`mailto:${selectedPerson.email}`} className="text-emerald-600 hover:underline dark:text-emerald-400">{selectedPerson.email}</a>
                </p>
              </div>
            )}

            {/* EMERGENCY CONTACT */}
            {selectedPerson.emergencyContact && (
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-sm">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert size={14} />
                  Emergency Contact
                </span>
                <p className="font-mono font-bold text-rose-900 dark:text-rose-200 mt-1">
                  {selectedPerson.emergencyContact}
                </p>
              </div>
            )}

            {/* BADGES & COMMENDATIONS */}
            {selectedPerson.badges && selectedPerson.badges.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Recognized Badges
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedPerson.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* MODAL ACTIONS */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={(e) => handleDelete(selectedPerson.id, selectedPerson.name, e)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 flex items-center gap-1"
              >
                <Trash2 size={14} />
                Delete Person
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
                <Button variant="secondary" onClick={() => setSelectedPerson(null)} className="text-xs">
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* =====================================================
          ADD RESIDENT / MEMBER MODAL
      ===================================================== */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Person to Directory"
        size="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Register a verified homeowner, tenant, or newly appointed management committee member.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Chandra"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  setFormData({
                    ...formData,
                    type: newType,
                    designation: newType === 'member' ? 'Committee Lead' : 'Resident (Owner)'
                  });
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 cursor-pointer"
              >
                <option value="resident">Resident</option>
                <option value="member">Committee Member</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Designation / Title
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Resident (Owner), RWA Secretary"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Block / Tower *
              </label>
              <select
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
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
                Unit / Flat Number *
              </label>
              <input
                type="text"
                required
                value={formData.unitNumber}
                onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                placeholder="e.g. Block A - 402"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 00000"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@sociosphere.io"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Emergency Contact (Optional)
            </label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              placeholder="e.g. +91 98765 11223 (Relative / Guard)"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Person
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Members;
