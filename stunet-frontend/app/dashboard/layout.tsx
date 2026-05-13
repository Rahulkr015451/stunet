"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "../components/Logo";

const navItems = [
  { name: "Profile", href: "/dashboard/profile", label: "My Profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { name: "Projects", href: "/dashboard/projects", label: "Projects", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { name: "Skills", href: "/dashboard/skills", label: "Skills", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { name: "Employers", href: "/dashboard/employers", label: "Employers", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { name: "Following", href: "/dashboard/following", label: "Following", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { name: "Applications", href: "/dashboard/applications", label: "Applications", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background ambient glow spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Mobile hamburger overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation — PS5 Shell */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-72 flex flex-col px-6 py-8 transform transition-transform duration-500 ease-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(0, 4, 18, 0.8)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Brand */}
        <div className="mb-10">
          <Logo />
          <div className="mt-4 inline-flex px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-[9px] uppercase font-black tracking-[0.3em] text-cyan-400">
            Student Portal
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`relative overflow-hidden rounded-2xl px-4 py-3.5 text-xs transition-all duration-300 group flex items-center gap-3 ${
                  active
                    ? "bg-blue-600/15 text-cyan-400 font-black border border-blue-500/20 shadow-[0_0_20px_rgba(0,68,255,0.15)]"
                    : "text-white/30 font-bold hover:bg-white/5 hover:text-white/60 border border-transparent"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-2xl shadow-[0_0_10px_rgba(0,210,255,0.8)]" />
                )}
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                <span className="uppercase tracking-widest text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout + Footer */}
        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3">
          <a
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`}
            className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </a>
          <div className="text-[9px] text-white/15 font-bold uppercase tracking-widest px-4">
            © {new Date().getFullYear()} STUNET
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-20 px-4 py-3 flex items-center justify-between" style={{ background: "rgba(0, 2, 10, 0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors"
            aria-label="Open sidebar"
          >
            <svg className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Logo />
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        <div className="p-6 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
