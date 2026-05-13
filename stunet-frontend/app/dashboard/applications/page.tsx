"use client";

import { useEffect, useState } from "react";
import { getStudentApplications } from "@/lib/applications";

export default function StudentApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyApplications();
    }, []);

    const loadMyApplications = async () => {
        try {
            setLoading(true);
            const data = await getStudentApplications();
            setApplications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl">
            <div className="mb-8 border-b border-[rgba(255,255,255,0.05)] pb-6">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Application <span className="text-brand-accent">Standing</span>
                </h2>
                <p className="mt-1 text-slate-500 dark:text-slate-400">Track and assess the opportunities you have applied for, and view real-time feedback from Employers.</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500 animate-pulse">
                    <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin mx-auto mb-4"></div>
                    Checking your queue...
                </div>
            ) : applications.length === 0 ? (
                <div className="glass-card p-12 text-center flex flex-col items-center">
                    <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">Queue Empty</h3>
                    <p className="text-slate-500">You haven't applied to any jobs yet. Head over to the Jobs directory to find your next break.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications.map(app => (
                        <div key={app.id} className="glass-card p-6 flex flex-col justify-between h-full group hover:border-brand-primary/30 transition-colors relative overflow-hidden">

                            {/* Background Success Splash */}
                            {app.status === "APPROVED" && (
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.1),transparent_70%)] pointer-events-none" />
                            )}

                            <div className="mb-8 relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{app.job.title}</h3>
                                    {app.status === "APPROVED" ? (
                                        <div className="px-3 py-1 bg-green-500 text-slate-900 dark:text-white font-black uppercase text-[10px] tracking-widest rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] shrink-0 animate-pulse">
                                            SELECTED!
                                        </div>
                                    ) : app.status === "REJECTED" ? (
                                        <div className="px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 font-black uppercase text-[10px] tracking-widest rounded shrink-0">
                                            NOT CHOSEN
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 font-bold uppercase text-[10px] tracking-widest rounded shrink-0">
                                            IN REVIEW
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                        {app.job.company}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {app.job.location}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between mt-auto relative z-10">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{app.job.type}</span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Applied {new Date(app.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
