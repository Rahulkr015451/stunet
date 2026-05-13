"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function NewJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Internship");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employer/jobs`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          location,
          type,
          description,
        }),
      }
    );

    setLoading(false);
    router.push("/employer/jobs");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030308] text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="px-6 md:px-12 pt-32 pb-20 max-w-3xl mx-auto relative z-10">
        <div className="mb-10 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Post a <span className="text-brand-accent">New Opportunity</span>
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Publish an open role to the STUNET network and discover elite talent.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
          <Input label="Job Title" value={title} onChange={setTitle} placeholder="e.g. Senior Frontend Engineer" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Company Name" value={company} onChange={setCompany} placeholder="e.g. Acme Corp" />
            <Input label="Location" value={location} onChange={setLocation} placeholder="e.g. San Francisco, CA (Remote)" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Job Type
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full appearance-none rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
              >
                <option value="Internship" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Internship</option>
                <option value="Full-time" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Full-time</option>
                <option value="Part-time" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Part-time</option>
                <option value="Contract" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Contract</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
              Job Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors resize-y"
            />
          </div>

          <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-end">
            <button
              disabled={loading}
              className="primary-button w-full sm:w-auto px-8 py-3 shadow-brand disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-t-2 border-white animate-spin"></div>
                  Publishing Role...
                </>
              ) : (
                <>
                  Publish Opportunity
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
      />
    </div>
  );
}
