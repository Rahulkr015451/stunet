"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { getEmployerApplications, updateApplicationStatus } from "@/lib/applications";
import { getOrCreateConversation } from "@/lib/chat";
import Navbar from "../../../../components/Navbar";
import Footer from "../../../../components/Footer";

export default function ApplicantsPage() {
    const router = useRouter();
    const params = useParams();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadApplicants();
        }
    }, [params.id]);

    const loadApplicants = async () => {
        setLoading(true);
        try {
            const data = await getEmployerApplications(params.id as string);
            setApplications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (applicationId: string, status: "APPROVED" | "REJECTED") => {
        try {
            await updateApplicationStatus(applicationId, status);
            // Refresh local state manually for fast UI
            setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status } : app));
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const handleViewResume = (resumeUrl: string) => {
        if (resumeUrl.startsWith("data:application/pdf;base64,")) {
            try {
                const base64Data = resumeUrl.split(",")[1];
                const byteCharacters = atob(base64Data);
                const byteArray = new Uint8Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteArray[i] = byteCharacters.charCodeAt(i);
                }
                const blob = new Blob([byteArray], { type: "application/pdf" });
                const blobUrl = URL.createObjectURL(blob);
                window.open(blobUrl, "_blank");
            } catch (e) {
                console.error("Failed to parse base64 resume", e);
                window.open(resumeUrl, "_blank");
            }
        } else {
            window.open(resumeUrl, "_blank");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#030308] text-slate-900 dark:text-slate-100 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="px-6 md:px-12 pt-32 pb-20 max-w-6xl mx-auto relative z-10">
                <div className="mb-12 border-b border-[rgba(255,255,255,0.05)] pb-6 animate-fade-in">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Review <span className="text-brand-accent">Candidates</span>
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Evaluate skill alignments, inspect portfolios, and identify the best fits for your pipeline.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500 animate-pulse">
                        <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin mx-auto mb-4"></div>
                        Loading candidates...
                    </div>
                ) : applications.length === 0 ? (
                    <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">No applicants yet!</h3>
                        <p className="text-slate-500 max-w-sm">When students apply to this opportunity on the STUNET platform, their portfolios will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div key={app.id} className="glass-card p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden group">
                                {app.status === "APPROVED" && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full pointer-events-none" />
                                )}
                                {app.status === "REJECTED" && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full pointer-events-none" />
                                )}

                                {/* Candidate Base Core */}
                                <div className="flex-shrink-0 flex items-start gap-5 min-w-[300px] border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.05)] pb-6 lg:pb-0 lg:pr-8">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[rgba(255,255,255,0.1)] bg-white dark:bg-slate-900 shrink-0">
                                        {app.student.image ? (
                                            <img src={app.student.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <span className="text-2xl font-black text-slate-700">
                                                    {app.student.name ? app.student.name.charAt(0).toUpperCase() : "?"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{app.student.name}</h3>
                                        <p className="text-sm text-brand-primary mt-1">{app.student.profile?.college || "No College Listed"}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{app.student.profile?.degree || "No Degree"} {app.student.profile?.graduationYear ? `(${app.student.profile.graduationYear})` : ""}</p>

                                        <div className="flex gap-3 mt-4 flex-wrap">
                                            <a href={`mailto:${app.student.email}`} className="text-xs font-bold px-3 py-1.5 rounded bg-brand-accent/10 border border-brand-accent/20 text-brand-accent hover:bg-brand-accent hover:text-white transition-colors flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                {app.student.email}
                                            </a>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const { id } = await getOrCreateConversation(app.student.id);
                                                        router.push(`/chat?conversation=${id}`);
                                                    } catch (err) {
                                                        console.error("Failed to start conversation", err);
                                                        alert("Failed to start chat.");
                                                    }
                                                }}
                                                className="text-xs font-bold px-3 py-1.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-1.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Message
                                            </button>
                                            {app.resumeUrl && (
                                                <button onClick={() => handleViewResume(app.resumeUrl)} className="text-xs font-bold px-3 py-1.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                    View Resume (PDF)
                                                </button>
                                            )}
                                            {app.student.profile?.linkedInUrl && (
                                                <a href={app.student.profile.linkedInUrl} target="_blank" className="text-xs font-bold px-3 py-1.5 rounded bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors flex items-center gap-1.5">
                                                    LinkedIn
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats & Skills */}
                                <div className="flex-1">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Portfolio Intel</h4>
                                    {(app.student.skills.length > 0 || app.student.customSkills.length > 0) ? (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {app.student.skills.slice(0, 5).map((ks: any) => (
                                                <span key={ks.id} className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[rgba(255,255,255,0.1)] bg-slate-800/50 text-slate-600 dark:text-slate-300">
                                                    {ks.skill.name} <span className="opacity-50 ml-1">· {ks.level}</span>
                                                </span>
                                            ))}
                                            {app.student.customSkills.slice(0, 5).map((ks: any) => (
                                                <span key={ks.id} className="px-2.5 py-1 text-xs font-semibold rounded-md border border-[rgba(255,255,255,0.1)] bg-slate-800/50 text-slate-600 dark:text-slate-300">
                                                    {ks.name} <span className="opacity-50 ml-1">· {ks.level}</span>
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic mb-4">No skills mapped.</p>
                                    )}

                                    {app.student.projects.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Projects ({app.student.projects.length})</h4>
                                            <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                                                <span className="font-medium text-brand-accent">{app.student.projects[0].title}:</span>
                                                <span className="line-clamp-1">{app.student.projects[0].description}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Frame */}
                                <div className="flex-shrink-0 flex flex-col justify-center gap-3 lg:items-end min-w-[140px]">
                                    {app.status === "APPLIED" ? (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, "APPROVED")}
                                                className="w-full text-center py-2 px-4 rounded-lg bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white border border-green-500/20 font-bold tracking-wide text-sm transition-colors shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                            >
                                                Select
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, "REJECTED")}
                                                className="w-full text-center py-2 px-4 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold tracking-wide text-sm transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    ) : app.status === "APPROVED" ? (
                                        <div className="text-center w-full px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-black tracking-widest text-sm flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            SELECTED
                                        </div>
                                    ) : (
                                        <div className="text-center w-full px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-black tracking-widest text-sm flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            REJECTED
                                        </div>
                                    )}
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
