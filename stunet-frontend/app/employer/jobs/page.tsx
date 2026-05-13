"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employer/jobs`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setJobs(data);
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030308] text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="px-6 md:px-12 pt-32 pb-20 max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-[rgba(255,255,255,0.05)] pb-6 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              My <span className="text-brand-accent">Job Listings</span>
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Track the statuses of the opportunities you have posted to the STUNET network.
            </p>
          </div>
          <Link href="/employer/jobs/new" className="primary-button text-sm py-2 px-6 whitespace-nowrap shadow-brand flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post New Opportunity
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 animate-pulse">
              <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin mx-auto mb-4"></div>
              Loading your listings...
            </div>
          ) : jobs.length === 0 ? (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">No active listings</h3>
              <p className="text-slate-500 max-w-sm">You haven't posted any jobs or internships yet. Click the button above to get started.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div
                key={job.id}
                className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-brand-primary/30 transition-colors"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-accent transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 mr-4">
                    <div className="bg-white/50 dark:bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-2 flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Applicants</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">{job._count?.applications || 0}</span>
                    </div>
                    {job.status === "APPROVED" ? (
                      <span className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-bold text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                        ACTIVE
                      </span>
                    ) : job.status === "PENDING" ? (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-bold text-yellow-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                        IN REVIEW
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold text-red-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        {job.status}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/employer/jobs/${job.id}/applicants`}
                    className="primary-button text-xs py-2 px-5 shadow-brand whitespace-nowrap"
                  >
                    View Candidates →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
