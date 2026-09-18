import { useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Globe,
  Home,
  LogOut,
  Mail,
  Moon,
  Settings as SettingsIcon,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import ScrollReveal from "../../components/ui/ScrollReveal";

const PreferenceRow = ({ icon: Icon, title, description, action }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
    <div className="shrink-0">{action}</div>
  </div>
);

const StatusRow = ({ icon: Icon, label, value, positive = false }) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
    <span className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
      {positive ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Icon size={16} className="text-slate-500 dark:text-slate-400" />}
      {label}
    </span>
    <span className={positive ? "text-sm font-semibold text-emerald-600 dark:text-emerald-400" : "text-sm font-semibold text-slate-600 dark:text-slate-300"}>
      {value}
    </span>
  </div>
);

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState("English (US)");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <SettingsIcon className="mb-4 text-slate-400" size={32} />
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Settings unavailable
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Please sign in again to view your account settings.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-8 pb-8 ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <ScrollReveal direction="left">
        <header>
        <p className="mb-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">SocioSphere</p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Manage your account status and preferences.
        </p>
        </header>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D1524] sm:p-7">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-500/20">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-50">Account Status</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your SocioSphere account</p>
          </div>
        </div>
        <div className="space-y-3">
          <StatusRow icon={CheckCircle2} label="Account" value="Active" positive />
          <StatusRow icon={Mail} label="Email" value="Verified" positive />
          <StatusRow icon={Home} label="Role" value={user.role === "authority" ? "Authority" : "Citizen"} positive />
          <StatusRow icon={CalendarDays} label="Member Since" value={user.joinedDate || "Not available"} />
        </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={160} direction="right">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D1524] sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-50">Preferences</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Customize your SocioSphere experience.</p>
        </div>
        <div className="space-y-3">
          <ScrollReveal delay={220}>
            <PreferenceRow
            icon={theme === "dark" ? Moon : Sun}
            title="Appearance"
            description={theme === "dark" ? "Dark mode enabled" : "Light mode enabled"}
            action={
              <button type="button" onClick={toggleTheme} className={`relative h-7 w-12 rounded-full transition-colors ${theme === "dark" ? "bg-emerald-500" : "bg-slate-300"}`} aria-label="Toggle theme">
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            }
            />
          </ScrollReveal>
          <ScrollReveal delay={280}>
            <PreferenceRow
            icon={Bell}
            title="Notifications"
            description={notificationsEnabled ? "Notifications are on" : "Notifications are off"}
            action={
              <button
                onClick={() => setNotificationsEnabled((enabled) => !enabled)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold text-white ${notificationsEnabled ? "bg-emerald-500" : "bg-slate-700"}`}
              >
                {notificationsEnabled ? "On" : "Off"}
              </button>
            }
            />
          </ScrollReveal>
          <ScrollReveal delay={340}>
            <PreferenceRow
            icon={Globe}
            title="Language"
            description="Choose your preferred language"
            action={
              <select value={language} onChange={(event) => setLanguage(event.target.value)} className="max-w-[130px] rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" aria-label="Language">
                <option>English (US)</option>
                <option>Hindi</option>
              </select>
            }
            />
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <PreferenceRow icon={SettingsIcon} title="Profile details" description="Update your personal information" action={<button onClick={() => navigate("/citizen/profile")} className="text-xs font-semibold text-emerald-400">Open</button>} />
          </ScrollReveal>
        </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={240} direction="up">
        <section className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-50">Sign out of SocioSphere</h2>
            <p className="mt-1 text-sm text-slate-400">You will need to sign in again to access your account.</p>
          </div>
          <button onClick={handleLogout} className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/20">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
