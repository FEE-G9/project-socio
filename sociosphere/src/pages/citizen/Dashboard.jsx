import React from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Clock3,
  MapPin,
  Plus,
  TrendingUp,
  Users,
  WalletCards,
  Megaphone,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =========================================================
   THIN ZIG-ZAG TREND ARROW
========================================================= */

const TrendArrow = ({ direction = "up" }) => {
  const isUp = direction === "up";

  return (
    <svg
      viewBox="0 0 90 60"
      className={`h-10 w-14 ${
        isUp ? "text-emerald-400" : "text-rose-500"
      }`}
      
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {isUp ? (
        <>
          <polyline
            points="6,40 25,50 48,27 62,38 84,8"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            points="69,8 84,8 84,23"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <polyline
            points="6,15 27,7 47,30 61,20 84,48"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <polyline
            points="69,48 84,48 84,33"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
};

/* =========================================================
   DASHBOARD
========================================================= */

const Dashboard = () => {
  const navigate = useNavigate();

  /* =========================================================
     KPI DATA
  ========================================================= */

  const stats = [
    {
      label: "Total Issues",
      value: "12",
      change: "+18%",
      description: "vs last month",
      trend: "up",
      icon: AlertCircle,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      label: "Resolved",
      value: "8",
      change: "+24%",
      description: "resolution rate",
      trend: "up",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "In Progress",
      value: "3",
      change: "-8%",
      description: "from last month",
      trend: "down",
      icon: Clock3,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Community Score",
      value: "87%",
      change: "+6%",
      description: "community health",
      trend: "up",
      icon: TrendingUp,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  /* =========================================================
     RECENT ISSUES
  ========================================================= */

  const recentIssues = [
    {
      id: 1,
      title: "Streetlight not working",
      category: "Infrastructure",
      location: "Block A, Main Road",
      status: "In Progress",
      statusClass:
        "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
      time: "Today, 10:32 AM",
    },
    {
      id: 2,
      title: "Garbage collection delayed",
      category: "Sanitation",
      location: "Block B",
      status: "Resolved",
      statusClass:
        "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
      time: "Yesterday",
    },
    {
      id: 3,
      title: "Water leakage near park",
      category: "Water Supply",
      location: "Community Park",
      status: "Pending",
      statusClass:
        "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
      time: "2 days ago",
    },
    {
      id: 4,
      title: "Broken pavement",
      category: "Roads",
      location: "Block C",
      status: "Resolved",
      statusClass:
        "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
      time: "4 days ago",
    },
  ];

  /* =========================================================
     ANNOUNCEMENTS
  ========================================================= */

  const announcements = [
    {
      title: "Monthly maintenance payment due",
      date: "Today",
    },
    {
      title: "Community cleanliness drive",
      date: "2 days ago",
    },
    {
      title: "Independence Day community event",
      date: "5 days ago",
    },
  ];

  /* =========================================================
     CHART DATA
  ========================================================= */

  const chartData = [
    { day: "Mon", value: 38 },
    { day: "Tue", value: 52 },
    { day: "Wed", value: 34 },
    { day: "Thu", value: 68 },
    { day: "Fri", value: 48 },
    { day: "Sat", value: 78 },
    { day: "Sun", value: 56 },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Citizen Dashboard
            </p>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Good morning, Citizen 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening in your community today.
          </p>
        </div>

        <button
          onClick={() => navigate("/citizen/report")}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 active:translate-y-0"
        >
          <Plus size={18} />
          Report Issue
        </button>
      </section>

      {/* =====================================================
          KPI CARDS
      ===================================================== */}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-[#0D1524] dark:hover:border-slate-700"
            >
              {/* TOP */}

              <div className="flex items-start justify-between">

                {/* ICON */}

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon
                    size={19}
                    className={stat.iconColor}
                  />
                </div>

                {/* TREND */}

                <div className="transition-transform duration-200 group-hover:scale-105">
                  <TrendArrow direction={stat.trend} />
                </div>
              </div>

              {/* VALUE */}

              <div className="mt-5">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
                  {stat.value}
                </p>

                <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {stat.label}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      stat.trend === "up"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {stat.change}
                  </span>

                  <span className="text-[11px] text-slate-400">
                    {stat.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

        {/* ===================================================
            ISSUE ACTIVITY
        =================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0D1524]">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Issue Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Issues reported across your community
              </p>
            </div>

            <select className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 outline-none transition-colors focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <option>This week</option>
              <option>This month</option>
              <option>This year</option>
            </select>
          </div>

          {/* BAR CHART */}

          <div className="mt-8">
            <div className="flex h-48 items-end gap-3 sm:gap-5">

              {chartData.map((item) => (
                <div
                  key={item.day}
                  className="group flex h-full flex-1 flex-col justify-end"
                >
                  <div className="relative flex flex-1 items-end">

                    <div
                      className="w-full rounded-t-lg bg-emerald-500/20 transition-all duration-300 group-hover:bg-emerald-500/40 dark:bg-emerald-500/15 dark:group-hover:bg-emerald-500/30"
                      style={{
                        height: `${item.value}%`,
                      }}
                    />

                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100 dark:text-emerald-300">
                      {Math.round(item.value / 10)}
                    </span>
                  </div>

                  <span className="mt-3 text-center text-[11px] text-slate-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CHART SUMMARY */}

          <div className="mt-5 flex flex-wrap gap-6 border-t border-slate-200 pt-4 dark:border-slate-800">

            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                12
              </p>

              <p className="text-[11px] text-slate-400">
                Total reported
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                8
              </p>

              <p className="text-[11px] text-slate-400">
                Resolved
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                3
              </p>

              <p className="text-[11px] text-slate-400">
                In progress
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            COMMUNITY HEALTH
        =================================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0D1524]">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Community Health
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Overall community activity
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <Users size={18} />
            </div>
          </div>

          {/* SCORE */}

          <div className="mt-8 flex items-center gap-5">

            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[10px] border-emerald-500/20">

              <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-emerald-500 border-r-emerald-500 rotate-[-25deg]" />

              <div className="text-center">
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
                  87%
                </p>

                <p className="text-[10px] text-slate-400">
                  Healthy
                </p>
              </div>
            </div>

            <div className="space-y-3">

              <div>
                <p className="text-xs text-slate-400">
                  Issue resolution
                </p>

                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  92%
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Resident participation
                </p>

                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  81%
                </p>
              </div>
            </div>
          </div>

          {/* MESSAGE */}

          <div className="mt-7 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/60">

            <div className="flex items-center gap-2">

              <ShieldCheck
                size={16}
                className="text-emerald-500"
              />

              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Your community is performing well
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">
              Issue resolution and resident participation are above
              the community average.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          RECENT ACTIVITY + QUICK ACTIONS
      ===================================================== */}

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">

        {/* RECENT ACTIVITY */}

        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0D1524]">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Latest issues reported by you
              </p>
            </div>

            <button
              onClick={() => navigate("/citizen/issues")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400"
            >
              View all
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">

            {recentIssues.map((issue) => (
              <button
                key={issue.id}
                onClick={() =>
                  navigate(`/citizen/issues/${issue.id}`)
                }
                className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <AlertCircle size={18} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                    <h3 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-emerald-400">
                      {issue.title}
                    </h3>

                    <span
                      className={`w-fit rounded-full border px-2 py-1 text-[10px] font-semibold ${issue.statusClass}`}
                    >
                      {issue.status}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-400">

                    <span>
                      {issue.category}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} />
                      {issue.location}
                    </span>

                    <span>
                      {issue.time}
                    </span>
                  </div>
                </div>

                <ArrowUpRight
                  size={17}
                  className="hidden text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500 sm:block"
                />
              </button>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0D1524]">

          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Quick Actions
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Everything you need in one place.
            </p>
          </div>

          <div className="mt-5 space-y-3">

            <QuickAction
              icon={Plus}
              title="Report an Issue"
              description="Report a civic problem"
              color="emerald"
              onClick={() =>
                navigate("/citizen/report")
              }
            />

            <QuickAction
              icon={MapPin}
              title="Community Map"
              description="Explore local issues"
              color="blue"
              onClick={() =>
                navigate("/citizen/map")
              }
            />

            <QuickAction
              icon={WalletCards}
              title="Maintenance"
              description="View your payments"
              color="purple"
              onClick={() =>
                navigate("/citizen/fees")
              }
            />

            <QuickAction
              icon={Bell}
              title="Announcements"
              description="See community updates"
              color="amber"
              onClick={() =>
                navigate("/citizen/announcements")
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          BOTTOM ROW
      ===================================================== */}

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

        {/* ANNOUNCEMENTS */}

        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0D1524]">

          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Megaphone size={17} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Community Announcements
                </h2>

                <p className="text-[11px] text-slate-400">
                  Latest updates
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/citizen/announcements")
              }
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
            >
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">

            {announcements.map((announcement) => (
              <div
                key={announcement.title}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {announcement.title}
                  </p>
                </div>

                <span className="shrink-0 text-[11px] text-slate-400">
                  {announcement.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* MAINTENANCE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0D1524]">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Maintenance
              </h2>

              <p className="mt-1 text-[11px] text-slate-400">
                Current payment status
              </p>
            </div>

            <WalletCards
              size={18}
              className="text-purple-500"
            />
          </div>

          <div className="mt-6 flex items-end justify-between">

            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">
                ₹2,500
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Monthly maintenance
              </p>
            </div>

            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Paid
            </span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-full rounded-full bg-emerald-500" />
          </div>

          <button
            onClick={() =>
              navigate("/citizen/fees")
            }
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
          >
            View payment history
            <ChevronRight size={14} />
          </button>
        </div>
      </section>
    </div>
  );
};

/* =========================================================
   QUICK ACTION COMPONENT
========================================================= */

const QuickAction = ({
  icon: Icon,
  title,
  description,
  color,
  onClick,
}) => {
  const styles = {
    emerald:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

    blue:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400",

    purple:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400",

    amber:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
    >

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0">

        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </p>

        <p className="mt-0.5 text-[11px] text-slate-400">
          {description}
        </p>
      </div>

      <ChevronRight
        size={16}
        className="ml-auto shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-slate-500"
      />
    </button>
  );
};

export default Dashboard;