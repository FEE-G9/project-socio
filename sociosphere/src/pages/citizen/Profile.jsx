import React, { useState } from "react";
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
  Eye,
  EyeOff,
  Lock,
  Globe,
  Smartphone,
  Building2,
  Hash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Profile = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarHover, setAvatarHover] = useState(false);

  const [profile, setProfile] = useState({
    name: "Ekjot Kaur",
    email: "ekjot@example.com",
    phone: "+91 98765 43210",
    society: "Green Valley Residency",
    block: "Block A",
    apartment: "A-204",
    city: "Chandigarh",
  });

  const [editProfile, setEditProfile] = useState(profile);

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
    
    // Simulate API call
    setTimeout(() => {
      setProfile(editProfile);
      setIsEditing(false);
      setIsSaving(false);
      setShowSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSaveSuccess(false), 3000);
    }, 800);
  };

  const handleLogout = () => {
    localStorage.setItem("sociosphere_is_auth", "false");
    navigate("/login");
  };

  const handleChange = (field, value) => {
    setEditProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-8 pb-8">
      {/* ==================== SAVE SUCCESS TOAST ==================== */}
      {showSaveSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
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
            My Profile
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Manage your personal information and account preferences.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/30 active:translate-y-0"
          >
            <Pencil size={16} className="transition-transform group-hover:rotate-12" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <X size={16} />
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524]">
        {/* Cover */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 sm:h-40">
          {/* Decorative pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.3),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(56,189,248,0.2),transparent_35%),radial-gradient(circle_at_50%_60%,rgba(168,85,247,0.15),transparent_45%)]" />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>

          {/* Decorative circles */}
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-2 border-emerald-500/20" />
          <div className="absolute right-16 top-4 h-24 w-24 rounded-full border-2 border-emerald-500/15" />
          <div className="absolute -left-8 -bottom-16 h-40 w-40 rounded-full border-2 border-blue-500/10" />
        </div>

        {/* Profile info */}
        <div className="relative px-5 pb-6 sm:px-7 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div 
                className="relative"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
              >
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-500 to-teal-600 text-4xl font-extrabold text-white shadow-xl transition-all duration-300 hover:scale-105 dark:border-[#0D1524] sm:h-32 sm:w-32 sm:text-5xl">
                  {profile.name.split(' ').map(word => word[0]).join('')}
                </div>

                {/* Camera overlay on hover */}
                {avatarHover && (
                  <button className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity duration-200 hover:opacity-100">
                    <Camera size={24} className="text-white" />
                  </button>
                )}

                {/* Verified badge */}
                <div className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-lg dark:border-[#0D1524]">
                  <BadgeCheck size={16} strokeWidth={2.5} className="text-white" />
                </div>
              </div>

              <div className="sm:pb-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 sm:text-3xl">
                    {profile.name}
                  </h2>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck size={13} />
                    Verified Citizen
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Home size={14} className="text-emerald-500" />
                  {profile.society}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
              <MapPin size={14} className="text-emerald-500" />
              {profile.city}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MAIN GRID ==================== */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ==================== PERSONAL INFORMATION ==================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524] sm:p-7">
          <div className="mb-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
                <User size={20} className="text-white" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  Personal Information
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your basic account information
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <ProfileField
              icon={User}
              label="Full Name"
              value={isEditing ? editProfile.name : profile.name}
              editing={isEditing}
              onChange={(value) => handleChange("name", value)}
              placeholder="Enter your full name"
            />

            <ProfileField
              icon={Mail}
              label="Email Address"
              value={isEditing ? editProfile.email : profile.email}
              editing={isEditing}
              type="email"
              onChange={(value) => handleChange("email", value)}
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

        {/* ==================== ACCOUNT STATUS ==================== */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:from-[#0D1524] dark:to-slate-900 sm:p-7">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <ShieldCheck size={20} className="text-white" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Account Status
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400">
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
              iconClass="bg-emerald-500/10 text-emerald-500"
            />

            <StatusRow
              label="Email"
              value="Verified"
              icon={Mail}
              positive
              iconClass="bg-blue-500/10 text-blue-500"
            />

            <StatusRow
              label="Resident"
              value="Verified"
              icon={Home}
              positive
              iconClass="bg-purple-500/10 text-purple-500"
            />

            <StatusRow
              label="Member Since"
              value="August 2026"
              icon={CalendarDays}
              iconClass="bg-amber-500/10 text-amber-500"
            />

            {/* Verification score */}
            <div className="mt-2 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Verification Score
                </span>
                <span className="text-sm font-bold text-emerald-500">100%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ==================== STATS ==================== */}
      <section>
        <div className="mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Community Activity
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your contribution to the community
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={AlertCircle}
            label="Issues Reported"
            value="12"
            description="Total reports"
            iconClass="bg-gradient-to-br from-blue-500 to-blue-600"
            trend="+18%"
            trendUp={true}
          />

          <StatCard
            icon={CheckCircle2}
            label="Issues Resolved"
            value="8"
            description="Successfully resolved"
            iconClass="bg-gradient-to-br from-emerald-500 to-teal-600"
            trend="+24%"
            trendUp={true}
          />

          <StatCard
            icon={Clock3}
            label="In Progress"
            value="3"
            description="Currently being handled"
            iconClass="bg-gradient-to-br from-amber-500 to-orange-600"
            trend="-8%"
            trendUp={false}
          />

          <StatCard
            icon={Users}
            label="Community Score"
            value="87%"
            description="Above community average"
            iconClass="bg-gradient-to-br from-purple-500 to-pink-600"
            trend="+6%"
            trendUp={true}
          />
        </div>
      </section>

      {/* ==================== LOWER GRID ==================== */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ==================== RECENT ACTIVITY ==================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524] sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Recent Activity
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your latest community actions
              </p>
            </div>

            <button
              onClick={() => navigate("/citizen/home")}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-5">
            <ActivityItem
              icon={CheckCircle2}
              iconClass="bg-gradient-to-br from-emerald-500 to-teal-600"
              title="Streetlight issue resolved"
              description="Your reported issue was marked as resolved."
              time="2 hours ago"
            />

            <ActivityItem
              icon={AlertCircle}
              iconClass="bg-gradient-to-br from-blue-500 to-indigo-600"
              title="New issue reported"
              description="Garbage collection issue reported."
              time="Yesterday"
            />

            <ActivityItem
              icon={Users}
              iconClass="bg-gradient-to-br from-purple-500 to-pink-600"
              title="Community participation"
              description="You participated in a community poll."
              time="3 days ago"
            />

            <ActivityItem
              icon={Award}
              iconClass="bg-gradient-to-br from-amber-500 to-orange-600"
              title="Community milestone"
              description="You reached 10 issue reports."
              time="1 week ago"
            />
          </div>
        </section>

        {/* ==================== PREFERENCES ==================== */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524] sm:p-7">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Preferences
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Customize your SocioSphere experience
            </p>
          </div>

          <div className="space-y-4">
            {/* Theme */}
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
                  className="relative flex h-8 w-14 items-center rounded-full bg-gradient-to-r from-slate-200 to-slate-300 transition-all duration-300 hover:scale-105 dark:from-slate-700 dark:to-slate-600"
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

            {/* Notifications */}
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
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`relative h-8 w-14 rounded-full transition-all duration-300 ${
                    notificationsEnabled
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : "bg-slate-300 dark:bg-slate-700"
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

            {/* Language */}
            <PreferenceRow
              icon={Globe}
              title="Language"
              description="English (US)"
              action={
                <button className="flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-emerald-500 dark:text-slate-300">
                  Change
                  <ChevronRight size={14} />
                </button>
              }
            />

            {/* Settings */}
            <PreferenceRow
              icon={Settings}
              title="Account Settings"
              description="Security and privacy options"
              action={
                <button
                  onClick={() => {}}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
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
      <section className="rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/5 to-red-500/5 p-6 transition-all duration-300 hover:border-rose-500/30 dark:bg-gradient-to-r dark:from-rose-500/[0.06] dark:to-red-500/[0.06] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-lg shadow-rose-500/20">
              <LogOut size={20} className="text-white" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
                Sign out of SocioSphere
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                You will need to sign in again to access your account.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/20 hover:shadow-lg hover:shadow-rose-500/20"
          >
            <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
            Log Out
          </button>
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   ENHANCED PROFILE FIELD
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
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-slate-500">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all duration-200 ${
          editing
            ? isFocused
              ? "border-emerald-500 bg-white shadow-lg shadow-emerald-500/10 dark:bg-slate-900"
              : "border-slate-300 bg-white hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900"
            : "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60"
        }`}
      >
        <Icon
          size={17}
          className={`shrink-0 transition-colors ${
            editing && isFocused
              ? "text-emerald-500"
              : "text-slate-400 group-hover:text-slate-500"
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
            className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
          />
        ) : (
          <span className="min-w-0 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
            {value}
          </span>
        )}

        {editing && value && (
          <button
            onClick={() => onChange("")}
            className="shrink-0 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   ENHANCED STATUS ROW
========================================================= */

const StatusRow = ({
  label,
  value,
  icon: Icon,
  positive = false,
  iconClass,
}) => {
  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={16} />
        </div>

        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {positive && (
          <CheckCircle2 size={14} className="text-emerald-500" />
        )}
        <span
          className={`text-xs font-bold ${
            positive
              ? "text-emerald-500"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

/* =========================================================
   ENHANCED STAT CARD
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
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:border-slate-800 dark:bg-[#0D1524] dark:hover:border-slate-700 dark:hover:shadow-black/20">
      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent transition-all duration-300 group-hover:from-slate-50 group-hover:to-transparent dark:group-hover:from-slate-800/30" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass} shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon size={20} className="text-white" />
          </div>

          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                trendUp
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              <TrendingUp
                size={12}
                className={trendUp ? "" : "rotate-180"}
              />
              {trend}
            </span>
          )}
        </div>

        <div className="mt-5">
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
            {value}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
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
   ENHANCED ACTIVITY ITEM
========================================================= */

const ActivityItem = ({
  icon: Icon,
  iconClass,
  title,
  description,
  time,
}) => {
  return (
    <div className="group flex gap-4 rounded-xl p-2 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/40">
      <div className="relative">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass} shadow-md transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={17} className="text-white" />
        </div>
        {/* Connecting line */}
        <div className="absolute left-1/2 top-full h-full w-px -translate-x-1/2 bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="min-w-0 flex-1 pb-4">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <p className="text-sm font-bold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-200 dark:group-hover:text-emerald-400">
            {title}
          </p>

          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-400 dark:bg-slate-800">
            {time}
          </span>
        </div>

        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   ENHANCED PREFERENCE ROW
========================================================= */

const PreferenceRow = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="group flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
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

// Add custom animation
const style = document.createElement('style');
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
document.head.appendChild(style);

export default Profile;