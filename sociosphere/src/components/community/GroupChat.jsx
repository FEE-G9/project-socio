import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, Send, X } from "lucide-react";

const CHAT_KEY = "sociosphere_group_chat_messages";

export default function GroupChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!location.pathname.startsWith("/citizen") && !location.pathname.startsWith("/authority")) {
    return null;
  }

  const sendMessage = (event) => {
    event.preventDefault();
    if (!text.trim()) return;

    let authorUser = null;
    try {
      authorUser = JSON.parse(localStorage.getItem("sociosphere_auth_user") || "null");
    } catch {
      authorUser = null;
    }

    const sender =
      authorUser?.name && !authorUser.name.includes("@")
        ? authorUser.name
        : authorUser?.role === "authority"
          ? "Society Authority"
          : "Resident";
    const message = {
      id: Date.now(),
      sender,
      role: authorUser?.role || "citizen",
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    localStorage.setItem(CHAT_KEY, JSON.stringify(updatedMessages));
    setText("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Open Community Chat"
        className="fixed bottom-36 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 text-white shadow-xl transition-all duration-200 hover:scale-105 hover:bg-purple-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400/40 sm:bottom-20 sm:right-6"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-[212px] right-4 z-50 flex h-[480px] w-96 max-h-[calc(100vh-14rem)] max-w-[calc(100vw-2rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 sm:bottom-36 sm:right-6">
          <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-200 bg-purple-600 px-4 py-3 text-white dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span className="text-sm font-semibold">Community Group Chat</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close Community Chat"
              className="rounded-lg p-1 text-white/80 hover:bg-white/20 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 ? (
              <p className="mt-16 text-center text-xs text-slate-400">
                No messages yet. Start the conversation with your neighbours!
              </p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {message.sender}
                    </span>
                    {message.role === "authority" && (
                      <span className="rounded bg-purple-100 px-1 text-[10px] font-bold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                        Admin
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{message.time}</span>
                  </div>
                  <p className="mt-0.5 max-w-[90%] rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                    {message.text}
                  </p>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-slate-200 p-3 dark:border-slate-800"
          >
            <input
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type a message to colony..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 outline-none focus:border-purple-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-700 disabled:opacity-40"
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
