"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser } from "@/lib/auth";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "@/lib/chat";

interface OtherUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

interface ConversationPreview {
  id: string;
  otherUser: OtherUser;
  lastMessage: {
    text: string;
    createdAt: string;
    isOwn: boolean;
  } | null;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return `${Math.floor(diffDays / 7)}w`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get("conversation");

  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(
    initialConvId
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load user and conversations
  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        try {
          const convs = await getConversations();
          setConversations(convs);
        } catch (err) {
          console.error("Failed to load conversations", err);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConvId) return;

    async function loadMessages() {
      try {
        const msgs = await getMessages(activeConvId!);
        setMessages(msgs);
        setTimeout(scrollToBottom, 100);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    }

    loadMessages();

    // Poll for new messages every 3 seconds
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const msgs = await getMessages(activeConvId!);
        setMessages(msgs);
      } catch {
        /* ignore */
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [activeConvId, scrollToBottom]);

  // Focus input when conversation opens
  useEffect(() => {
    if (activeConvId) inputRef.current?.focus();
  }, [activeConvId]);

  const handleSend = async () => {
    if (!input.trim() || !activeConvId || sending) return;

    setSending(true);
    try {
      const msg = await sendMessage(activeConvId, input.trim());
      setMessages((prev) => [...prev, msg]);
      setInput("");
      setTimeout(scrollToBottom, 50);

      // Update conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                lastMessage: {
                  text: msg.text,
                  createdAt: msg.createdAt,
                  isOwn: true,
                },
                updatedAt: msg.createdAt,
              }
            : c
        )
      );
    } catch (err) {
      console.error("Failed to send", err);
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.otherUser.name || "").toLowerCase().includes(q) ||
      c.otherUser.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-slate-100">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse">
            <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" />
            Loading messages...
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-slate-100">
        <Navbar />
        <div className="flex min-h-[80vh] items-center justify-center pt-20">
          <div className="glass-card p-12 text-center max-w-md">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Sign in to chat
            </h3>
            <p className="text-slate-500 mb-6">
              Log in to start messaging employers and students.
            </p>
            <a href="/login" className="primary-button">
              Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="pt-24 pb-8 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        <div
          className="glass-card overflow-hidden flex"
          style={{ height: "calc(100vh - 140px)" }}
        >
          {/* ═══════ Sidebar ═══════ */}
          <div
            className={`${
              showSidebar ? "flex" : "hidden md:flex"
            } flex-col w-full md:w-[340px] border-r border-slate-200 dark:border-[rgba(255,255,255,0.05)] shrink-0`}
          >
            {/* Sidebar header */}
            <div className="p-5 border-b border-slate-200 dark:border-[rgba(255,255,255,0.05)] shrink-0">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Messages
              </h2>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="text-sm font-semibold">No conversations yet</p>
                  <p className="text-xs mt-1">
                    Visit an employer profile to start a chat.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setShowSidebar(false);
                    }}
                    className={`w-full text-left px-5 py-4 flex items-center gap-3 transition-all duration-200 border-b border-slate-100 dark:border-[rgba(255,255,255,0.03)] ${
                      activeConvId === conv.id
                        ? "bg-brand-primary/5 dark:bg-brand-primary/10"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                      {conv.otherUser.image ? (
                        <img
                          src={conv.otherUser.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-brand-primary">
                          {(conv.otherUser.name || conv.otherUser.email)
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {conv.otherUser.name || conv.otherUser.email}
                        </p>
                        {conv.lastMessage && (
                          <span className="text-xs text-slate-400 shrink-0">
                            {timeAgo(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {conv.lastMessage
                          ? `${conv.lastMessage.isOwn ? "You: " : ""}${conv.lastMessage.text}`
                          : "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* ═══════ Chat Area ═══════ */}
          <div
            className={`${
              !showSidebar ? "flex" : "hidden md:flex"
            } flex-col flex-1 min-w-0`}
          >
            {activeConversation ? (
              <>
                {/* Chat header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-[rgba(255,255,255,0.05)] flex items-center gap-4 shrink-0 bg-white/50 dark:bg-[rgba(255,255,255,0.02)]">
                  {/* Mobile back button */}
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden text-slate-400 hover:text-brand-primary transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20 flex items-center justify-center overflow-hidden">
                    {activeConversation.otherUser.image ? (
                      <img
                        src={activeConversation.otherUser.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-brand-primary">
                        {(
                          activeConversation.otherUser.name ||
                          activeConversation.otherUser.email
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {activeConversation.otherUser.name ||
                        activeConversation.otherUser.email}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">
                      {activeConversation.otherUser.role}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-[rgba(0,0,0,0.2)]">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                      Start a conversation — say hello! 👋
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isOwn = msg.senderId === user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                              isOwn
                                ? "bg-brand-primary text-white rounded-br-md"
                                : "bg-white dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-md shadow-sm"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <p
                              className={`text-[10px] mt-1 ${
                                isOwn
                                  ? "text-white/60"
                                  : "text-slate-400"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-5 py-4 border-t border-slate-200 dark:border-[rgba(255,255,255,0.05)] bg-white dark:bg-[rgba(255,255,255,0.02)] shrink-0">
                  <div className="flex items-center gap-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-100 dark:bg-slate-800/60 rounded-full px-5 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || sending}
                      className="w-11 h-11 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                      aria-label="Send"
                    >
                      {sending ? (
                        <div className="w-4 h-4 rounded-full border-t-2 border-white animate-spin" />
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* No conversation selected */
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-brand-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Your Messages
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    Select a conversation to start chatting, or visit an
                    employer profile to send a message.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center opacity-30 text-sm font-bold uppercase tracking-widest">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
