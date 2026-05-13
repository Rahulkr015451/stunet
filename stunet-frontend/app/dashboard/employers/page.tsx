"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getEmployers, followEmployer, unfollowEmployer, getFollowStatus } from "@/lib/follow";

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
}

export default function EmployersPage() {
  const router = useRouter();
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [togglingFollow, setTogglingFollow] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const data = await getEmployers();
        setEmployers(data);

        // Fetch follow status for each employer
        const states: Record<string, boolean> = {};
        await Promise.all(
          data.map(async (emp: Employer) => {
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
        console.error("Error loading employers:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

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
      } else {
        await followEmployer(employerId);
        setFollowStates((prev) => ({ ...prev, [employerId]: true }));
        setEmployers((prev) =>
          prev.map((e) =>
            e.id === employerId ? { ...e, followerCount: e.followerCount + 1 } : e
          )
        );
      }
    } catch (err) {
      console.error("Toggle follow error:", err);
    } finally {
      setTogglingFollow((prev) => ({ ...prev, [employerId]: false }));
    }
  }

  const filtered = employers.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      (e.name ?? "").toLowerCase().includes(q) ||
      (e.company ?? "").toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse">
          <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" />
          Discovering employers...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Discover <span className="primary-gradient-text text-glow">Employers</span>
          </h2>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Browse top companies hiring on Stunet. Follow them to stay updated with their latest job postings.
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search employers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Employers Grid */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">
            {searchQuery ? "No employers match your search" : "No employers available yet"}
          </h3>
          <p className="text-slate-500 max-w-lg">
            {searchQuery ? "Try adjusting your search query." : "Employers will appear here once they join the platform."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((emp, i) => (
            <div key={emp.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
              <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-brand-primary/50 flex flex-col h-full">
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-bl-full transition-colors duration-500 group-hover:bg-brand-primary/20 pointer-events-none" />

                {/* Avatar & Info */}
                <div className="flex items-start gap-4 mb-5 relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {emp.image ? (
                      <img src={emp.image} alt={emp.name || "Employer"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <svg className="w-7 h-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-accent transition-colors">
                      {emp.company || emp.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {emp.name || emp.email}
                    </p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <svg className="w-3.5 h-3.5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {emp.activeJobs} active job{emp.activeJobs !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <svg className="w-3.5 h-3.5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {emp.followerCount} follower{emp.followerCount !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-3">
                  <Link
                    href={`/dashboard/employers/${emp.id}`}
                    className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors inline-flex items-center gap-1"
                  >
                    View Profile
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFollow(emp.id);
                    }}
                    disabled={togglingFollow[emp.id]}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      followStates[emp.id]
                        ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                        : "bg-brand-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:bg-brand-accent"
                    } ${togglingFollow[emp.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {togglingFollow[emp.id] ? (
                      <div className="w-3 h-3 rounded-full border-t-2 border-current animate-spin" />
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
  );
}
