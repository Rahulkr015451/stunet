"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../../components/Logo";
import { getCurrentUser } from "@/lib/auth";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumeData, setResumeData] = useState<string>("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/${id}/applied`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setApplied(data.applied))
      .catch(() => setApplied(false));
  }, [id]);

  async function apply() {
    setApplyLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs/${id}/apply`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
        credentials: "include",
      }
    );

    if (res.ok) {
      setApplied(true);
    } else if (res.status === 401 || res.status === 403) {
      // Not logged in or not a student
      const data = await res.json();
      alert(data.message || "You must be logged in as a student to apply.");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.message || "Failed to apply");
    }
    setApplyLoading(false);
    setShowApplyModal(false);
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = async () => {
      setResumeLoading(true);
      try {
        const base64String = reader.result as string;
        setResumeData(base64String);
      } catch (err) {
        console.error("Failed to read resume", err);
      } finally {
        setResumeLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-t-2 border-brand-primary animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading opportunity details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 flex flex-col">
        <header className="w-full z-50 glass-card !rounded-none !border-x-0 !border-t-0 !border-b-[rgba(255,255,255,0.05)] px-6 md:px-12 py-4 flex items-center justify-between">
          <Logo />
          <Link href="/jobs" className="secondary-button text-xs py-1.5 px-4">
            Back to Jobs
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-12 text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Required</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">You need to be logged in to view opportunity details and submit applications.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/login" className="primary-button inline-flex">Login</Link>
              <Link href="/register" className="secondary-button inline-flex">Register</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 flex flex-col">
        <header className="w-full z-50 glass-card !rounded-none !border-x-0 !border-t-0 !border-b-[rgba(255,255,255,0.05)] px-6 md:px-12 py-4 flex items-center justify-between">
          <Logo />
          <Link href="/jobs" className="secondary-button text-xs py-1.5 px-4">
            Back to Jobs
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="glass-card p-12 text-center max-w-md">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Opportunity Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">This role may have been removed or no longer accepts applications.</p>
            <Link href="/jobs" className="primary-button inline-flex">Explore Other Roles</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 relative">
      <header className="fixed top-0 w-full z-50 glass-card !rounded-none !border-x-0 !border-t-0 !border-b-[rgba(255,255,255,0.05)] px-6 md:px-12 py-4 flex items-center justify-between">
        <Logo />
        <Link href="/jobs" className="secondary-button text-xs py-1.5 px-4">
          Back to Jobs
        </Link>
      </header>

      {/* Hero Header */}
      <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-primary/10 rounded-[100%] blur-[120px]"></div>
      </div>

      <div className="relative z-10 pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-bold text-brand-primary">
              {job.type}
            </span>
            <span className="text-sm font-semibold text-slate-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">{job.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-300 font-medium text-lg">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {job.company}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
          </div>
        </div>

        <div className="glass-card p-10 mb-12">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-1 bg-brand-primary rounded-full"></div>
            Opportunity Overview
          </h2>
          <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:leading-relaxed whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t-[3px] border-t-brand-primary">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Ready to start your journey?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Join {job.company} and make an impact today.</p>
          </div>

          <div className="w-full md:w-auto">
            {applied ? (
              <button
                disabled
                className="w-full md:w-auto px-8 py-4 rounded-lg bg-green-500/10 text-green-400 font-bold border border-green-500/20 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Application Submitted
              </button>
            ) : (
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full md:w-auto primary-button shadow-brand flex items-center justify-center gap-2"
              >
                Apply Now
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}
          </div>
        </div>

      </div>

      {showApplyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-[rgba(255,255,255,0.1)] rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Complete Application</h3>
            <p className="text-sm text-slate-500 mb-6">You are applying for the <strong className="text-brand-primary">{job.title}</strong> role at {job.company}.</p>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Provide a Specific Resume (Optional)
              </label>
              <p className="text-xs text-slate-500 mb-3">If you leave this empty, your default profile resume will be used.</p>
              
              <div className={`p-4 border-2 border-dashed rounded-xl transition-colors ${resumeData ? "border-brand-primary bg-brand-primary/5" : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50"}`}>
                <div className="flex flex-col items-center justify-center gap-2">
                  {resumeLoading ? (
                    <div className="w-6 h-6 rounded-full border-2 border-brand-primary border-t-transparent animate-spin my-2" />
                  ) : (
                    <>
                      <svg className={`w-8 h-8 ${resumeData ? "text-brand-primary" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {resumeData ? (
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Resume Attached!</p>
                      ) : (
                        <p className="text-sm text-slate-500 font-medium">Click to attach a targeted PDF</p>
                      )}
                      <label className="mt-2 secondary-button text-xs py-1.5 px-4 cursor-pointer">
                        Choose File
                        <input type="file" className="hidden" accept=".pdf" onChange={handleResumeUpload} disabled={resumeLoading} />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowApplyModal(false)}
                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={apply}
                disabled={applyLoading}
                className="flex-1 primary-button text-center flex justify-center disabled:opacity-50"
              >
                {applyLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}