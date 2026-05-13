"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../components/Logo";

const adminNavItems = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/jobs", label: "Approve Jobs" },
    { href: "/admin/courses", label: "Manage Courses" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-[#030308] text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 relative overflow-hidden">
            {/* Background ambient glow spheres */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-[rgba(255,255,255,0.05)] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl flex flex-col px-6 py-8 relative z-20">

                {/* Brand */}
                <div className="mb-12">
                    <Logo />
                    <div className="mt-4 inline-flex px-3 py-1 rounded-full bg-slate-800/50 border border-brand-accent/30 text-[10px] uppercase font-bold tracking-wider text-brand-accent shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                        Admin Portal
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    {adminNavItems.map((item) => {
                        const active = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative overflow-hidden rounded-lg px-4 py-3 text-sm transition-all duration-300 group ${active
                                    ? "bg-brand-primary/10 text-brand-primary font-bold border border-brand-primary/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
                                    : "text-slate-400 font-semibold hover:bg-slate-800/50 hover:text-white border border-transparent"
                                    }`}
                            >
                                {/* Active indicator line */}
                                {active && (
                                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-l-lg shadow-[0_0_10px_rgba(14,165,233,0.8)]" />
                                )}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Home Link */}
                <div className="mt-8">
                    <Link
                        href="/"
                        className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                        &larr; Back to Home
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-auto text-xs text-slate-500 font-medium">
                    © {new Date().getFullYear()} STUNET
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-8 md:p-12 relative z-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
