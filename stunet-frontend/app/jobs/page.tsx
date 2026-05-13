"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const types = ["All", ...Array.from(new Set(jobs.map((j) => j.type)))];

  const filtered = jobs.filter((j) => {
    const matchType = filter === "All" || j.type === filter;
    const matchLoc = !locationFilter || j.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchQ = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchLoc && matchQ;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="px-6 md:px-12 pt-36 pb-24 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16 relative boot-up">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 relative z-10">
            All <span className="text-blue-500">Opportunities</span>
          </h1>
          <p className="text-base opacity-30 max-w-xl mx-auto relative z-10 font-medium">
            Explore all open positions approved by STUNET. Find the role that aligns perfectly with your next career move.
          </p>
        </div>

        {/* Filter bar */}
        {!loading && jobs.length > 0 && (
          <div className="flex flex-col gap-6 mb-16 animate-fade-in-up" style={{ animationDelay: "100ms" }}>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto w-full">
              <div className="flex-1 relative">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Job title, company, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps5-input !pl-12"
                />
              </div>

              <div className="flex-1 relative">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="City, state, or 'Remote'"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="ps5-input !pl-12"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    filter === t
                      ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(0,68,255,0.5)]"
                      : "bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {loading ? (
            <div className="col-span-1 md:col-span-3 text-center py-20">
              <span className="animate-pulse text-[10px] font-black uppercase tracking-widest opacity-30">Loading opportunities...</span>
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((job, i) => (
              <div key={job.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                <JobCard
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  location={job.location}
                  type={job.type}
                />
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-20">
              <div className="ps5-shell p-12 flex flex-col items-center justify-center max-w-lg mx-auto">
                <svg className="w-16 h-16 opacity-15 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13H3M4 13V15A2 2 0 006 17H18A2 2 0 0020 15V13M12 9V13M12 9V5M12 9H16M12 9H8" />
                </svg>
                <h3 className="text-xl font-black mb-2">No opportunities available</h3>
                <p className="text-sm opacity-25 max-w-md">We are currently working with top partners to bring you the best roles. Stay tuned!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function JobCard({
  id,
  title,
  company,
  location,
  type,
}: {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
}) {
  return (
    <Link href={`/jobs/${id}`} className="block h-full group">
      <div className="ps5-shell-sm p-8 cursor-pointer relative overflow-hidden flex flex-col h-full hover:bg-white/5 glow-hover border-white/5">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-bl-[40px] transition-colors duration-500 group-hover:bg-blue-600/20 pointer-events-none" />

        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-cyan-400">
            {type}
          </span>
        </div>

        <h3 className="text-2xl font-black mb-1 group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">{company}</p>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold opacity-30">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0 transform inline-flex items-center gap-1">
            View <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
