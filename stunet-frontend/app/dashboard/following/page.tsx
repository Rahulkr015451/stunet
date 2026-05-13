"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getFollowing, unfollowEmployer } from "@/lib/follow";

interface FollowedEmployer {
  id: string;
  name: string | null;
  company: string | null;
  image: string | null;
  activeJobs: number;
  followerCount: number;
}

export default function FollowingPage() {
  const router = useRouter();
  const [followedEmployers, setFollowedEmployers] = useState<FollowedEmployer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const followingData = await getFollowing();
        setFollowedEmployers(followingData);
      } catch (err) {
        console.error("Error loading following:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function handleUnfollow(employerId: string) {
    try {
      await unfollowEmployer(employerId);
      setFollowedEmployers((prev) => prev.filter((e) => e.id !== employerId));
    } catch (err) {
      console.error("Unfollow error:", err);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse">
          <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          People You <span className="primary-gradient-text text-glow">Follow</span>
        </h2>
        <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
          Employers and companies you're following. Stay connected and discover new opportunities.
        </p>
      </div>

      {/* Following List */}
      {followedEmployers.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">Not following anyone yet</h3>
          <p className="text-slate-500 max-w-lg mb-6">
            Start following employers to keep track of them and their opportunities.
          </p>
          <Link href="/network" className="primary-button">
            Discover Employers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {followedEmployers.map((emp, i) => (
            <div key={emp.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
              <div className="glass-card p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-brand-primary/50 flex flex-col h-full">
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/10 rounded-bl-full transition-colors duration-500 group-hover:bg-brand-primary/20 pointer-events-none" />

                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {emp.image ? (
                      <img src={emp.image} alt={emp.name || "Employer"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
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
  );
}
