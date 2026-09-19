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
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getIssues } from "../../data/mockIssues";
import UserAvatar, { avatarStyles } from "../../components/ui/UserAvatar";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, updateUserProfile, logout } = useAuth();
  const isSettingsPage = location.pathname.endsWith("/settings");

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarHover, setAvatarHover] = useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [ownIssues, setOwnIssues] = useState([]);

  useEffect(() => {
    const loadOwnIssues = () => {
      const email = user?.email?.trim().toLowerCase();
      setOwnIssues(getIssues().filter((issue) =>
        issue.reportedByEmail?.trim().toLowerCase() === email || issue.reportedById === user?.id
      ));
    };
    loadOwnIssues();
    window.addEventListener("sociosphere_data_updated", loadOwnIssues);
    return () => window.removeEventListener("sociosphere_data_updated", loadOwnIssues);
  }, [user?.email, user?.id]);

  // ---------------------------------------
  // Convert unitNumber into block/apartment
  // Example: "Block B - 402"
  // ---------------------------------------
  const getUnitDetails = (unitNumber = "") => {
    const parts = unitNumber.split(" - ");

    if (parts.length >= 2) {
      return {
        block: parts[0],
        apartment: parts.slice(1).join(" - "),
      };
    }

    return {
      block: "",
      apartment: unitNumber,
    };
  };

  const getProfileFromUser = (currentUser) => {
    const unitDetails = getUnitDetails(currentUser?.unitNumber);

    return {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      society: currentUser?.communityName || "",
      block: unitDetails.block,
      apartment: unitDetails.apartment,
      city: currentUser?.communityCity || currentUser?.city || "Rajpura",
    };
  };

  const [profile, setProfile] = useState(() => getProfileFromUser(user));

  const [editProfile, setEditProfile] = useState(() =>
    getProfileFromUser(user)
  );

  // Keep Profile synchronized with AuthContext/localStorage
  useEffect(() => {
    const updatedProfile = getProfileFromUser(user);

    setProfile(updatedProfile);
    setEditProfile(updatedProfile);
  }, [
    user?.name,
    user?.email,
    user?.phone,
    user?.communityName,
    user?.communityCity,
    user?.city,
    user?.unitNumber,
  ]);

  const handleEdit = () => {
    setEditProfile(profile);
    setIsEditing(true);
    setShowSaveSuccess(false);
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
    setShowSaveSuccess(false);
  };

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      const updatedUnitNumber = [editProfile.block, editProfile.apartment]
        .filter(Boolean)
        .join(" - ");

      const updatedUserFields = {
        name: profile.name,
        email: profile.email,
        phone: editProfile.phone,
        communityName: editProfile.society,
        unitNumber: updatedUnitNumber,
      };

      // Update AuthContext + localStorage
      updateUserProfile(updatedUserFields);

      setProfile(editProfile);
      setIsEditing(false);
      setIsSaving(false);
      setShowSaveSuccess(true);

      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleChange = (field, value) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resolvedIssues = ownIssues.filter((issue) => issue.status === "Resolved");
  const inProgressIssues = ownIssues.filter((issue) => issue.status === "In Progress");
  const openIssues = ownIssues.filter((issue) => issue.status !== "Resolved");
  const getActivityPercentage = (count) =>
    ownIssues.length === 0 ? 0 : Math.round((count / ownIssues.length) * 100);

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Unable to load profile information.
        </p>
      </div>
    );
  }

  return (
    <div className={`profile-page space-y-8 pb-8 ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      {/* ==================== SAVE SUCCESS TOAST ==================== */}
      {showSaveSuccess && (
        <div className="fixed right-4 top-4 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 shadow-lg backdrop-blur-sm">
            <CheckCircle2 size={18} className="text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Profile updated successfully!
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
              Account
            </p>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            {isSettingsPage ? "Account Settings" : "My Profile"}
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {isSettingsPage
              ? "Manage your SocioSphere account, status, and sign-out preferences."
              : "Manage your personal information and account preferences."}
          </p>
        </div>

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
                  <UserAvatar user={user} className="h-full w-full rounded-none" iconSize={48} />
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
                      const isSelected = user.avatarStyle === style.id ||
                        (!user.avatarStyle && style.id === "classic");

                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            updateUserProfile({ avatarStyle: style.id });
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
                  <BadgeCheck
                    size={16}
                    strokeWidth={2.5}
                    className="text-white"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAvatarPickerOpen((open) => !open)}
                className="absolute left-0 top-[8.5rem] rounded-lg border border-emerald-500/30 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 sm:top-[9.5rem]"
              >
                Choose avatar
              </button>

              <div className="min-w-0 flex-1 sm:pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="min-w-0 break-words text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-50 sm:text-3xl">
                    {profile.name}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <ShieldCheck size={13} />
                    {user.role === "authority"
                      ? "Verified Authority"
                      : "Verified Citizen"}
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <Home size={14} className="text-emerald-500" />
                  {profile.society || "Community not available"}
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <MapPin size={14} className="text-emerald-500" />
              {profile.city || "Location unavailable"}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MAIN GRID ==================== */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* PERSONAL INFORMATION */}
        <section className="rounded-2xl border border-slate-800 bg-[#0D1524] p-6 sm:p-7">
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <User size={20} className="text-slate-950" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-50">
                  Personal Information
                </h3>

                <p className="text-xs text-slate-400">
                  Your basic account information
                </p>
                {isEditing && (
                  <p className="mt-1 text-xs font-medium text-amber-400">
                    Name and email are linked to your account and cannot be changed.
                  </p>
                )}
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="group inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                <Pencil
                  size={16}
                  className="transition-transform group-hover:rotate-12"
                />
                Edit details
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
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
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

          <div className="grid gap-6 sm:grid-cols-2">
            <ProfileField
              icon={User}
              label="Full Name"
              value={isEditing ? editProfile.name : profile.name}
              editing={false}
              placeholder="Enter your full name"
            />

            <ProfileField
              icon={Mail}
              label="Email Address"
              value={isEditing ? editProfile.email : profile.email}
              editing={false}
              type="email"
              placeholder="Enter your email"
            />

            <ProfileField
              icon={Phone}
              label="Phone Number"
              value={isEditing ? editProfile.phone : profile.phone}
              editing={isEditing}
              onChange={(value) => handleChange("phone", value)}
              placeholder="Enter your phone number"
            />

            <ProfileField
              icon={Building2}
              label="Society"
              value={isEditing ? editProfile.society : profile.society}
              editing={isEditing}
              onChange={(value) => handleChange("society", value)}
              placeholder="Enter society name"
            />

            <ProfileField
              icon={Hash}
              label="Block"
              value={isEditing ? editProfile.block : profile.block}
              editing={isEditing}
              onChange={(value) => handleChange("block", value)}
              placeholder="Enter block"
            />

            <ProfileField
              icon={Home}
              label="Apartment"
              value={isEditing ? editProfile.apartment : profile.apartment}
              editing={isEditing}
              onChange={(value) => handleChange("apartment", value)}
              placeholder="Enter apartment number"
            />
          </div>
        </section>

        {/* ACCOUNT STATUS */}
        <section className="hidden">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
              <ShieldCheck size={20} className="text-white" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-50">
                Account Status
              </h3>

              <p className="text-xs text-slate-400">
                Your SocioSphere account
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <StatusRow
              label="Account"
              value="Active"
              icon={CheckCircle2}
              positive
              iconClass="bg-emerald-500/10 text-emerald-400"
            />

            <StatusRow
              label="Email"
              value="Verified"
              icon={Mail}
              positive
              iconClass="bg-blue-500/10 text-blue-400"
            />

            <StatusRow
              label="Role"
              value={
                user.role === "authority"
                  ? "Authority"
                  : "Citizen"
              }
              icon={Home}
              positive
              iconClass="bg-purple-500/10 text-purple-400"
            />

            <StatusRow
              label="Member Since"
              value={user.joinedDate || "Not available"}
              icon={CalendarDays}
              iconClass="bg-amber-500/10 text-amber-400"
            />

            <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">
                  Verification Score
                </span>

                <span className="text-sm font-bold text-emerald-400">
                  100%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-full rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== STATS ==================== */}
      <section>
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-50">
            Community Activity
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Your contribution to the community
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={AlertCircle}
            label="Issues Reported"
            value={String(ownIssues.length)}
            description="Reports you submitted"
            iconClass="bg-blue-500"
            trend={`${ownIssues.length ? 100 : 0}%`}
            trendUp={ownIssues.length > 0}
          />

          <StatCard
            icon={CheckCircle2}
            label="Issues Resolved"
            value={String(resolvedIssues.length)}
            description="Successfully resolved"
            iconClass="bg-emerald-500"
            trend={`${getActivityPercentage(resolvedIssues.length)}%`}
            trendUp={resolvedIssues.length > 0}
          />

          <StatCard
            icon={Clock3}
            label="In Progress"
            value={String(inProgressIssues.length)}
            description="Currently being handled"
            iconClass="bg-amber-500"
            trend={`${getActivityPercentage(inProgressIssues.length)}%`}
            trendUp={inProgressIssues.length > 0}
          />

          <StatCard
            icon={Users}
            label="Open Reports"
            value={String(openIssues.length)}
            description="Awaiting resolution"
            iconClass="bg-purple-500"
            trend={`${getActivityPercentage(openIssues.length)}%`}
            trendUp={openIssues.length > 0}
          />
        </div>
      </section>

      {/* ==================== LOWER GRID ==================== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* RECENT ACTIVITY */}
        <section className="rounded-2xl border border-slate-800 bg-[#0D1524] p-6 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-50">
                Recent Activity
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Your latest community actions
              </p>
            </div>

            <button
              onClick={() => navigate("/citizen/home")}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-slate-700"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-5">
            {ownIssues.slice(0, 4).map((issue) => (
              <ActivityItem
                key={issue.id}
                icon={issue.status === "Resolved" ? CheckCircle2 : AlertCircle}
                iconClass={issue.status === "Resolved" ? "bg-emerald-500" : "bg-blue-500"}
                title={issue.title}
                description={`${issue.category} · ${issue.status}`}
                time={new Date(issue.createdAt || issue.timestamp).toLocaleDateString()}
              />
            ))}
            {ownIssues.length === 0 && <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">Your submitted reports will appear here.</p>}
          </div>
        </section>

        {/* PREFERENCES */}
        <section className="hidden rounded-2xl border border-slate-800 bg-[#0D1524] p-6 sm:p-7">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-50">
              Preferences
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Customize your SocioSphere experience
            </p>
          </div>

          <div className="space-y-4">
            <PreferenceRow
              icon={theme === "dark" ? Moon : Sun}
              title="Appearance"
              description={
                theme === "dark"
                  ? "Dark mode enabled"
                  : "Light mode enabled"
              }
              action={
                <button
                  onClick={toggleTheme}
                  className="relative flex h-8 w-14 items-center rounded-full bg-slate-700 transition-all duration-300 hover:scale-105"
                  aria-label="Toggle theme"
                >
                  <div
                    className={`absolute flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
                      theme === "dark" ? "left-7" : "left-1"
                    }`}
                  >
                    {theme === "dark" ? (
                      <Moon size={14} className="text-slate-700" />
                    ) : (
                      <Sun size={14} className="text-amber-500" />
                    )}
                  </div>
                </button>
              }
            />

            <PreferenceRow
              icon={Bell}
              title="Notifications"
              description={
                notificationsEnabled
                  ? "Notifications are on"
                  : "Notifications are off"
              }
              action={
                <button
                  onClick={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                  className={`relative h-8 w-14 rounded-full transition-all duration-300 ${
                    notificationsEnabled
                      ? "bg-emerald-500"
                      : "bg-slate-700"
                  }`}
                  aria-label="Toggle notifications"
                >
                  <div
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                      notificationsEnabled ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              }
            />

            <PreferenceRow
              icon={Globe}
              title="Language"
              description="English (US)"
              action={
                <button className="flex items-center gap-1 text-xs font-semibold text-slate-300 transition-colors hover:text-emerald-400">
                  Change
                  <ChevronRight size={14} />
                </button>
              }
            />

            <PreferenceRow
              icon={Settings}
              title="Account Settings"
              description="Security and privacy options"
              action={
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-slate-200"
                  aria-label="Account settings"
                >
                  <ChevronRight size={18} />
                </button>
              }
            />
          </div>
        </section>
      </div>

      {/* ==================== LOGOUT ==================== */}
      <section className="hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 transition-all duration-300 hover:border-rose-500/30 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500 shadow-lg shadow-rose-500/20">
              <LogOut size={20} className="text-white" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-50">
                Sign out of SocioSphere
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                You will need to sign in again to access your account.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-400 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/20"
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
   PROFILE FIELD
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
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ${
          editing
            ? isFocused
              ? "border-emerald-500 bg-slate-900 shadow-lg shadow-emerald-500/10"
              : "border-slate-700 bg-slate-900 hover:border-emerald-400"
            : "border-slate-800 bg-slate-900/60"
        }`}
      >
        <Icon
          size={17}
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
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-100 outline-none placeholder:text-slate-500"
          />
        ) : (
          <span className="min-w-0 truncate text-sm font-medium text-slate-200">
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

/* =========================================================
   STATUS ROW
========================================================= */

const StatusRow = ({
  label,
  value,
  icon: Icon,
  positive = false,
  iconClass,
}) => {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5 transition-all duration-200 hover:border-slate-700">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
        >
          <Icon size={16} />
        </div>

        <span className="text-sm font-medium text-slate-300">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {positive && (
          <CheckCircle2 size={14} className="text-emerald-500" />
        )}

        <span
          className={`text-xs font-bold ${
            positive ? "text-emerald-500" : "text-slate-400"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({
  icon: Icon,
  label,
  value,
  description,
  iconClass,
  trend,
  trendUp,
}) => {
  const numericTrend = Number.parseFloat(trend);
  const isNeutralTrend = Number.isFinite(numericTrend) && numericTrend === 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0D1524] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700">
      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass} shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon size={20} className="text-white" />
          </div>

          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                isNeutralTrend
                  ? "bg-slate-500/10 text-slate-400"
                  : trendUp
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {isNeutralTrend ? (
                <span className="block h-0.5 w-3 rounded-full bg-slate-400" aria-hidden="true" />
              ) : (
                <TrendingUp
                  size={12}
                  className={trendUp ? "" : "rotate-180"}
                />
              )}
              {trend}
            </span>
          )}
        </div>

        <div className="mt-5">
          <p className="text-3xl font-extrabold text-slate-50">
            {value}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-200">
            {label}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   ACTIVITY ITEM
========================================================= */

const ActivityItem = ({
  icon: Icon,
  iconClass,
  title,
  description,
  time,
}) => {
  return (
    <div className="group flex gap-4 rounded-xl p-2 transition-all duration-200 hover:bg-slate-900/40">
      <div className="relative">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass} shadow-md transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={17} className="text-white" />
        </div>

        <div className="absolute left-1/2 top-full h-full w-px -translate-x-1/2 bg-slate-800" />
      </div>

      <div className="min-w-0 flex-1 pb-4">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <p className="text-sm font-bold text-slate-200 group-hover:text-emerald-400">
            {title}
          </p>

          <span className="shrink-0 rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-400">
            {time}
          </span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   PREFERENCE ROW
========================================================= */

const PreferenceRow = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all duration-200 hover:border-slate-700">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition-all duration-300 group-hover:bg-slate-700">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-200">
            {title}
          </p>

          <p className="mt-0.5 truncate text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="shrink-0">{action}</div>
    </div>
  );
};

/* =========================================================
   ANIMATION
========================================================= */

const style = document.createElement("style");

style.textContent = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }

    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;

if (!document.head.querySelector("#profile-animation-style")) {
  style.id = "profile-animation-style";
  document.head.appendChild(style);
}

export default Profile;
