"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  options?: string[];
}

const INITIAL_MESSAGE: Message = {
  id: 0,
  text: "Hey there! 👋 I'm STUNET Bot, your career assistant. How can I help you today?",
  sender: "bot",
  options: [
    "Find Jobs",
    "Resume Tips",
    "How to Apply",
    "Internship Info",
    "Account Help",
  ],
};

const BOT_RESPONSES: Record<string, { text: string; options?: string[] }> = {
  "find jobs": {
    text: "Great choice! You can browse all open positions on our **Jobs** page. Use the filters to narrow down by type (Full-time, Internship, etc.). Would you like more help?",
    options: ["How to Apply", "Internship Info", "Resume Tips", "Go to Jobs Page"],
  },
  "resume tips": {
    text: "Here are some quick resume tips:\n\n✅ **Keep it concise** — 1 page for students\n✅ **Quantify achievements** — use numbers\n✅ **Tailor for each role** — match keywords\n✅ **Add your projects** — showcase real work\n✅ **Proofread** — no typos!\n\nYou can upload your resume link in your profile dashboard.",
    options: ["Find Jobs", "How to Apply", "Account Help"],
  },
  "how to apply": {
    text: "Applying on STUNET is simple:\n\n1️⃣ **Create an account** or log in\n2️⃣ **Complete your profile** — add skills, projects, and resume\n3️⃣ **Browse Jobs** and click on a role\n4️⃣ **Click Apply** — the employer will see your portfolio\n\nMake sure your profile is 100% complete for the best results!",
    options: ["Find Jobs", "Resume Tips", "Account Help"],
  },
  "internship info": {
    text: "STUNET partners with top companies to bring you exclusive internships. Check our **Internships** page for all available positions.\n\n💡 Tip: Most internships value practical projects over GPA. Make sure to add your best projects to your portfolio!",
    options: ["Find Jobs", "How to Apply", "Resume Tips", "Go to Internships Page"],
  },
  "account help": {
    text: "Need help with your account? Here are some common solutions:\n\n🔑 **Can't log in?** — Try the 'Forgot Password' link\n👤 **Update profile** — Go to Dashboard → My Profile\n📂 **Add projects** — Go to Dashboard → Projects\n⚡ **Add skills** — Go to Dashboard → Skills\n\nStill stuck? Contact us at support@stunet.com",
    options: ["Find Jobs", "How to Apply", "Resume Tips"],
  },
  "go to jobs page": {
    text: "Taking you to the Jobs page! 🚀",
    options: ["Resume Tips", "How to Apply", "Account Help"],
  },
  "go to internships page": {
    text: "Heading to the Internships page! 🎯",
    options: ["Find Jobs", "Resume Tips", "How to Apply"],
  },
};

const DEFAULT_RESPONSE: { text: string; options?: string[] } = {
  text: "I'm not sure about that yet, but I can help you with job search, applications, resume tips, and more! Try one of the options below.",
  options: ["Find Jobs", "Resume Tips", "How to Apply", "Internship Info", "Account Help"],
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: messages.length,
      text: text.trim(),
      sender: "user",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Navigate for special options
    if (text.toLowerCase() === "go to jobs page") {
      setTimeout(() => {
        window.location.href = "/jobs";
      }, 800);
    }
    if (text.toLowerCase() === "go to internships page") {
      setTimeout(() => {
        window.location.href = "/internships";
      }, 800);
    }

    // Simulate typing delay
    setTimeout(() => {
      const key = text.toLowerCase().trim();
      const response = BOT_RESPONSES[key] || DEFAULT_RESPONSE;

      const botMsg: Message = {
        id: messages.length + 1,
        text: response.text,
        sender: "bot",
        options: response.options,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend(input);
  };

  return (
    <>
      {/* Floating Chat Button — PS5 Glow */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_30px_rgba(0,68,255,0.5)] hover:shadow-[0_0_50px_rgba(0,68,255,0.8)] hover:scale-110 transition-all duration-300 flex items-center justify-center"
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window — PS5 Shell */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden shadow-[0_0_60px_rgba(0,68,255,0.3)] animate-fade-in-up flex flex-col"
          style={{
            height: "520px",
            borderRadius: "var(--ps5-radius)",
            background: "var(--ps5-glass)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-700 to-cyan-500 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-black text-sm tracking-wider">STUNET BOT</h3>
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">System Online</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-white/50 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: "rgba(0, 2, 10, 0.9)" }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-[20px] rounded-br-md"
                        : "bg-white/5 border border-white/10 text-white/90 rounded-[20px] rounded-bl-md"
                    }`}
                  >
                    {msg.text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={i} className="font-bold text-cyan-400">{part.slice(2, -2)}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                </div>

                {/* Quick option buttons */}
                {msg.sender === "bot" && msg.options && msg.id === messages[messages.length - 1].id && (
                  <div className="flex flex-wrap gap-2 mt-3 pl-1">
                    {msg.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSend(opt)}
                        className="text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border border-blue-500/30 text-cyan-400 bg-blue-600/10 hover:bg-blue-600/25 hover:border-cyan-400/50 transition-all duration-200"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-[20px] rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/5 shrink-0" style={{ background: "rgba(0, 2, 10, 0.95)" }}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="ps5-input flex-1 !rounded-full !py-2.5 !px-4 text-sm"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-cyan-500 hover:shadow-[0_0_15px_rgba(0,210,255,0.5)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
