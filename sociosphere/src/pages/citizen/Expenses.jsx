
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

// All figures below are DEMO DATA, not actual society accounts.

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

const monthlyData = [
  { name: "May", amount: 62000 },
  { name: "Jun", amount: 74000 },
  { name: "Jul", amount: 58000 },
  { name: "Aug", amount: 81000 },
  { name: "Sep", amount: 69000 },
  { name: "Oct", amount: 89000 },
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

export default function Expenses() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [chartView, setChartView] = useState("monthly");
  const [selectedGoal, setSelectedGoal] = useState("reserve");
  const [selectedAmount, setSelectedAmount] = useState(500);

  const totalReceived = incomeRecords.reduce(
    (total, item) => total + item.amount,
    0
  );

  const totalExpenses = expenseRecords.reduce(
    (total, item) => total + item.amount,
    0
  );

  // Demo balance calculation only.
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
      title: "Available Balance",
      value: formatMoney(availableBalance),
      icon: TrendingUp,
      description: "Received minus expenses",
    },
    {
      id: "reserve",
      title: "Reserve Fund",
      value: formatMoney(500000),
      icon: PiggyBank,
      description: "Funds set aside for future needs",
    },
  ];

  function toggleCard(id) {
    setExpandedCard(expandedCard === id ? null : id);
  }

  const chartData =
    chartView === "monthly"
      ? [
          { name: "Security", amount: 25000 },
          { name: "Electricity", amount: 18000 },
          { name: "Cleaning", amount: 8000 },
          { name: "Painting", amount: 12000 },
          { name: "Lift", amount: 10000 },
          { name: "Repairs", amount: 14000 },
          { name: "Admin", amount: 2000 },
        ]
      : monthlyData;

  const highestAmount = Math.max(
    ...chartData.map((item) => item.amount)
  );

  const goal = contributionGoals.find(
    (item) => item.id === selectedGoal
  );

  return (
    <div className="min-h-screen space-y-8 bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

      {/* PAGE HEADING */}
      <header className="border-b-4 border-emerald-600 pb-5">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Financial Transparency
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Understand how society funds are collected, spent and saved.
        </p>
        <p className="mt-3 text-xs text-amber-400">
          Demo dashboard — all amounts and records are illustrative.
        </p>
      </header>

      {/* SUMMARY CARDS */}
      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ id, title, value, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => toggleCard(id)}
              aria-expanded={expandedCard === id}
              className={`rounded-xl border bg-slate-900 p-5 text-left transition hover:border-emerald-500 ${
                expandedCard === id
                  ? "border-emerald-500"
                  : "border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-slate-400">{title}</p>
                <Icon size={23} className="text-emerald-400" />
              </div>

              <h2 className="mt-4 text-2xl font-bold">{value}</h2>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-500">
                  {description}
                </span>
                {expandedCard === id ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* EXPANDED CARD DETAILS */}
      {expandedCard && (
        <section className="rounded-xl border border-emerald-800 bg-slate-900 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold">
              {stats.find((item) => item.id === expandedCard)?.title}
            </h2>
            <button
              onClick={() => setExpandedCard(null)}
              className="text-sm text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* INCOME BREAKDOWN */}
          {expandedCard === "received" && (
            <div className="space-y-3">
              <p className="mb-4 text-sm text-slate-400">
                Collection sources are shown separately. Individual
                residents' names, flat numbers and payment histories
                are not displayed.
              </p>

              {incomeRecords.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between gap-4 rounded-lg bg-slate-800 p-4"
                >
                  <span>{item.name}</span>
                  <span className="font-semibold text-emerald-400">
                    {formatMoney(item.amount)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between border-t border-slate-700 pt-4 font-bold">
                <span>Total received</span>
                <span>{formatMoney(totalReceived)}</span>
              </div>

              <p className="text-xs text-slate-500">
                These sample categories must be replaced with verified
                collection records. Refundable deposits and other liabilities
                should be accounted for separately from income.
              </p>
            </div>
          )}

          {/* EXPENSE BREAKDOWN */}
          {expandedCard === "expenses" && (
            <div className="space-y-3">
              <p className="mb-4 text-sm text-slate-400">
                Each expense includes its purpose, date, payee and payment
                status. A receipt link appears only when a document URL
                has been provided.
              </p>

              {expenseRecords.map((item) => (
                <div
                  key={item.category}
                  className="rounded-lg bg-slate-800 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold">{item.category}</h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {item.description}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.date} · {item.vendor}
                      </p>
                      <p className="mt-2 text-xs text-emerald-400">
                        Status: {item.status}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-rose-400">
                        {formatMoney(item.amount)}
                      </span>

                      {item.receiptUrl ? (
                        <a
                          href={item.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-700 px-3 py-2 text-sm text-emerald-400 hover:bg-emerald-950"
                        >
                          <Receipt size={16} />
                          View receipt
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Receipt not uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between border-t border-slate-700 pt-4 font-bold">
                <span>Total expenses</span>
                <span>{formatMoney(totalExpenses)}</span>
              </div>
            </div>
          )}

          {/* AVAILABLE BALANCE */}
          {expandedCard === "balance" && (
            <div className="space-y-3">
              <div className="flex justify-between rounded-lg bg-slate-800 p-4">
                <span>Demo total received</span>
                <span className="text-emerald-400">
                  +{formatMoney(totalReceived)}
                </span>
              </div>

              <div className="flex justify-between rounded-lg bg-slate-800 p-4">
                <span>Demo total expenses</span>
                <span className="text-rose-400">
                  -{formatMoney(totalExpenses)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-700 pt-4 font-bold">
                <span>Calculated balance</span>
                <span>{formatMoney(availableBalance)}</span>
              </div>

              <p className="text-xs text-slate-500">
                A real balance must include opening balances, pending
                payments, liabilities, refunds and reserve restrictions.
              </p>
            </div>
          )}

          {/* RESERVE FUND */}
          {expandedCard === "reserve" && (
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                Reserve funds are set aside for major repairs and
                unexpected future costs.
              </p>

              <div className="rounded-lg bg-slate-800 p-4">
                <p className="text-sm text-slate-400">
                  Illustrative reserve balance
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  ₹5,00,000
                </p>
              </div>

              <p className="text-sm text-slate-300">
                Possible uses include lift replacement, roof repairs and
                major structural maintenance.
              </p>

              <p className="text-xs text-slate-500">
                This is a separate demo figure. Do not add it to the
                available balance unless the accounting records support it.
              </p>
            </div>
          )}
        </section>
      )}

      {/* CHART */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Expense Overview</h2>
            <p className="mt-1 text-sm text-slate-400">
              {chartView === "monthly"
                ? "October spending by category"
                : "Spending by month"}
            </p>
          </div>

          <div className="flex gap-2 rounded-lg bg-slate-800 p-1">
            <button
              onClick={() => setChartView("monthly")}
              className={`rounded-md px-3 py-2 text-sm ${
                chartView === "monthly"
                  ? "bg-emerald-600"
                  : "text-slate-400"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setChartView("yearly")}
              className={`rounded-md px-3 py-2 text-sm ${
                chartView === "yearly"
                  ? "bg-emerald-600"
                  : "text-slate-400"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-6">
          {chartData.map((item) => (
            <div key={item.name} className="flex min-w-0 flex-col items-center">
              <span className="mb-2 text-center text-xs text-slate-300">
                {formatMoney(item.amount)}
              </span>

              <div className="flex h-48 w-full items-end justify-center rounded-t-md bg-slate-800/60 px-2">
                <div
                  style={{
                    height: `${Math.max(
                      (item.amount / highestAmount) * 100,
                      5
                    )}%`,
                  }}
                  className="w-full max-w-12 rounded-t-md bg-emerald-500"
                />
              </div>

              <span className="mt-3 text-center text-xs text-slate-400">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Demo figures only. The monthly view shows categories; the yearly
          view compares months. Replace both with actual records.
        </p>
      </section>

      {/* COMMUNITY CONTRIBUTIONS */}
      <section className="space-y-5 rounded-xl border border-emerald-900 bg-slate-900 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-emerald-950 p-3">
            <HeartHandshake size={26} className="text-emerald-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Support Your Community
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Voluntary contributions can help build a safety reserve
              and fund improvements to shared spaces.
            </p>
          </div>
        </div>

        <p className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-xs text-slate-300">
          Contributions are optional. This demonstration does not accept
          payments. Amounts shown below are illustrative, not verified
          contributions.
        </p>

        {/* SELECT A GOAL */}
        <div>
          <h3 className="mb-3 font-semibold">Choose a contribution goal</h3>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {contributionGoals.map((item) => {
              const progress = Math.min(
                (item.raised / item.target) * 100,
                100
              );

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedGoal(item.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedGoal === item.id
                      ? "border-emerald-500 bg-emerald-950/40"
                      : "border-slate-700 bg-slate-800 hover:border-slate-500"
                  }`}
                >
                  <h4 className="font-semibold">{item.name}</h4>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    {item.description}
                  </p>

                  <div className="mt-4 flex justify-between gap-2 text-xs">
                    <span className="text-slate-400">Demo progress</span>
                    <span className="text-emerald-400">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full rounded-full bg-emerald-500"
                    />
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    {formatMoney(item.raised)} of{" "}
                    {formatMoney(item.target)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SELECT AMOUNT */}
        <div className="rounded-xl bg-slate-800 p-4 sm:p-5">
          <h3 className="font-semibold">Choose an amount</h3>

          <p className="mt-1 text-sm text-slate-400">
            Selected goal: {goal.name}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {[100, 500, 1000, 2000].map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  selectedAmount === amount
                    ? "border-emerald-500 bg-emerald-600 text-white"
                    : "border-slate-600 text-slate-300 hover:border-emerald-500"
                }`}
              >
                {formatMoney(amount)}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-slate-700 p-4">
            <p className="text-sm text-slate-400">Your selected amount</p>
            <p className="mt-1 text-2xl font-bold">
              {formatMoney(selectedAmount)}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Your identity would remain private on the public dashboard.
              Appropriate authorised records would still be required for
              accounting and payment confirmation.
            </p>
          </div>

          <button
            disabled
            className="mt-4 w-full cursor-not-allowed rounded-lg bg-emerald-700 px-4 py-3 font-semibold opacity-60"
          >
            Payments not available in demo
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <p className="text-xs leading-5 text-slate-500">
        SocioSphere financial transparency demonstration. Actual collections,
        expenses, balances, reserve funds, contribution totals and receipts
        must be connected to verified society records before real-world use.
      </p>
    </div>
  );
}
