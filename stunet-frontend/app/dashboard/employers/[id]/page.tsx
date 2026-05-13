"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getEmployerProfile, followEmployer, unfollowEmployer, getFollowStatus } from "@/lib/follow";
import { getOrCreateConversation } from "@/lib/chat";

interface EmployerProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  company: string | null;
  totalJobs: number;
  activeJobs: number;
  followerCount: number;
  joinedAt: string;
  jobs: {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    type: string;
    createdAt: string;
  }[];
}

export default function EmployerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const employerId = params.id as string;

  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [togglingFollow, setTogglingFollow] = useState(false);

  useEffect(() => {
    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        router.push("/");
        return;
      }

      try {
        const [profile, status] = await Promise.all([
          getEmployerProfile(employerId),
          getFollowStatus(employerId),
        ]);
        setEmployer(profile);
        setIsFollowing(status.following);
      } catch (err) {
        console.error("Error loading employer profile:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router, employerId]);

  async function toggleFollow() {
    if (!employer) return;
    setTogglingFollow(true);

    try {
      if (isFollowing) {
        await unfollowEmployer(employer.id);
        setIsFollowing(false);
        setEmployer((prev) =>
          prev ? { ...prev, followerCount: Math.max(0, prev.followerCount - 1) } : prev
        );
      } else {
        await followEmployer(employer.id);
        setIsFollowing(true);
        setEmployer((prev) =>
          prev ? { ...prev, followerCount: prev.followerCount + 1 } : prev
        );
      }
    } catch (err) {
      console.error("Toggle follow error:", err);
    } finally {
      setTogglingFollow(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse">
          <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin" />
          Loading employer profile...
        </div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="glass-card p-12 text-center">
        <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">Employer not found</h3>
        <p className="text-slate-500 mb-6">The employer profile you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/dashboard/employers" className="primary-button">
          Back to Employers
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Back link */}
      <Link
        href="/dashboard/employers"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-brand-primary transition-colors mb-8"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Employers
      </Link>

      {/* Profile Header */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-accent/5 rounded-tr-full pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border-2 border-brand-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_30px_rgba(14,165,233,0.15)]">
            {employer.image ? (
              <img src={employer.image} alt={employer.name || "Employer"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {employer.company || employer.name || "Unknown Employer"}
            </h1>
            {employer.name && employer.company && (
              <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">{employer.name}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-5 mt-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-900 dark:text-white font-bold">{employer.activeJobs}</span> active job{employer.activeJobs !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-slate-900 dark:text-white font-bold">{employer.followerCount}</span> follower{employer.followerCount !== 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined {new Date(employer.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Message Button */}
            <button
              onClick={async () => {
                try {
                  const { id } = await getOrCreateConversation(employer.id);
                  router.push(`/chat?conversation=${id}`);
                } catch (err) {
                  console.error("Failed to start conversation", err);
                  alert("Please log in to send a message.");
                }
              }}
              className="px-6 py-3 rounded-full text-sm font-bold bg-slate-100 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 hover:bg-brand-accent/10 hover:text-brand-accent hover:border-brand-accent/30 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </button>

            {/* Follow Button */}
            <button
              onClick={toggleFollow}
              disabled={togglingFollow}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                isFollowing
                  ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/30"
                  : "bg-brand-primary text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] hover:bg-brand-accent"
              } ${togglingFollow ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {togglingFollow ? (
                <div className="w-4 h-4 rounded-full border-t-2 border-current animate-spin" />
              ) : isFollowing ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Following
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Follow
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Open Positions
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {employer.activeJobs > 0
            ? `Showing ${employer.activeJobs} approved job${employer.activeJobs !== 1 ? "s" : ""} from this employer.`
            : "This employer hasn't posted any approved jobs yet."}
        </p>
      </div>

      {employer.jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employer.jobs.map((job, i) => (
            <div key={job.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
              <Link href={`/jobs/${job.id}`} className="block h-full group">
                <div className="glass-card p-6 cursor-pointer relative overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-500 hover:border-brand-primary/50">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary/10 rounded-bl-full transition-colors duration-500 group-hover:bg-brand-primary/20" />

                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-bold text-brand-primary">
                      {job.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-accent transition-colors duration-300">
                    {job.title}
                  </h3>
                  <p className="font-medium text-slate-600 dark:text-slate-300 mb-2 text-sm">{job.company}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{job.description}</p>

                  <div className="mt-auto pt-4 border-t border-slate-200 dark:border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </div>
                    <span className="text-xs font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
                      View Details
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
          <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13H3M4 13V15A2 2 0 006 17H18A2 2 0 0020 15V13M12 9V13M12 9V5M12 9H16M12 9H8" />
          </svg>
          <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">No jobs posted yet</h3>
          <p className="text-slate-500 max-w-lg">Follow this employer to get notified when they post new opportunities.</p>
        </div>
      )}
    </div>
  );
}
