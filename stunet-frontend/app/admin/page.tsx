"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (!user || user.role !== "admin") {
        router.replace("/");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          Admin <span className="primary-gradient-text text-glow">Dashboard</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage platform content, users, and backend operations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdminCard
          title="Approve Jobs"
          description="Review, approve, or reject employer job posts to maintain quality."
          href="/admin/jobs"
          icon={
            <svg className="w-8 h-8 text-brand-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <AdminCard
          title="Manage Courses"
          description="Add, edit, or remove learning modules for the skill development portal."
          href="/admin/courses"
          icon={
            <svg className="w-8 h-8 text-brand-accent mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      </div>
    </div>
  );
}

function AdminCard({
  title,
  description,
  href,
  icon
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="block group">
      <div className="glass-card p-8 h-full relative overflow-hidden group-hover:-translate-y-1 transition-transform duration-300">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-primary/10 rounded-full blur-[40px] group-hover:bg-brand-primary/20 transition-colors" />
        {icon}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>

        <div className="mt-6 flex items-center text-sm font-semibold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Manage <span className="ml-1">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
