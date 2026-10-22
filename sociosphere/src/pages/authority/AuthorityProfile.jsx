import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  ShieldCheck,
  Pencil,
  Check,
  X,
  LogOut,
  Settings,
  Bell,
  Moon,
  Sun,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Users,
  CalendarDays,
  Award,
  Camera,
  BadgeCheck,
  TrendingUp,
  Activity,
  Star,
  Heart,
  MessageSquare,
  Lock,
  Globe,
  Smartphone,
  Building2,
  Hash,
  Briefcase,
  Calendar,
  Sparkles,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfile,
  selectProfileStats,
  updateProfile,
  setAvatarStyle
} from "../../store/slices/profileSlice";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getIssues } from "../../data/mockIssues";
import { getCrimes } from "../../data/mockCrimes";
import UserAvatar, { avatarStyles } from "../../components/ui/UserAvatar";

const AuthorityProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user: authUser, updateUserProfile, logout } = useAuth();

  // Redux Toolkit Profile State
  const reduxProfile = useSelector(selectProfile);
  const profile = reduxProfile || authUser || {};

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);

  // Form State for Editing
  const [editForm, setEditForm] = useState({
    name: profile.name || "Vansh Goyal",
    phone: profile.phone || "+91 90412 08572",
    age: profile.age || 20,
    occupation: profile.occupation || "Software Engineer",
    blockNumber: profile.blockNumber || "Block A",
    houseOrFlatNo: profile.houseOrFlatNo || "Flat 707",
    occupancyType: profile.occupancyType || "Flat Owner",
    emergencyContact: profile.emergencyContact || "+91 90412 08572",
    bio: profile.bio || "Elected RWA Administrator serving Gandhi Colony with modern civic management and digital governance."
  });

  // Sync editForm with profile updates
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || "Vansh Goyal",
        phone: profile.phone || "+91 90412 08572",
        age: profile.age || 20,
        occupation: profile.occupation || "Software Engineer",
        blockNumber: profile.blockNumber || "Block A",
        houseOrFlatNo: profile.houseOrFlatNo || "Flat 707",
        occupancyType: profile.occupancyType || "Flat Owner",
        emergencyContact: profile.emergencyContact || "+91 90412 08572",
        bio: profile.bio || "Elected RWA Administrator serving Gandhi Colony with modern civic management and digital governance."
      });
    }
  }, [profile.name, profile.phone, profile.age, profile.occupation, profile.blockNumber, profile.houseOrFlatNo, profile.occupancyType, profile.emergencyContact, profile.bio]);

  // Dynamic colony metrics
  const adminSociety = profile.society || "Gandhi Colony";
  const societyIssues = getIssues().filter(
    (i) => (i.society || i.colonyName || "").toLowerCase() === adminSociety.toLowerCase()
  );
  const resolvedIssues = societyIssues.filter((i) => i.status === "Resolved");
  const resolutionRate = societyIssues.length
    ? Math.round((resolvedIssues.length / societyIssues.length) * 100)
    : 100;

  const handleEdit = () => {
    setEditForm({
      name: profile.name || "Vansh Goyal",
      phone: profile.phone || "+91 90412 08572",
      age: profile.age || 20,
      occupation: profile.occupation || "Software Engineer",
      blockNumber: profile.blockNumber || "Block A",
      houseOrFlatNo: profile.houseOrFlatNo || "Flat 707",
      occupancyType: profile.occupancyType || "Flat Owner",
      emergencyContact: profile.emergencyContact || "+91 90412 08572",
      bio: profile.bio || ""
    });
    setIsEditing(true);
    setShowSaveSuccess(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowSaveSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);

    const updatedUnitNumber = editForm.houseOrFlatNo
      ? `${editForm.blockNumber} - ${editForm.houseOrFlatNo.trim()}`
      : editForm.blockNumber;

    const payload = {
      name: editForm.name.trim() || profile.name,
      phone: editForm.phone.trim(),
      age: parseInt(editForm.age, 10) || profile.age,
      occupation: editForm.occupation.trim(),
      blockNumber: editForm.blockNumber,
      houseOrFlatNo: editForm.houseOrFlatNo.trim(),
      unitNumber: updatedUnitNumber,
      occupancyType: editForm.occupancyType,
      emergencyContact: editForm.emergencyContact.trim(),
      bio: editForm.bio.trim()
    };

    setTimeout(() => {
      // 1. Dispatch update through Redux Toolkit
      dispatch(updateProfile(payload));

      // 2. Synchronize with AuthContext
      if (updateUserProfile) {
        updateUserProfile(payload);
      }

      setIsEditing(false);
      setIsSaving(false);
      setShowSaveSuccess(true);

      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3500);
    }, 600);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`space-y-8 pb-8 ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* ==================== SAVE SUCCESS TOAST ==================== */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 shadow-lg backdrop-blur-sm">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Admin profile updated and synchronized via Redux Toolkit!
            </span>
          </div>
        </div>
      )}

      {/* ==================== PAGE HEADER ==================== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Redux Toolkit Authority State
            </p>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Authority Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Official administrator credentials, residential flat record, and governance metrics.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0"
          >
            <Pencil size={16} className="transition-transform group-hover:rotate-12" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ==================== PROFILE HERO ==================== */}
      <section className="overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow dark:border-slate-800 dark:bg-[#0D1524]">
        {/* Cover Banner */}
        <div className="relative h-36 overflow-hidden rounded-t-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 sm:h-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.3),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_50%_60%,rgba(168,85,247,0.15),transparent_45%)]" />
          
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />

          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute right-16 top-4 h-24 w-24 rounded-full border-2 border-emerald-500/15" />
          <div className="absolute -left-8 -bottom-16 h-40 w-40 rounded-full border-2 border-blue-500/10" />
        </div>

        {/* Profile Info */}
        <div className="relative px-5 pb-6 sm:px-8 sm:pb-7">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-1 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div 
                className="relative shrink-0"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="flex h-28 w-28 overflow-hidden items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-teal-600 text-4xl font-extrabold text-white shadow-xl transition-all duration-300 hover:scale-105 dark:border-[#0D1524] sm:h-32 sm:w-32 sm:text-5xl">
                  <UserAvatar user={profile} className="h-full w-full rounded-none" iconSize={48} />
                </div>

                {avatarHover && (
                  <button 
                    type="button"
                    onClick={() => setAvatarPickerOpen((open) => !open)}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 transition-opacity duration-200"
                    aria-label="Choose avatar style"
                  >
                    <Camera size={24} className="text-white" />
                  </button>
                )}

                {avatarPickerOpen && (
                  <div className="absolute left-0 top-full z-20 mt-3 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    {avatarStyles.map((style) => {
                      const Icon = style.icon;
                      const isSelected = profile.avatarStyle === style.id;

                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            dispatch(setAvatarStyle(style.id));
                            if (updateUserProfile) {
                              updateUserProfile({ avatarStyle: style.id });
                            }
                            setAvatarPickerOpen(false);
                          }}
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${style.className} ring-2 ring-offset-2 transition-transform hover:scale-110 dark:ring-offset-slate-900 ${
                            isSelected ? "ring-emerald-500" : "ring-transparent"
                          }`}
                          title={style.label}
                          aria-label={`Choose ${style.label} avatar`}
                        >
                          <Icon size={18} />
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg dark:border-[#0D1524]">
                  <BadgeCheck size={16} strokeWidth={2.5} className="text-white" />
                </div>
              </div>

              <div className="min-w-0 flex-1 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 sm:text-3xl">
                    {profile.name || "Vansh Goyal"}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={13} />
                    Society Admin / RWA Head
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50 px-2.5 py-0.5 text-xs font-semibold">
                    {profile.designation || "RWA President (Flat Owner)"}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Building2 size={15} />
                    {profile.society || "Gandhi Colony"}
                    <span className="font-mono text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 ml-1">
                      {profile.societyCode || "GC-101"}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Home size={14} className="text-slate-400" />
                    {profile.unitNumber || `${profile.blockNumber || 'Block A'} - ${profile.houseOrFlatNo || 'Flat 707'}`}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} className="text-slate-400" />
                    {profile.occupation || "Software Engineer"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <MapPin size={14} className="text-emerald-500" />
              {profile.city || "Rajpura"}, Punjab
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ALL USER DATA: GRID SECTIONS ==================== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SECTION 1: PERSONAL INFORMATION */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1524] p-6 sm:p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Personal Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin demographics & primary contact
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Redux Managed
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              icon={User}
              label="Full Name"
              value={isEditing ? editForm.name : profile.name}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, name: val }))}
              placeholder="Full Name"
            />

            <ProfileField
              icon={Mail}
              label="Email Address"
              value={profile.email}
              editing={false}
              placeholder="Email Address"
            />

            <ProfileField
              icon={Phone}
              label="Phone Number"
              value={isEditing ? editForm.phone : profile.phone}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, phone: val }))}
              placeholder="Phone Number"
            />

            <ProfileField
              icon={Calendar}
              label="Age"
              value={isEditing ? editForm.age : `${profile.age || 20} years old`}
              editing={isEditing}
              type="number"
              onChange={(val) => setEditForm(prev => ({ ...prev, age: val }))}
              placeholder="Age"
            />

            <ProfileField
              icon={Briefcase}
              label="Occupation"
              value={isEditing ? editForm.occupation : profile.occupation}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, occupation: val }))}
              placeholder="Occupation"
            />

            <ProfileField
              icon={Phone}
              label="Emergency Contact"
              value={isEditing ? editForm.emergencyContact : profile.emergencyContact}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, emergencyContact: val }))}
              placeholder="Emergency Contact"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Administrator Statement / Bio
            </label>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
                placeholder="Admin bio..."
              />
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                {profile.bio || "Elected RWA Administrator serving Gandhi Colony with modern civic management and digital governance."}
              </p>
            )}
          </div>
        </section>

        {/* SECTION 2: RESIDENTIAL & SOCIETY DATA */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1524] p-6 sm:p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/20">
                <Building2 size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Residential Unit & Society Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin apartment allocation in {profile.society}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Admin Scoped
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ProfileField
              icon={Building2}
              label="Assigned Society (Locked)"
              value={profile.society}
              editing={false}
              placeholder="Assigned Society"
            />

            <ProfileField
              icon={Hash}
              label="Society Code (Locked)"
              value={profile.societyCode}
              editing={false}
              placeholder="Society Code"
            />

            <ProfileField
              icon={Hash}
              label="Block Number"
              value={isEditing ? editForm.blockNumber : profile.blockNumber}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, blockNumber: val }))}
              placeholder="e.g. Block A"
            />

            <ProfileField
              icon={Home}
              label="House / Flat No."
              value={isEditing ? editForm.houseOrFlatNo : profile.houseOrFlatNo}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, houseOrFlatNo: val }))}
              placeholder="e.g. Flat 707"
            />

            <ProfileField
              icon={Award}
              label="Occupancy Status"
              value={isEditing ? editForm.occupancyType : profile.occupancyType}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, occupancyType: val }))}
              placeholder="e.g. Flat Owner"
            />

            <ProfileField
              icon={MapPin}
              label="City & Region"
              value={`${profile.city || "Rajpura"}, Punjab`}
              editing={false}
              placeholder="City"
            />
          </div>

          <div className="mt-4 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Complete Admin Unit Address
            </span>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {profile.unitNumber || `${profile.blockNumber || 'Block A'} - ${profile.houseOrFlatNo || 'Flat 707'}`}
            </span>
          </div>
        </section>

        {/* SECTION 3: MEMBERSHIP, HONOURS & BADGES */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1524] p-6 sm:p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Governance Credentials & Badges
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Leadership status, security permissions & badges
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {profile.status || "Verified"}
            </span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Official Designation</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{profile.designation || "RWA President (Flat Owner)"}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">System Permissions</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Super Administrator (Full Civic Control)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Member Since</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{profile.joinedDate || "Jan 2024"}</span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 mt-3">Active Authority Badges</p>
              <div className="flex flex-wrap gap-2">
                {(profile.badges || ['Board President', 'System Administrator', 'Flat Owner', 'Tech Lead']).map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/10 to-emerald-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                  >
                    <Sparkles size={12} className="text-amber-500" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: SOCIETY CIVIC OVERSIGHT & METRICS */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1524] p-6 sm:p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                <Activity size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Society Civic Oversight
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Performance across {adminSociety}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Synced
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Total Society Issues</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{societyIssues.length}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Resolved Complaints</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{resolvedIssues.length}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Resolution Rate</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {resolutionRate}%
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Security Index</span>
              <span className="text-2xl font-extrabold text-emerald-500">
                98.4%
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Admin Command Center</span>
            <button
              onClick={() => navigate('/authority/issues')}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              Review Open Complaints <ChevronRight size={13} />
            </button>
          </div>
        </section>
      </div>

      {/* ==================== SIGN OUT SECTION ==================== */}
      <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 transition-all duration-300 hover:border-rose-500/30 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500 shadow-lg shadow-rose-500/20">
              <LogOut size={20} className="text-white" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Sign out of SocioSphere Authority
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Safely disconnect administrative session for {profile.name} ({profile.society}).
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-500 dark:text-rose-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/20"
          >
            <LogOut
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
            Log Out
          </button>
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   REUSABLE PROFILE FIELD
========================================================= */
const ProfileField = ({
  icon: Icon,
  label,
  value,
  editing,
  type = "text",
  onChange,
  placeholder,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group">
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all duration-200 ${
          editing
            ? isFocused
              ? "border-emerald-500 bg-white dark:bg-slate-900 shadow-md shadow-emerald-500/10"
              : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-400"
            : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60"
        }`}
      >
        <Icon
          size={16}
          className={`shrink-0 ${
            editing && isFocused
              ? "text-emerald-500"
              : "text-slate-400"
          }`}
        />

        {editing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 outline-none placeholder:text-slate-400"
          />
        ) : (
          <span className="min-w-0 truncate text-sm font-medium text-slate-800 dark:text-slate-200">
            {value || "Not available"}
          </span>
        )}

        {editing && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-slate-400 transition-colors hover:text-slate-200"
            aria-label={`Clear ${label}`}
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthorityProfile;
