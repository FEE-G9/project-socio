import React, { useEffect, useState } from "react";
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
  Globe,
  Building2,
  Hash,
  Briefcase,
  Calendar,
  Sparkles,
  Shield,
  HeartHandshake
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectProfile,
  updateProfile,
  setAvatarStyle
} from "../../store/slices/profileSlice";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getIssues } from "../../data/mockIssues";
import UserAvatar, { avatarStyles } from "../../components/ui/UserAvatar";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user: authUser, updateUserProfile, logout } = useAuth();
  const isSettingsPage = location.pathname.endsWith("/settings");

  // Redux Toolkit Profile State
  const reduxProfile = useSelector(selectProfile);

  // Active profile fallback
  const profile = reduxProfile || authUser || {};

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarHover, setAvatarHover] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [ownIssues, setOwnIssues] = useState([]);

  // Form State for Editing
  const [editForm, setEditForm] = useState({
    name: profile.name || "",
    phone: profile.phone || "",
    age: profile.age || 25,
    occupation: profile.occupation || "",
    blockNumber: profile.blockNumber || "Block A",
    houseOrFlatNo: profile.houseOrFlatNo || "",
    occupancyType: profile.occupancyType || "Flat Owner",
    emergencyContact: profile.emergencyContact || "",
    bio: profile.bio || ""
  });

  // Keep form state in sync when profile updates
  useEffect(() => {
    if (profile) {
      setEditForm({
        name: profile.name || "",
        phone: profile.phone || "",
        age: profile.age || 25,
        occupation: profile.occupation || "",
        blockNumber: profile.blockNumber || "Block A",
        houseOrFlatNo: profile.houseOrFlatNo || "",
        occupancyType: profile.occupancyType || "Flat Owner",
        emergencyContact: profile.emergencyContact || "",
        bio: profile.bio || ""
      });
    }
  }, [profile.name, profile.phone, profile.age, profile.occupation, profile.blockNumber, profile.houseOrFlatNo, profile.occupancyType, profile.emergencyContact, profile.bio]);

  // Load user's own issues
  useEffect(() => {
    const loadOwnIssues = () => {
      const email = profile.email?.trim().toLowerCase();
      setOwnIssues(
        getIssues().filter(
          (issue) =>
            issue.reportedByEmail?.trim().toLowerCase() === email ||
            issue.reportedById === profile.id
        )
      );
    };
    loadOwnIssues();
    window.addEventListener("sociosphere_data_updated", loadOwnIssues);
    window.addEventListener("storage", loadOwnIssues);
    return () => {
      window.removeEventListener("sociosphere_data_updated", loadOwnIssues);
      window.removeEventListener("storage", loadOwnIssues);
    };
  }, [profile.email, profile.id]);

  const handleEdit = () => {
    setEditForm({
      name: profile.name || "",
      phone: profile.phone || "",
      age: profile.age || 25,
      occupation: profile.occupation || "",
      blockNumber: profile.blockNumber || "Block A",
      houseOrFlatNo: profile.houseOrFlatNo || "",
      occupancyType: profile.occupancyType || "Flat Owner",
      emergencyContact: profile.emergencyContact || "",
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

  const resolvedIssues = ownIssues.filter((issue) => issue.status === "Resolved");
  const inProgressIssues = ownIssues.filter((issue) => issue.status === "In Progress");
  const openIssues = ownIssues.filter((issue) => issue.status !== "Resolved");
  const getActivityPercentage = (count) =>
    ownIssues.length === 0 ? 0 : Math.round((count / ownIssues.length) * 100);

  const isAuthority = profile.role === "authority";

  return (
    <div className={`profile-page space-y-8 pb-8 ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* ==================== SAVE SUCCESS TOAST ==================== */}
      {showSaveSuccess && (
        <div className="fixed right-4 top-4 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 shadow-lg backdrop-blur-sm">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Profile updated & synced via Redux Toolkit!
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
              Redux State Profile
            </p>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {isSettingsPage ? "Account Settings" : "My Profile"}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isSettingsPage
              ? "Manage your SocioSphere account, security, and preferences."
              : "Dynamic profile loaded from Redux Toolkit containing all resident & membership records."}
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 active:translate-y-0"
          >
            <Pencil size={16} className="transition-transform group-hover:rotate-12" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
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
      <section className="overflow-visible rounded-3xl border border-slate-200 bg-white shadow-sm shadow-slate-200/70 dark:border-slate-800 dark:bg-[#0D1524] dark:shadow-none">
        {/* Cover */}
        <div className="relative h-36 overflow-hidden rounded-t-3xl bg-slate-950 sm:h-44">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.22),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_50%_60%,rgba(139,92,246,0.12),transparent_45%)]" />

          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
          </div>

          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute right-16 top-4 h-24 w-24 rounded-full border-2 border-emerald-500/15" />
          <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full border-2 border-blue-500/10" />
        </div>

        {/* Profile info */}
        <div className="relative px-5 pb-6 sm:px-8 sm:pb-7">
          <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-1 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div
                className="relative shrink-0"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-teal-600 text-4xl font-extrabold text-white shadow-xl transition-all duration-300 hover:scale-105 dark:border-[#0D1524] sm:h-32 sm:w-32 sm:text-5xl">
                  <UserAvatar user={profile} className="h-full w-full rounded-none" iconSize={48} />
                </div>

                {avatarHover && (
                  <button
                    type="button"
                    onClick={() => setAvatarPickerOpen((open) => !open)}
                    className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40"
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
                  <h2 className="min-w-0 break-words text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-50 sm:text-3xl">
                    {profile.name}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <ShieldCheck size={13} />
                    {isAuthority ? "Verified Authority Admin" : "Verified Resident"}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50 px-2.5 py-0.5 text-xs font-semibold">
                    {profile.designation || (isAuthority ? "RWA Committee" : "Resident")}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <Building2 size={15} />
                    {profile.society}
                    <span className="font-mono text-xs bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 ml-1">
                      {profile.societyCode}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Home size={14} className="text-slate-400" />
                    {profile.unitNumber || `${profile.blockNumber} - ${profile.houseOrFlatNo}`}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Briefcase size={14} className="text-slate-400" />
                    {profile.occupation}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
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
                  Contact details and demographics
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
              value={isEditing ? editForm.age : `${profile.age} years old`}
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
              Resident Bio / Statement
            </label>
            {isEditing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-3 text-sm text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
                placeholder="Brief intro or community statement..."
              />
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed">
                {profile.bio || "Active verified resident participating in society activities and neighborhood community."}
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
                  Residential & Society Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Apartment allocation and tenancy
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Multi-Tenant Isolated
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
              placeholder="e.g. 707"
            />

            <ProfileField
              icon={Award}
              label="Occupancy Status"
              value={isEditing ? editForm.occupancyType : profile.occupancyType}
              editing={isEditing}
              onChange={(val) => setEditForm(prev => ({ ...prev, occupancyType: val }))}
              placeholder="e.g. Flat Owner, Tenant"
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
              Complete Unit Address
            </span>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {profile.unitNumber || `${profile.blockNumber} - ${profile.houseOrFlatNo}`}
            </span>
          </div>
        </section>

        {/* SECTION 3: MEMBERSHIP & BADGES */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1524] p-6 sm:p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20">
                <Award size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Membership & Society Badges
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Credentials, roles, and verification honours
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
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{profile.designation || "Resident"}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Member Since</span>
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{profile.joinedDate || "Jan 2024"}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Database Verification</span>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={14} /> 100% Verified
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 mt-3">Active Society Badges</p>
              <div className="flex flex-wrap gap-2">
                {(profile.badges || ['Verified Resident', 'Flat Owner']).map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                  >
                    <Sparkles size={12} className="text-emerald-500" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: CIVIC METRICS & COMMUNITY ACTIVITY */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1524] p-6 sm:p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                  Community Activity & Impact
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reports, resolution performance, and points
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
              Live Feed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Issues Reported</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{ownIssues.length}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Resolved Reports</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{resolvedIssues.length}</span>
            </div>

            <div className="col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 sm:col-span-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Resolution Rate</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {ownIssues.length ? `${getActivityPercentage(resolvedIssues.length)}%` : "100%"}
              </span>
            </div>

          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Recent Submissions</h4>
            <div className="space-y-2">
              {ownIssues.slice(0, 2).map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{issue.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${issue.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                    {issue.status}
                  </span>
                </div>
              ))}
              {ownIssues.length === 0 && (
                <p className="text-xs text-slate-400 py-2 text-center">No recent civic issues submitted.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ==================== LOGOUT BAR ==================== */}
      <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 transition-all duration-300 hover:border-rose-500/30 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500 shadow-lg shadow-rose-500/20">
              <LogOut size={20} className="text-white" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Sign out of SocioSphere
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                End your active session for {profile.name} ({profile.society}).
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

export default Profile;
