import React, { useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MessageSquare, Send, X } from "lucide-react";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AuthorityLayout from "./components/layout/AuthorityLayout";

import Landing from "./pages/public/Landing";
import SignUp from "./pages/public/Sign_up";
import Login from "./pages/public/Login";
import FAQs from "./pages/public/FAQs";
import NotFound from "./pages/public/NotFound";

import Report from "./pages/citizen/Report";
import ReportCrime from "./pages/citizen/ReportCrime";

import Home from "./pages/citizen/Home";
import Dashboard from "./pages/citizen/Dashboard";
import Profile from "./pages/citizen/Profile";
import Settings from "./pages/citizen/Settings";
import Announcements from "./pages/citizen/Announcements";
import Events from "./pages/citizen/Events";
import Maintenance from "./pages/citizen/Maintenance";
import LostFound from "./pages/citizen/LostFound";
import Expenses from "./pages/citizen/Expenses";
import Community from "./pages/citizen/Community";
import Emergency from "./pages/citizen/Emergency";

import AdminHome from "./pages/authority/Admin";
import Analytics from "./pages/authority/Analytics";
import Issues from "./pages/authority/Issues";
import Crimes from "./pages/authority/Crimes";
import Members from "./pages/authority/Members";
import ManageEmergency from "./pages/authority/ManageEmergency";
import ManageFees from "./pages/authority/ManageFees";
import ManageExpenses from "./pages/authority/ManageExpenses";
import AuthorityProfile from "./pages/authority/AuthorityProfile";
import AdminFAQs from "./pages/authority/AdminFAQs";

import RedAlertOverlay from "./components/ui/RedAlertOverlay";
import BackToTop from "./components/ui/BackToTop";

const CHAT_KEY = "sociosphere_group_chat_messages";

function GroupChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]"); } catch { return []; }
  });
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const location = useLocation();

  // scroll to bottom whenever messages change or panel opens
  React.useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!location.pathname.startsWith("/citizen") && !location.pathname.startsWith("/authority")) return null;

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const authorUser = (() => {
      try {
        return JSON.parse(localStorage.getItem("sociosphere_auth_user") || "null");
      } catch {
        return null;
      }
    })();
    const sender = authorUser?.name && !authorUser.name.includes("@")
      ? authorUser.name
      : authorUser?.role === "authority" ? "Society Authority" : "Resident";

    const msg = {
      id: Date.now(),
      sender,
      role: authorUser?.role || "citizen",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    localStorage.setItem(CHAT_KEY, JSON.stringify(updated));
    setText("");
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open Community Chat"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-emerald-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Slide-in / popover chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[480px] w-96 flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-emerald-500 px-4 py-3 text-white dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span className="font-semibold text-sm">Community Group Chat</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message history */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 ? (
              <p className="mt-16 text-center text-xs text-slate-400">
                No messages yet. Start the conversation with your neighbours!
              </p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                      {m.sender}
                    </span>
                    {m.role === "authority" && (
                      <span className="rounded bg-emerald-100 px-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Admin
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="mt-0.5 max-w-[90%] rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                    {m.text}
                  </p>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input row */}
          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-slate-200 p-3 dark:border-slate-800"
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message to colony..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-emerald-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-600 disabled:opacity-40"
              disabled={!text.trim()}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function App() {
  const location = useLocation();
  const isAuthority = location.pathname.startsWith("/authority");

  return (
    <>
      {!isAuthority && <RedAlertOverlay />}

      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/faq" element={<Navigate to="/faqs" replace />} />
        </Route>

        {/* ================= CITIZEN ================= */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Navigate to="/login" replace />} />
          <Route path="report" element={<Report />} />
          <Route path="report-crime" element={<ReportCrime />} />
          <Route path="lost-found" element={<LostFound />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="fees" element={<Maintenance />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="events" element={<Events />} />
          <Route path="community" element={<Community />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="faq" element={<Navigate to="/citizen/faqs" replace />} />
        </Route>

        {/* ================= AUTHORITY ================= */}
        <Route path="/authority" element={<AuthorityLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="issues" element={<Issues />} />
          <Route path="crimes" element={<Crimes />} />
          <Route path="members" element={<Members />} />
          <Route path="emergency" element={<ManageEmergency />} />
          <Route path="fees" element={<ManageFees />} />
          <Route path="expenses" element={<ManageExpenses />} />
          <Route path="profile" element={<AuthorityProfile />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="faq" element={<Navigate to="/authority/faqs" replace />} />
        </Route>

        {/* ================= 404 / FALLBACK ================= */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <GroupChatButton />
      <BackToTop />
    </>
  );
}

export default App;
