"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EmployerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030308] text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="px-6 md:px-12 pt-32 pb-20 max-w-7xl mx-auto relative z-10">
        <div className="mb-12 animate-fade-in">
          <div className="w-12 h-1 bg-brand-primary mb-6 rounded-full" />
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Employer <span className="text-brand-accent">Dashboard</span>
          </h1>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Welcome back. Manage your active job postings and review incoming talent applications efficiently.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="animate-fade-in-up stagger-1">
            <DashboardCard
              title="Post a New Opportunity"
              description="Create and publish a new job or internship vacancy to the STUNET network."
              href="/employer/jobs/new"
              icon={
                <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
              }
            />
          </div>

          <div className="animate-fade-in-up stagger-2">
            <DashboardCard
              title="Manage Listings"
              description="Review, edit, and track all the opportunities you have posted."
              href="/employer/jobs"
              icon={
                <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
            />
          </div>

          <div className="animate-fade-in-up stagger-3">
            <DashboardCard
              title="My Network"
              description="Discover and connect with students who follow your company."
              href="/employer/network"
              icon={
                <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href} className="block group h-full">
      <div className="glass-card p-8 cursor-pointer relative overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-500 hover:border-brand-primary/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-bl-full transition-colors duration-500 group-hover:bg-brand-primary/20 pointer-events-none" />

        <div className="mb-6 p-4 rounded-xl bg-brand-primary/10 border border-brand-primary/20 inline-flex self-start">
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-accent transition-colors duration-300">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 flex-1">
          {description}
        </p>

        <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          <span className="text-sm font-bold text-brand-primary group-hover:text-brand-accent transition-colors duration-200">
            Get Started
          </span>
          <svg className="w-5 h-5 text-brand-primary group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
