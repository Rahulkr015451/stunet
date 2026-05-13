"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EmployerNetwork() {
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadFollowers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/follow/followers`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFollowers(data);
        }
      } catch (err) {
        console.error("Failed to load followers", err);
      } finally {
        setLoading(false);
      }
    }
    loadFollowers();
  }, []);

  const filteredFollowers = followers.filter(f => 
    (f.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (f.college || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030308] text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Navbar />

      <div className="px-6 md:px-12 pt-32 pb-20 max-w-7xl mx-auto relative z-10">
        <div className="mb-12 animate-fade-in flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="w-12 h-1 bg-brand-primary mb-6 rounded-full" />
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              My <span className="text-brand-accent">Network</span>
            </h1>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
              Students and talent who are following your company.
            </p>
          </div>
          <Link href="/employer/dashboard" className="secondary-button text-sm px-5 py-2.5 whitespace-nowrap">
            Back to Dashboard
          </Link>
        </div>

        <div className="max-w-md mb-10 animate-fade-in-up">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search talent by name, college, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-sm focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/40 transition-all shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-pulse">
            <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin mb-4" />
            Loading followers...
          </div>
        ) : filteredFollowers.length === 0 ? (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {searchQuery ? "No matching talent found" : "Your network is growing!"}
            </h3>
            <p className="text-slate-500 max-w-md">
              {searchQuery 
                ? "Try adjusting your search filters to find what you're looking for."
                : "When students follow your company profile, they will appear here. Build your pipeline for future opportunities!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFollowers.map((f, i) => (
              <div key={f.id} className={`glass-card p-6 flex items-start gap-4 animate-fade-in-up stagger-${Math.min(i + 1, 6)} group relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full pointer-events-none transition-colors duration-500 group-hover:bg-brand-primary/10" />
                
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-[rgba(255,255,255,0.1)] bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-sm relative z-10">
                  {f.image ? (
                    <img src={f.image} alt={f.name || "Student"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-brand-primary">
                      {(f.name || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="min-w-0 pr-4 relative z-10">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-accent transition-colors">
                    {f.name || "Anonymous Member"}
                  </h3>
                  
                  {f.college ? (
                    <p className="text-sm font-semibold text-brand-primary mt-1 line-clamp-1">{f.college}</p>
                  ) : (
                    <p className="text-sm font-medium text-slate-400 mt-1 italic">No college listed</p>
                  )}
                  
                  <a 
                    href={`mailto:${f.email}`}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mt-2 block w-max transition-colors flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Contact Talent
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
