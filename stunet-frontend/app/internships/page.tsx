"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function InternshipsPage() {
    const [internships, setInternships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    setInternships(data.filter((job) => job.type === "Internship"));
                }
            })
            .catch((err) => console.error("Error fetching internships:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30">
            <Navbar />

            <div className="px-6 md:px-12 pt-32 pb-20 max-w-7xl mx-auto">
                <div className="text-center mb-16 relative animate-fade-in">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px]" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 relative z-10">
                        Exclusive <span className="primary-gradient-text text-glow">Internships</span>
                    </h1>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto relative z-10">
                        Kickstart your career by connecting with top-tier companies. Showcase your skills and secure your dream internship.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {loading ? (
                        <div className="col-span-1 md:col-span-3 text-center py-16 text-slate-500 dark:text-slate-400">
                            <span className="animate-pulse text-lg">Loading internships...</span>
                        </div>
                    ) : internships.length > 0 ? (
                        internships.map((internship, i) => (
                            <div key={internship.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                                <InternshipCard
                                    title={internship.title}
                                    company={internship.company}
                                    location={internship.location}
                                    duration="TBD"
                                    stipend="TBD"
                                    tags={[internship.type]}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-1 md:col-span-3 text-center py-16">
                            <div className="glass-card p-12 flex flex-col items-center justify-center">
                                <svg className="w-16 h-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-slate-600 dark:text-slate-300 mb-2">No internships available right now.</h3>
                                <p className="text-slate-500 max-w-lg">
                                    Employers are constantly adding new opportunities. Keep a close eye on this page and your dashboard!
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

function InternshipCard({
    title,
    company,
    location,
    duration,
    stipend,
    tags,
}: {
    title: string;
    company: string;
    location: string;
    duration: string;
    stipend: string;
    tags: string[];
}) {
    return (
        <div className="glass-card p-8 group cursor-pointer relative overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-500 hover:border-brand-primary/50">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 rounded-bl-full transition-colors duration-500 group-hover:bg-brand-primary/20" />

            <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-bold text-brand-primary">
                    {duration}
                </span>
                <span className="text-sm font-bold text-brand-accent">{stipend}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-brand-accent transition-colors duration-300">
                {title}
            </h3>
            <p className="font-medium text-slate-600 dark:text-slate-300 mb-6">{company}</p>

            <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag, i) => (
                    <span key={i} className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {location}
                </div>
                <span className="text-sm font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0 transform inline-flex items-center gap-1">
                    Apply <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
            </div>
        </div>
    );
}
