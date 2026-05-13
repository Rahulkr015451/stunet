"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    getCurrentUser().then(setUser);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
        }
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setJobsLoading(false));
  }, []);

  const scrollToListings = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("listings");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const types = ["All", ...Array.from(new Set(jobs.map((j) => j.type)))];

  const filteredJobs = jobs.filter((j) => {
    const matchType = filter === "All" || j.type === filter;
    const matchLoc = !locationFilter || j.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchType && matchLoc;
  }).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative h-[90vh] flex items-center justify-center px-8 overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-600/10 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 text-center boot-up">
          {/* System Version Badge */}
          <div className="flex justify-center mb-12">
            <div className="ps5-shell-sm p-1 bg-white/5 border-white/20">
              <span className="px-6 py-2 block bg-blue-600/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                {user?.role === "employer" ? "Employer Suite" : "Career Launchpad"}
              </span>
            </div>
          </div>

          {user?.role === "employer" ? (
            <>
              <h1 className="text-5xl md:text-[80px] font-black leading-none tracking-tighter mb-8">
                STU<span className="text-blue-500">NET</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-40 max-w-2xl mx-auto font-medium mb-4">
                Discover Brilliance. Hire Top Talent.
              </p>
              <p className="text-base opacity-25 max-w-xl mx-auto mb-12">
                STUNET streamlines your hiring process. Access a curated pool of verified talent and build your next innovative team.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-[90px] font-black leading-none tracking-tighter mb-8">
                STU<span className="text-blue-500">NET</span>
              </h1>
              <p className="text-xl md:text-2xl opacity-40 max-w-2xl mx-auto font-medium mb-12">
                Experience the next generation of talent acquisition and career progression.
              </p>
            </>
          )}

          {!user && (
            <div className="flex gap-6 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link href="/login" className="ps5-btn glow-hover">
                Launch Career
              </Link>
              <button
                onClick={scrollToListings}
                className="ps5-shell-sm px-10 py-4 font-black text-xs uppercase tracking-widest border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                Browse Jobs
              </button>
            </div>
          )}

          {user && (
            <div className="flex gap-6 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Link
                href={user.role === "employer" ? "/employer/dashboard" : "/dashboard"}
                className="ps5-btn glow-hover"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={scrollToListings}
                className="ps5-shell-sm px-10 py-4 font-black text-xs uppercase tracking-widest border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
              >
                Browse Jobs
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ ACTIVITY CENTER / LISTINGS ═══════ */}
      {user?.role !== "employer" && (
        <section id="listings" className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Latest <span className="text-blue-500">Opportunities</span>
            </h2>
            <Link
              href="/jobs"
              className="group text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2"
            >
              View all
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Filters */}
          {!jobsLoading && jobs.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="flex-1 relative max-w-md">
                <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="ps5-input !pl-12"
                />
              </div>

              <div className="flex gap-2 flex-wrap items-center">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilter(t)}
                    className={`px-4 py-3 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${filter === t
                        ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(0,68,255,0.5)]"
                        : "bg-white/5 text-white/30 hover:text-white/60 hover:bg-white/10 border border-white/5"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Featured Job Card */}
          {!jobsLoading && filteredJobs.length > 0 && (
            <div className="mb-10">
              <Link href={`/jobs/${filteredJobs[0].id}`} className="block">
                <div className="ps5-shell p-10 md:p-12 relative overflow-hidden group glow-hover min-h-[350px] flex flex-col justify-between cursor-pointer">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/30 to-transparent -skew-x-12 transform translate-x-20" />
                  <div className="relative z-10">
                    <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                      Featured Position
                    </span>
                    <h3 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                      {filteredJobs[0].title}
                    </h3>
                    <p className="text-lg opacity-40 max-w-md mb-8">
                      {filteredJobs[0].company} · {filteredJobs[0].location}
                    </p>
                    <div className="flex gap-4">
                      <span className="ps5-btn px-10">Apply Now</span>
                      <span className="w-14 h-14 ps5-shell-sm flex items-center justify-center text-xl hover:bg-white/10 transition-colors">△</span>
                    </div>
                  </div>

                  {/* Background deco */}
                  <div className="absolute bottom-8 right-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg width="180" height="180" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobsLoading ? (
              <div className="col-span-1 md:col-span-3 text-center py-12 opacity-30">
                <span className="animate-pulse text-sm font-bold uppercase tracking-widest">Loading opportunities...</span>
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, i) => (
                <div key={job.id} className={`animate-fade-in-up stagger-${i + 1}`}>
                  <ListingCard
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    type={job.type}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-3 text-center py-12">
                <div className="ps5-shell p-12 flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 opacity-20 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-xl font-black mb-2">No opportunities available</h3>
                  <p className="opacity-30 max-w-md text-sm">Check back soon! Employers are continually adding new roles to our platform.</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════ CTA SECTION (guests only) ═══════ */}
      {!user && (
        <section className="py-32 bg-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500" />
          <div className="max-w-[1600px] mx-auto px-6 md:px-12 text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter italic text-white">
              READY TO JOIN?
            </h2>
            <div className="flex justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 px-14 py-5 rounded-full font-black text-lg uppercase tracking-widest glow-hover hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300"
              >
                Join the Fleet
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

/* ────── Listing Card ────── */

function ListingCard({
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
    <Link href={`/jobs/${id}`} className="block h-full">
      <div className="ps5-shell-sm p-8 group cursor-pointer relative overflow-hidden flex flex-col h-full hover:bg-white/5 glow-hover border-white/5">
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-cyan-400">{type}</span>
        </div>
        <h4 className="text-2xl font-black mb-1 group-hover:text-cyan-400 transition-colors duration-300">{title}</h4>
        <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">{company}</p>
        <div className="mt-auto flex gap-2">
          <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold uppercase opacity-40">
            {location}
          </span>
        </div>
      </div>
    </Link>
  );
}