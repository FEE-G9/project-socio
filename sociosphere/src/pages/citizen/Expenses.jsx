import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChevronDown,
  ChevronUp,
  Receipt,
  HeartHandshake,
} from "lucide-react";

// DEMO DATA ONLY — not actual society accounts.

const incomeRecords = [
  { name: "Monthly maintenance charges", amount: 100000 },
  { name: "Parking charges", amount: 15000 },
  { name: "Clubhouse booking fees", amount: 10000 },
  { name: "Interest earned on society funds", amount: 5000 },
  { name: "Move-in and administrative fees", amount: 20000 },
];

const expenseRecords = [
  {
    category: "Security salaries",
    description: "Security staff payment",
    date: "15 Oct 2026",
    amount: 25000,
    vendor: "Security service provider",
    status: "Paid",
    receiptUrl: null,
  },
  {
    category: "Electricity",
    description: "Common-area electricity bill",
    date: "12 Oct 2026",
    amount: 18000,
    vendor: "Electricity provider",
    status: "Paid",
    receiptUrl: null,
  },
  {
    category: "Cleaning services",
    description: "Common-area cleaning",
    date: "10 Oct 2026",
    amount: 8000,
    vendor: "Cleaning service provider",
    status: "Paid",
    receiptUrl: null,
  },
  {
    category: "Painting",
    description: "Common-area painting work",
    date: "8 Oct 2026",
    amount: 12000,
    vendor: "Painting contractor",
    status: "Paid",
    receiptUrl: null,
  },
  {
    category: "Lift maintenance",
    description: "Routine lift servicing",
    date: "6 Oct 2026",
    amount: 10000,
    vendor: "Lift maintenance company",
    status: "Paid",
    receiptUrl: null,
  },
  {
    category: "Repairs and plumbing",
    description: "Common-area repair work",
    date: "4 Oct 2026",
    amount: 14000,
    vendor: "Maintenance contractor",
    status: "Paid",
    receiptUrl: null,
  },
  {
    category: "Administration",
    description: "Bank and administrative charges",
    date: "2 Oct 2026",
    amount: 2000,
    vendor: "Bank / service provider",
    status: "Paid",
    receiptUrl: null,
  },
];

// Illustrative monthly figures. These are not verified historical records.
const monthlyData = [
  { name: "May", income: 100000, expenses: 62000 },
  { name: "June", income: 115000, expenses: 74000 },
  { name: "July", income: 105000, expenses: 58000 },
  { name: "August", income: 125000, expenses: 81000 },
  { name: "September", income: 110000, expenses: 69000 },
  { name: "October", income: 150000, expenses: 89000 },
];

const contributionGoals = [
  {
    id: "reserve",
    name: "Emergency Reserve Fund",
    description:
      "Build a safety fund for unexpected repairs and emergencies.",
    target: 800000,
    raised: 500000,
  },
  {
    id: "painting",
    name: "Society Painting Project",
    description:
      "Help fund painting and refurbishment of shared areas.",
    target: 200000,
    raised: 65000,
  },
  {
    id: "garden",
    name: "Community Garden",
    description:
      "Improve shared green spaces and garden facilities.",
    target: 100000,
    raised: 30000,
  },
];

const formatMoney = (amount) =>
  "₹" + amount.toLocaleString("en-IN");

// Reusable bar for the monthly graph.
function FinancialBar({ amount, maxAmount, color, label }) {
  const height =
    maxAmount > 0 ? (amount / maxAmount) * 100 : 0;

  return (
    <div className="min-w-0 flex-1">
      <div className="mb-2 text-center text-xs text-slate-600 dark:text-slate-300">
        {formatMoney(amount)}
      </div>

      <div className="flex h-36 items-end rounded-t-md bg-slate-100 p-1 dark:bg-slate-800/70 sm:h-44">
        <div
          title={`${label}: ${formatMoney(amount)}`}
          style={{ height: `${height}%` }}
          className={`w-full rounded-t-md ${color}`}
        />
      </div>
    </div>
  );
}

