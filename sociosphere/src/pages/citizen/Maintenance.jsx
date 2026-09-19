import React from "react";
import { CheckCircle2, IndianRupee, Receipt, WalletCards } from "lucide-react";

const Maintenance = () => {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          Resident utilities
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Maintenance payments
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          View your current maintenance status and payment summary.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <WalletCards size={20} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={14} />
              Paid
            </span>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Current month</p>
          <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            <IndianRupee className="mr-1 inline-block" size={24} />
            2,500
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#0D1524]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Receipt size={20} />
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Next due date</p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            1 October 2026
          </p>
          <p className="mt-1 text-xs text-slate-400">No pending dues</p>
        </div>
      </section>
    </div>
  );
};

export default Maintenance;
