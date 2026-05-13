"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser } from "@/lib/auth";
import {
  getEmployers,
  followEmployer,
  unfollowEmployer,
  getFollowStatus,
  getFollowing,
  getFollowFeed,
} from "@/lib/follow";

interface Employer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  company: string | null;
  totalJobs: number;
  activeJobs: number;
  followerCount: number;
  joinedAt: string;
  locations?: string[];
}

interface FeedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  type: string;
  createdAt: string;
  employer: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface FollowedEmployer {
  id: string;
  name: string | null;
  company: string | null;
  image: string | null;
  activeJobs: number;
  followerCount: number;
}

export default function NetworkPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [followedEmployers, setFollowedEmployers] = useState<FollowedEmployer[]>([]);
  const [feed, setFeed] = useState<FeedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [togglingFollow, setTogglingFollow] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [employerLocFilter, setEmployerLocFilter] = useState("");
  const [feedLocFilter, setFeedLocFilter] = useState("");
  const [activeTab, setActiveTab] = useState<"discover" | "following" | "feed">("discover");

  useEffect(() => {
    async function load() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      if (currentUser.role !== "student") {
        setLoading(false);
        return;
      }

      try {
        const [employersData, followingData, feedData] = await Promise.all([
          getEmployers(),
          getFollowing().catch(() => []),
          getFollowFeed().catch(() => []),
        ]);

        setEmployers(employersData);
        setFollowedEmployers(followingData);
        setFeed(feedData);

        // Build follow states map
        const states: Record<string, boolean> = {};
        await Promise.all(
          employersData.map(async (emp: Employer) => {
            try {
              const status = await getFollowStatus(emp.id);
              states[emp.id] = status.following;
            } catch {
              states[emp.id] = false;
            }
          })
        );
        setFollowStates(states);
      } catch (err) {
        console.error("Error loading network:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function toggleFollow(employerId: string) {
    setTogglingFollow((prev) => ({ ...prev, [employerId]: true }));

    try {
      if (followStates[employerId]) {
        await unfollowEmployer(employerId);
        setFollowStates((prev) => ({ ...prev, [employerId]: false }));
        setEmployers((prev) =>
          prev.map((e) =>
            e.id === employerId ? { ...e, followerCount: Math.max(0, e.followerCount - 1) } : e
          )
        );
        setFollowedEmployers((prev) => prev.filter((e) => e.id !== employerId));
        setFeed((prev) => prev.filter((j) => j.employer.id !== employerId));
      } else {
        await followEmployer(employerId);
        setFollowStates((prev) => ({ ...prev, [employerId]: true }));
        setEmployers((prev) =>
          prev.map((e) =>
            e.id === employerId ? { ...e, followerCount: e.followerCount + 1 } : e
          )
        );
        // Refresh following and feed
        const [followingData, feedData] = await Promise.all([
          getFollowing().catch(() => followedEmployers),
          getFollowFeed().catch(() => feed),
        ]);
        setFollowedEmployers(followingData);
        setFeed(feedData);
      }
    } catch (err) {
      console.error("Toggle follow error:", err);
    } finally {
      setTogglingFollow((prev) => ({ ...prev, [employerId]: false }));
    }
  }

  async function handleUnfollow(employerId: string) {
    try {
      await unfollowEmployer(employerId);
      setFollowStates((prev) => ({ ...prev, [employerId]: false }));
      setFollowedEmployers((prev) => prev.filter((e) => e.id !== employerId));
      setFeed((prev) => prev.filter((j) => j.employer.id !== employerId));
      setEmployers((prev) =>
        prev.map((e) =>
          e.id === employerId ? { ...e, followerCount: Math.max(0, e.followerCount - 1) } : e
        )
      );
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  }

  const filteredEmployers = employers.filter((e) => {
    const q = searchQuery.toLowerCase();
    const loc = employerLocFilter.toLowerCase();
    
    const matchesName = (e.name ?? "").toLowerCase().includes(q) ||
      (e.company ?? "").toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q);
      
    const matchesLoc = !loc || (e.locations && e.locations.some(l => l.toLowerCase().includes(loc)));
    
    return matchesName && matchesLoc;
  });

  const filteredFeed = feed.filter((j) => {
    if (!feedLocFilter) return true;
    return j.location.toLowerCase().includes(feedLocFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      <div className="px-6 md:px-12 pt-36 pb-24 max-w-[1600px] mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12 relative boot-up">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px]" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 relative z-10">
            Your <span className="text-blue-500">Network</span>
          </h1>
          <p className="text-base opacity-30 max-w-xl mx-auto relative z-10 font-medium">
            Connect with top employers, follow companies that inspire you, and stay updated with their latest opportunities.
          </p>
        </div>

        {/* Login prompt for unauthenticated users */}
        {!loading && !user && (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-fade-in-up max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">Sign in to build your network</h3>
            <p className="text-slate-500 max-w-md mb-6">
              Log in as a student to follow employers, discover companies, and get a personalized job feed.
            </p>
            <div className="flex gap-4">
              <Link href="/login" className="secondary-button">Login</Link>
              <Link href="/register" className="primary-button">Register</Link>
            </div>
          </div>
        )}

        {/* Non-student role message */}
        {!loading && user && user.role !== "student" && (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-fade-in-up max-w-xl mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">Network is for students</h3>
            <p className="text-slate-500 max-w-md">
              The Network feature is designed for students to follow employers and discover opportunities. As an employer, students can find and follow you!
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4 opacity-30 animate-pulse">
              <div className="w-8 h-8 rounded-full border-t-2 border-cyan-400 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Building your network...</span>
            </div>
          </div>
        )}

        {/* Main content for students */}
        {!loading && user?.role === "student" && (
          <>
            {/* Tab Navigation */}
            <div className="flex justify-center mb-10 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="flex gap-1 p-1.5 bg-white/5 rounded-full border border-white/5">
                <button
                  onClick={() => setActiveTab("discover")}
                  className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "discover"
                      ? "bg-blue-600/20 text-cyan-400 shadow-[0_0_15px_rgba(0,68,255,0.2)]"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Discover ({employers.length})
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                    activeTab === "following"
                      ? "bg-blue-600/20 text-cyan-400 shadow-[0_0_15px_rgba(0,68,255,0.2)]"
                      : "text-white/30 hover:text-white/60"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Following ({followedEmployers.length})
                </button>
              </div>
            </div>

            {/* ═══════════ DISCOVER TAB ═══════════ */}
            {activeTab === "discover" && (
              <div className="animate-fade-in">
                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-10 flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search companies, employers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="ps5-input !pl-12"
                    />
                  </div>
                  
                  <div className="relative flex-1">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Filter by location (e.g., Remote, NY)"
                      value={employerLocFilter}
                      onChange={(e) => setEmployerLocFilter(e.target.value)}
                      className="ps5-input !pl-12"
                    />
                  </div>
                </div>

                {filteredEmployers.length === 0 ? (
                  <div className="glass-card p-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                    <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">
                      {searchQuery ? "No employers match your search" : "No employers yet"}
                    </h3>
                    <p className="text-slate-500">
                      {searchQuery ? "Try adjusting your search query." : "Employers will appear here once they join the platform."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEmployers.map((emp, i) => (
                      <div key={emp.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                        <div className="glass-card p-7 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-brand-primary/50 flex flex-col h-full">
                          {/* Decorative corner */}
                          <div className="absolute top-0 right-0 w-28 h-28 bg-brand-primary/10 rounded-bl-full transition-colors duration-500 group-hover:bg-brand-primary/20 pointer-events-none" />

                          {/* Avatar & Info */}
                          <div className="flex items-start gap-4 mb-5 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                              {emp.image ? (
                                <img src={emp.image} alt={emp.name || "Employer"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-2xl font-black text-brand-primary">
                                  {(emp.company || emp.name || "?").charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-accent transition-colors">
                                {emp.company || emp.name || "Unknown"}
                              </h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                {emp.name && emp.company ? emp.name : emp.email}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-5 mb-6">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                              <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {emp.activeJobs} job{emp.activeJobs !== 1 ? "s" : ""}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                              </svg>
                              {emp.followerCount} follower{emp.followerCount !== 1 ? "s" : ""}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-auto pt-5 border-t border-slate-200 dark:border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-3">
                            <Link
                              href={`/dashboard/employers/${emp.id}`}
                              className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors inline-flex items-center gap-1.5"
                            >
                              View Profile
                              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>

                            <button
                              onClick={() => toggleFollow(emp.id)}
                              disabled={togglingFollow[emp.id]}
                              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                                followStates[emp.id]
                                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                                  : "bg-brand-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:bg-brand-accent"
                              } ${togglingFollow[emp.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {togglingFollow[emp.id] ? (
                                <div className="w-3.5 h-3.5 rounded-full border-t-2 border-current animate-spin" />
                              ) : followStates[emp.id] ? (
                                <>
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Following
                                </>
                              ) : (
                                <>
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  Follow
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══════════ FOLLOWING TAB ═══════════ */}
            {activeTab === "following" && (
              <div className="animate-fade-in">
                {followedEmployers.length === 0 ? (
                  <div className="glass-card p-12 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                    <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">Not following anyone yet</h3>
                    <p className="text-slate-500 max-w-md mb-6">
                      Start following employers from the Discover tab to keep track of their job postings.
                    </p>
                    <button onClick={() => setActiveTab("discover")} className="primary-button">
                      Discover Employers
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {followedEmployers.map((emp, i) => (
                      <div key={emp.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                        <div className="glass-card p-7 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-brand-primary/50 flex flex-col h-full">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-bl-full transition-colors duration-500 group-hover:bg-brand-primary/20 pointer-events-none" />

                          <div className="flex items-start gap-4 mb-4 relative z-10">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                              {emp.image ? (
                                <img src={emp.image} alt={emp.name || "Employer"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <span className="text-xl font-black text-brand-primary">
                                  {(emp.company || emp.name || "?").charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-accent transition-colors">
                                {emp.company || emp.name || "Unknown"}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {emp.activeJobs} active job{emp.activeJobs !== 1 ? "s" : ""} · {emp.followerCount} follower{emp.followerCount !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-3">
                            <Link href={`/dashboard/employers/${emp.id}`} className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors inline-flex items-center gap-1">
                              View Profile
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleUnfollow(emp.id)}
                              className="px-4 py-2 rounded-full text-xs font-bold text-red-400 border border-red-400/30 bg-red-500/10 hover:bg-red-500/20 transition-all duration-300 flex items-center gap-1.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Unfollow
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* END FOLLOWING TAB */}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}
