import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BellRing, CheckCircle2, ClipboardList, HeartPulse, MapPin, Plus, Sparkles, Timer, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getIssues } from "../../data/mockIssues";
import { getAnnouncements } from "../../data/mockAnnouncements";

const formatDate = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(new Date(value));

const CATEGORY_BADGE = {
  Notice: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  Maintenance: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  General: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  Alert: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadDashboardData = () => {
      const communityName = user?.communityName?.trim().toLowerCase();
      const communityId = user?.communityId;
      setIssues(
        getIssues().filter((issue) => {
          const issueCommunity = (issue.communityName || issue.society || "").trim().toLowerCase();
          return (
            (communityId && issue.communityId === communityId) ||
            (communityName && issueCommunity === communityName) ||
            (!issue.communityId && !issueCommunity)
          );
        })
      );
      setAnnouncements(
        getAnnouncements()
          .filter((item) => item.category !== "Event")
          .filter((item) => !item.colonyId || item.colonyId === communityId)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
      );
    };
    loadDashboardData();
    window.addEventListener("sociosphere_data_updated", loadDashboardData);
    return () => window.removeEventListener("sociosphere_data_updated", loadDashboardData);
  }, [user?.communityId, user?.communityName]);

  const metrics = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter((issue) => issue.status === "Resolved").length;
    const active = issues.filter((issue) => issue.status === "In Progress" || issue.status === "Open").length;
    const critical = issues.filter((issue) => ["Critical", "High"].includes(issue.severity)).length;
    const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;
    const healthScore = total ? Math.max(35, Math.round(resolutionRate * 0.7 + Math.max(0, 30 - critical * 8))) : 100;
    return { total, resolved, active, critical, resolutionRate, healthScore };
  }, [issues]);

  const healthMessage = metrics.healthScore >= 80 ? "Your community is in great shape. Keep reporting small issues early." : metrics.healthScore >= 55 ? "Service is steady, but a few open issues need attention." : "Several priority issues need faster community action.";

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index), 1);
      return { key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString("en-IN", { month: "short" }), reported: 0, resolved: 0 };
    });
    issues.forEach((issue) => {
      const date = new Date(issue.createdAt || issue.timestamp || Date.now());
      const bucket = months.find((month) => month.key === `${date.getFullYear()}-${date.getMonth()}`);
      if (bucket) {
        bucket.reported += 1;
        if (issue.status === "Resolved") bucket.resolved += 1;
      }
    });
    return months;
  }, [issues]);

  const reportingTimes = useMemo(() => {
    const buckets = ["06", "08", "10", "12", "14", "16", "18", "20"].map((hour) => ({ hour, count: 0 }));
    issues.forEach((issue) => {
      const hour = new Date(issue.createdAt || issue.timestamp || Date.now()).getHours();
      const bucket = buckets.reduce((closest, item) => Math.abs(Number(item.hour) - hour) < Math.abs(Number(closest.hour) - hour) ? item : closest, buckets[0]);
      bucket.count += 1;
    });
    return buckets;
  }, [issues]);

  const registeredResidents = useMemo(() => {
    try {
      const accounts = Object.values(JSON.parse(localStorage.getItem("sociosphere_accounts") || "{}"));
      return accounts.filter((account) => account.communityId === user?.communityId && account.role !== "authority").length || 1;
    } catch { return 1; }
  }, [user?.communityId]);

  const femaleResidents = Math.round(registeredResidents * 0.48);
  const maleResidents = registeredResidents - femaleResidents;

  const categoryData = useMemo(() => Object.entries(issues.reduce((categories, issue) => {
    const category = issue.category || "Other";
    categories[category] = (categories[category] || 0) + 1;
    return categories;
  }, {})).sort(([, left], [, right]) => right - left).slice(0, 4), [issues]);

  const maxMonthlyValue = Math.max(1, ...monthlyData.flatMap((item) => [item.reported, item.resolved]));
  const maxTimeValue = Math.max(1, ...reportingTimes.map((item) => item.count));
  const timeChartPoints = reportingTimes.map((item, index) => `${25 + (index * 650) / (reportingTimes.length - 1)},${154 - (item.count / maxTimeValue) * 118}`).join(" ");
  const timeChartArea = `25,164 ${timeChartPoints} 675,164`;

  return <div className="space-y-6 pb-8">
    <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-[#0D1524] dark:to-cyan-500/10 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400"><Sparkles size={15} /> Community overview</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Hello, {user?.name?.split(" ")[0] || "Citizen"}</h1><p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />{user?.communityName || "Your community"}</p></div>
        <button onClick={() => navigate("/citizen/report")} className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"><Plus size={18} /> Report an issue</button>
      </div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={ClipboardList} label="Total issues" value={metrics.total} note="Community reports" tone="blue" /><MetricCard icon={CheckCircle2} label="Resolved" value={metrics.resolved} note="Successfully closed" tone="emerald" /><MetricCard icon={Timer} label="Active issues" value={metrics.active} note="Being handled now" tone="amber" /><MetricCard icon={AlertTriangle} label="Priority alerts" value={metrics.critical} note="High or critical" tone="rose" /></section>

    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Monthly issue resolution</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Reported compared with resolved issues</p></div><span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Last 6 months</span></div><div className="flex h-64 items-end gap-3 px-6 pb-6 pt-8 sm:gap-5">{monthlyData.map((month) => <div key={month.key} className="flex h-full flex-1 flex-col justify-end"><div className="flex flex-1 items-end justify-center gap-1.5"><span title={`${month.reported} reported`} className="w-2 rounded-t-md bg-violet-600 transition hover:bg-violet-500 sm:w-3" style={{ height: `${Math.max(month.reported ? 10 : 0, (month.reported / maxMonthlyValue) * 100)}%` }} /><span title={`${month.resolved} resolved`} className="w-2 rounded-t-md bg-emerald-400 transition hover:bg-emerald-300 sm:w-3" style={{ height: `${Math.max(month.resolved ? 10 : 0, (month.resolved / maxMonthlyValue) * 100)}%` }} /></div><span className="mt-3 text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">{month.label}</span></div>)}</div><div className="flex gap-5 border-t border-slate-100 px-6 py-4 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:text-slate-300"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-violet-600" /> Reported</span><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Resolved</span></div></article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"><div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Residents by gender</h2><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Estimated registered mix</p></div><Users className="text-violet-600 dark:text-violet-400" size={22} /></div><div className="mx-auto mt-7 grid h-40 w-40 place-items-center rounded-full" style={{ background: `conic-gradient(#7c3aed 0 ${registeredResidents ? (maleResidents / registeredResidents) * 360 : 180}deg, #fb923c 0deg)` }}><div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center dark:bg-[#0D1524]"><strong className="text-2xl text-slate-900 dark:text-white">{registeredResidents}</strong><span className="text-[11px] text-slate-500 dark:text-slate-400">residents</span></div></div><div className="mt-7 space-y-3 text-sm"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><i className="h-2.5 w-2.5 rounded-full bg-orange-400" /> Female</span><strong className="text-slate-900 dark:text-white">{femaleResidents}</strong></div><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><i className="h-2.5 w-2.5 rounded-full bg-violet-600" /> Male</span><strong className="text-slate-900 dark:text-white">{maleResidents}</strong></div></div></article>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Issue reporting time</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">When residents most often report issues</p></div><Timer className="text-orange-500" size={22} /></div><div className="px-4 pb-3 pt-6 sm:px-6"><svg className="h-52 w-full overflow-visible" viewBox="0 0 700 190" role="img" aria-label="Issue reports by time of day"><defs><linearGradient id="reporting-time-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#fb923c" stopOpacity="0.28" /><stop offset="100%" stopColor="#fb923c" stopOpacity="0" /></linearGradient></defs>{[45, 85, 125, 165].map((y) => <line key={y} x1="25" x2="675" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 5" />)}<polygon points={timeChartArea} fill="url(#reporting-time-fill)" /><polyline points={timeChartPoints} fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />{reportingTimes.map((item, index) => { const x = 25 + (index * 650) / (reportingTimes.length - 1); const y = 154 - (item.count / maxTimeValue) * 118; return <g key={item.hour} className="group"><title>{`${item.hour}:00 — ${item.count} report${item.count === 1 ? "" : "s"}`}</title><circle cx={x} cy={y} r="10" fill="transparent" /><circle cx={x} cy={y} r="4.5" fill="#fff" stroke="#f97316" strokeWidth="3" className="transition group-hover:fill-orange-500" /><text x={x} y="185" textAnchor="middle" className="fill-slate-500 text-[11px] dark:fill-slate-400">{item.hour}:00</text></g>; })}</svg></div></article>

      <article className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"><div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Issues by category</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Most reported community concerns</p></div><ClipboardList className="text-violet-600 dark:text-violet-400" size={22} /></div><div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">{categoryData.length ? categoryData.map(([category, count], index) => <div key={category} className="flex items-center justify-between py-4"><span className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200"><i className={`h-2.5 w-2.5 rounded-full ${["bg-violet-500", "bg-emerald-500", "bg-orange-400", "bg-sky-500"][index]}`} />{category}</span><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{count}</span></div>) : <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">No issue reports yet.</p>}</div></article>
    </section>

    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-slate-900 dark:text-white">Issue resolution</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Progress across your community</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">Live</span></div><div className="mt-8 flex flex-col items-center gap-7 sm:flex-row"><div className="relative grid h-40 w-40 place-items-center rounded-full" style={{ background: `conic-gradient(#10b981 ${metrics.resolutionRate * 3.6}deg, #e2e8f0 0deg)` }}><div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center dark:bg-[#0D1524]"><strong className="text-3xl text-slate-900 dark:text-white">{metrics.resolutionRate}%</strong><span className="text-xs text-slate-500 dark:text-slate-400">resolved</span></div></div><div className="w-full space-y-4"><ProgressRow label="Resolved" value={metrics.resolved} total={metrics.total} color="bg-emerald-500" /><ProgressRow label="Active" value={metrics.active} total={metrics.total} color="bg-amber-500" /><ProgressRow label="Priority" value={metrics.critical} total={metrics.total} color="bg-rose-500" /></div></div></article>
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]"><div className="flex items-center justify-between"><div><p className="text-sm font-bold text-slate-900 dark:text-white">Health insight</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A live community wellbeing signal</p></div><div className="grid h-11 w-11 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"><HeartPulse size={21} /></div></div><div className="mt-8 rounded-2xl bg-slate-50 p-5 dark:bg-slate-900/60"><div className="flex items-end justify-between"><div><p className="text-4xl font-extrabold text-slate-900 dark:text-white">{metrics.healthScore}</p><p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Health score</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">{metrics.healthScore >= 80 ? "Healthy" : "Needs attention"}</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${metrics.healthScore}%` }} /></div><p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{healthMessage}</p></div></article>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming announcements</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Latest notices from your community</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/citizen/announcements")} className="text-sm font-bold text-emerald-600 transition hover:text-emerald-500 dark:text-emerald-400">View all</button>
          <BellRing className="text-emerald-600 dark:text-emerald-400" size={22} />
        </div>
      </div>
      <div className="grid divide-y divide-slate-200 dark:divide-slate-800 md:grid-cols-3 md:divide-x md:divide-y-0">
        {announcements.length
          ? announcements.map((ann) => <AnnouncementCard key={ann.id} ann={ann} />)
          : <div className="col-span-full px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No announcements for your community yet.</div>}
      </div>
    </section>
  </div>;
}

function MetricCard({ icon: Icon, label, value, note, tone }) { const tones = { blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400", emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400", amber: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400", rose: "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400" }; return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-[#0D1524] dark:hover:border-emerald-500/40"><div className={`grid h-11 w-11 place-items-center rounded-xl ${tones[tone]}`}><Icon size={20} /></div><p className="mt-5 text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p><p className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{note}</p></article>; }
function ProgressRow({ label, value, total, color }) { const percent = total ? Math.round((value / total) * 100) : 0; return <div><div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold text-slate-600 dark:text-slate-300">{label}</span><span className="text-slate-500 dark:text-slate-400">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} /></div></div>; }
function AnnouncementCard({ ann }) {
  const badgeClass = CATEGORY_BADGE[ann.category] || "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
  return (
    <article className="group p-6 transition-colors hover:bg-emerald-50/60 dark:hover:bg-emerald-500/5">
      <div className="flex items-start gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
          <span className="text-xs font-extrabold text-center leading-tight">{formatDate(ann.date)}</span>
        </div>
        <div className="min-w-0 flex-1">
          {ann.important && (
            <span className="mb-1.5 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">Important</span>
          )}
          <h3 className="line-clamp-2 text-sm font-bold text-slate-800 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-400">{ann.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{ann.content}</p>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}>{ann.category}</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{ann.author}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
