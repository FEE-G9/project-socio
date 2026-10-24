
import React, { useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { MessageSquare, Send, X } from "lucide-react";

import PublicLayout from "./components/layout/PublicLayout";
import CitizenLayout from "./components/layout/CitizenLayout";
import AuthorityLayout from "./components/layout/AuthorityLayout";

import Landing from "./pages/public/Landing";
import SignUp from "./pages/public/Sign_up";
import Login from "./pages/public/Login";
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
import ManageFees from "./pages/authority/ManageFees";
import PostAnnouncement from "./pages/authority/PostAnnouncement";
import AuthorityProfile from "./pages/authority/AuthorityProfile";

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

  if (!location.pathname.startsWith("/citizen")) return null;

  const sendMessage = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg = {
      id: Date.now(),
      text: trimmed,
      sender: "You",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    const next = [...messages, msg];
    setMessages(next);
    localStorage.setItem(CHAT_KEY, JSON.stringify(next));
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-[88px] right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-violet-500 bg-violet-500 text-white shadow-lg transition-all duration-200 hover:-translate-y-1 hover:bg-violet-600 hover:border-violet-600 focus:outline-none focus:ring-4 focus:ring-violet-500/30 dark:border-violet-400 dark:bg-violet-500 dark:hover:bg-violet-600 sm:bottom-[72px] sm:right-6"
        aria-label="Group chat"
        title="Group chat"
      >
        {open ? <X size={20} strokeWidth={2.5} aria-hidden="true" /> : <MessageSquare size={20} strokeWidth={2.5} aria-hidden="true" />}
      </button>

      {open && (
        <div className="fixed bottom-[144px] right-4 z-50 flex w-80 flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#0D1524] sm:bottom-32 sm:right-6">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-violet-600 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-white" />
              <span className="text-sm font-bold text-white">Community Group Chat</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 transition hover:text-white" aria-label="Close chat">
              <X size={16} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex h-56 flex-col gap-2 overflow-y-auto px-3 py-3">
            {messages.length === 0 ? (
              <p className="my-auto text-center text-xs text-slate-400 dark:text-slate-500">
                No messages yet. Say hello! 👋
              </p>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex flex-col items-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-violet-600 px-3 py-2 text-sm text-white">
                    {msg.text}
                  </div>
                  <span className="mt-0.5 text-[10px] text-slate-400">{msg.time}</span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-100 px-3 py-3 dark:border-slate-800">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message…"
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-40"
              aria-label="Send"
            >
              <Send size={15} />
            </button>
          </div>
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
        </Route>

        {/* ================= AUTHORITY ================= */}
        <Route path="/authority" element={<AuthorityLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="issues" element={<Issues />} />
          <Route path="crimes" element={<Crimes />} />
          <Route path="members" element={<Members />} />
          <Route path="fees" element={<ManageFees />} />
          <Route path="announcements" element={<PostAnnouncement />} />
          <Route path="profile" element={<AuthorityProfile />} />
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