export default function Expenses() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("reserve");
  const [selectedAmount, setSelectedAmount] = useState("500");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const totalReceived = incomeRecords.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalExpenses = expenseRecords.reduce(
    (total, item) => total + item.amount,
    0
  );

  // Simple demo calculation, not a verified bank balance.
  const availableBalance = totalReceived - totalExpenses;

  const stats = [
    {
      id: "received",
      title: "Total Received",
      value: formatMoney(totalReceived),
      icon: Wallet,
      description: "Where the money came from",
    },
    {
      id: "expenses",
      title: "Total Expenses",
      value: formatMoney(totalExpenses),
      icon: TrendingDown,
      description: "Where the money was spent",
    },
    {
      id: "balance",
      title: "Calculated Balance",
      value: formatMoney(availableBalance),
      icon: TrendingUp,
      description: "Demo income minus expenses",
    },
    {
      id: "reserve",
      title: "Reserve Fund",
      value: formatMoney(500000),
      icon: PiggyBank,
      description: "Illustrative reserve figure",
    },
  ];

  function toggleCard(id) {
    setExpandedCard(expandedCard === id ? null : id);
  }

  const goal = contributionGoals.find(
    (item) => item.id === selectedGoal
  );

  function handleContributionRequest(event) {
    event.preventDefault();

    const amount = Number(selectedAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setRequestSubmitted(false);
      setRequestMessage("Please enter an amount greater than zero.");
      return;
    }

    if (amount > 1000000000) {
      setRequestSubmitted(false);
      setRequestMessage("Please enter a smaller amount.");
      return;
    }

    // Demo only: this does not save or send a request to an admin.
    console.log("Demo contribution request:", {
      goal: goal.name,
      amount,
    });

    setRequestSubmitted(true);
    setRequestMessage(
      `Demo request prepared for ${formatMoney(amount)} towards ${goal.name}. No admin has been notified.`
    );
  }

  // One shared scale makes monthly bars comparable.
  const highestMonthlyAmount = Math.max(
    ...monthlyData.map((item) =>
      Math.max(item.income, item.expenses)
    ),
    1
  );

  // Scale for the expense category graph.
  const highestExpenseAmount = Math.max(
    ...expenseRecords.map((item) => item.amount),
    1
  );

  return (
    <div className="min-h-screen space-y-8 bg-slate-50 p-4 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 sm:p-6 lg:p-8">
      {/* PAGE HEADING */}
      <header className="border-b-4 border-emerald-600 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Financial Transparency
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Understand how society funds are collected, spent and saved.
        </p>

        <p className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400">
          Demo dashboard — all amounts and records are illustrative.
        </p>
      </header>

      {/* SUMMARY CARDS */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ id, title, value, icon: Icon, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleCard(id)}
              aria-expanded={expandedCard === id}
              className={`rounded-xl border p-5 text-left transition hover:border-emerald-500 hover:shadow-md ${
                expandedCard === id
                  ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20 dark:bg-slate-900 dark:border-emerald-500"
                  : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
                <Icon size={23} className="text-emerald-600 dark:text-emerald-400" />
              </div>

              <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{value}</h2>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </span>

                <span className="text-slate-400 dark:text-slate-500">
                  {expandedCard === id ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* EXPANDED CARD DETAILS */}
      {expandedCard && (
        <section className="rounded-xl border border-emerald-500/40 bg-white p-5 shadow-sm dark:border-emerald-800 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {stats.find((item) => item.id === expandedCard)?.title}
            </h2>

            <button
              type="button"
              onClick={() => setExpandedCard(null)}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Close
            </button>
          </div>

          {/* INCOME DETAILS */}
          {expandedCard === "received" && (
            <div className="space-y-3">
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Income sources are shown separately. Individual residents'
                names, flat numbers and payment histories are not displayed.
              </p>

              {incomeRecords.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between gap-4 rounded-lg bg-slate-100 p-4 text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatMoney(item.amount)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                <span>Total received</span>
                <span>{formatMoney(totalReceived)}</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sample data only. Actual collection records must be verified.
              </p>
            </div>
          )}

          {/* EXPENSE DETAILS */}
          {expandedCard === "expenses" && (
            <div className="space-y-3">
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Each expense includes its purpose, date, payee and payment
                status. A receipt link appears only when provided.
              </p>

              {expenseRecords.map((item) => (
                <div
                  key={item.category}
                  className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{item.category}</h3>

                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {item.description}
                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {item.date} · {item.vendor}
                      </p>

                      <p className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Payment status: {item.status}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        {formatMoney(item.amount)}
                      </span>

                      {item.receiptUrl ? (
                        <a
                          href={item.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950"
                        >
                          <Receipt size={16} />
                          View receipt
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                          Receipt not uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                <span>Total expenses</span>
                <span>{formatMoney(totalExpenses)}</span>
              </div>
            </div>
          )}

          {/* CALCULATED BALANCE */}
          {expandedCard === "balance" && (
            <div className="space-y-3">
              <div className="flex justify-between rounded-lg bg-slate-100 p-4 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                <span>Demo total received</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatMoney(totalReceived)}
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-slate-100 p-4 font-medium text-slate-900 dark:bg-slate-800 dark:text-slate-100">
                <span>Demo total expenses</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  -{formatMoney(totalExpenses)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-4 font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                <span>Calculated difference</span>
                <span>{formatMoney(availableBalance)}</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                This is not a verified bank balance. A real balance must
                include opening funds, pending payments, liabilities,
                refunds and restrictions on reserve funds.
              </p>
            </div>
          )}

          {/* RESERVE FUND */}
          {expandedCard === "reserve" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Reserve funds may be set aside for major repairs and
                unexpected future costs.
              </p>

              <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Illustrative reserve balance
                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹5,00,000
                </p>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300">
                Possible uses include lift replacement, roof repairs and
                major structural maintenance.
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                This is a separate demo figure. It is not included in the
                calculated balance above.
              </p>
            </div>
          )}
        </section>
      )}

      {/* NEW SIMPLIFIED GRAPH */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Monthly Financial Overview
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Compare how much money came in and went out each month.
          </p>
        </div>

        {/* LEGEND */}
        <div className="mt-5 flex flex-wrap gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-emerald-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Income</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-rose-500" />
            <span className="font-medium text-slate-700 dark:text-slate-300">Expenses</span>
          </div>
        </div>

        {/* MONTHLY ROWS */}
        <div className="mt-6 space-y-6">
          {monthlyData.map((item) => {
            const difference = item.income - item.expenses;

            return (
              <div key={item.name} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.name}</h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    Difference:{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatMoney(difference)}
                    </span>
                  </p>
                </div>

                {/* INCOME ROW */}
                <div className="grid grid-cols-[68px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[90px_minmax(0,1fr)]">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                    Income
                  </span>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        style={{
                          width: `${
                            (item.income / highestMonthlyAmount) * 100
                          }%`,
                        }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>

                    <span className="w-24 shrink-0 text-right text-xs font-semibold text-slate-700 dark:text-slate-200 sm:w-28 sm:text-sm">
                      {formatMoney(item.income)}
                    </span>
                  </div>
                </div>

                {/* EXPENSE ROW */}
                <div className="grid grid-cols-[68px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[90px_minmax(0,1fr)]">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 sm:text-sm">
                    Expenses
                  </span>

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        style={{
                          width: `${
                            (item.expenses / highestMonthlyAmount) * 100
                          }%`,
                        }}
                        className="h-full rounded-full bg-rose-500"
                      />
                    </div>

                    <span className="w-24 shrink-0 text-right text-xs font-semibold text-slate-700 dark:text-slate-200 sm:w-28 sm:text-sm">
                      {formatMoney(item.expenses)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* OCTOBER SUMMARY */}
        <div className="mt-7 grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 dark:border-slate-800 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800/70">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">October income</p>
            <p className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatMoney(monthlyData[5].income)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800/70">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">October expenses</p>
            <p className="mt-2 text-lg font-bold text-rose-600 dark:text-rose-400">
              {formatMoney(monthlyData[5].expenses)}
            </p>
          </div>

          <div className="rounded-lg bg-slate-100 p-4 dark:bg-slate-800/70">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Difference for October
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
              {formatMoney(
                monthlyData[5].income - monthlyData[5].expenses
              )}
            </p>
          </div>
        </div>

        <p className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          How to read this graph: green represents income and red represents
          expenses. Longer bars represent larger amounts. The difference is
          income minus expenses; it is not necessarily the actual bank
          balance. Monthly figures are illustrative and are not connected
          to the expense records below.
        </p>
      </section>

      {/* EXPENSE CATEGORY GRAPH */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Where Is the Money Being Spent?
        </h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          October demo expenses grouped by category.
        </p>

        <div className="mt-6 space-y-5">
          {expenseRecords.map((item) => {
            const percentage =
              (item.amount / highestExpenseAmount) * 100;

            return (
              <div key={item.category}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {item.category}
                  </span>

                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {formatMoney(item.amount)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    style={{ width: `${percentage}%` }}
                    className="h-full rounded-full bg-rose-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-between border-t border-slate-200 pt-4 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
          <span>Total expenses shown</span>
          <span>{formatMoney(totalExpenses)}</span>
        </div>

        <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Longer bars represent larger expenses. Missing receipts should
          be clearly identified; payment status alone does not verify
          the supporting documentation.
        </p>
      </section>

      {/* COMMUNITY CONTRIBUTIONS */}
      <section className="space-y-5 rounded-xl border border-emerald-500/30 bg-white p-5 shadow-sm dark:border-emerald-900 dark:bg-slate-900 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-100 p-3 dark:bg-emerald-950">
            <HeartHandshake size={26} className="text-emerald-600 dark:text-emerald-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Support Your Community
            </h2>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Request to contribute towards a reserve fund or a
              community improvement project.
            </p>
          </div>
        </div>

        <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          Contributions are optional. This demo does not accept payments.
          The progress figures are illustrative, not verified totals.
        </p>

        {/* SELECT GOAL */}
        <div>
          <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">
            1. Choose a contribution goal
          </h3>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {contributionGoals.map((item) => {
              const progress = Math.min(
                (item.raised / item.target) * 100,
                100
              );

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedGoal(item.id);
                    setRequestSubmitted(false);
                    setRequestMessage("");
                  }}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedGoal === item.id
                      ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 dark:bg-emerald-950/40"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-500"
                  }`}
                >
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.name}</h4>

                  <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>

                  <div className="mt-4 flex justify-between gap-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      Demo progress
                    </span>

                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full rounded-full bg-emerald-500"
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                    {formatMoney(item.raised)} of{" "}
                    {formatMoney(item.target)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* CONTRIBUTION REQUEST FORM */}
        <form
          onSubmit={handleContributionRequest}
          className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5"
        >
          <h3 className="font-semibold text-slate-900 dark:text-white">
            2. Enter your contribution amount
          </h3>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Selected goal:{" "}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{goal.name}</span>
          </p>

          <div>
            <label
              htmlFor="contributionAmount"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Amount (₹)
            </label>

            
<input
  id="contributionAmount"
  type="number"
  min="100"
  max="1000000000"
  step="100"
  required
  value={selectedAmount}
  onChange={(event) => {
    setSelectedAmount(event.target.value);
    setRequestSubmitted(false);
    setRequestMessage("");
  }}
  placeholder="Enter amount"
  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
/>

          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Your requested contribution
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {formatMoney(Number(selectedAmount) || 0)}
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Contributor identities should not be displayed publicly.
              Authorised records may still be required for accounting
              and payment confirmation.
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-[0.99]"
          >
            Submit Contribution Request
          </button>

          {requestMessage && (
            <p
              role="status"
              className={`rounded-lg border p-3 text-sm leading-5 ${
                requestSubmitted
                  ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200"
                  : "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
              }`}
            >
              {requestMessage}
            </p>
          )}

          <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
            Frontend demo only. A real version needs a backend to save
            requests securely and let admins review and contact residents.
            This button does not send a request to anyone.
          </p>
        </form>
      </section>

      {/* FOOTER */}
      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
        SocioSphere financial transparency demonstration. Actual collections,
        expenses, balances, reserve funds, contribution totals and receipts
        must be connected to verified society records before real-world use.
      </p>
    </div>
  );
}
