"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const publicNavLinks = [
    { href: "/jobs", label: "Explore" },
    { href: "/skill-development", label: "Library" },
];

const authNavLinks = [
    { href: "/jobs", label: "Explore" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/network", label: "Network" },
    { href: "/feed", label: "Feed" },
    { href: "/skill-development", label: "Library" },
];

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        getCurrentUser().then(setUser);
    }, []);

    return (
        <header className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-gradient-to-b from-[var(--ps5-bg)]/80 via-[var(--ps5-bg)]/40 to-transparent">
            {/* Left: Logo */}
            <div className="flex items-center gap-12">
                <Logo />

                {/* Desktop Nav */}
                {user?.role !== "employer" && (
                    <nav className="hidden md:flex items-center gap-10">
                        {(user ? authNavLinks : publicNavLinks).map((link) => {
                            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-[10px] font-black uppercase tracking-[0.2em] ps5-nav-item ${
                                        isActive
                                            ? "active text-cyan-400"
                                            : "opacity-40 hover:opacity-100"
                                    } transition-all duration-300`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Chat icon */}
                {user && (
                    <Link
                        href="/chat"
                        className="relative w-10 h-10 rounded-full flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-white/5 transition-all duration-300"
                        aria-label="Messages"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </Link>
                )}

                {/* Auth buttons */}
                {!user ? (
                    <div className="hidden sm:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="ps5-shell-sm px-6 py-2.5 font-black text-[10px] uppercase tracking-widest border-white/10 hover:bg-white/10 transition-all duration-300"
                        >
                            Login
                        </Link>
                        <Link href="/register" className="ps5-btn-sm">
                            Register
                        </Link>
                    </div>
                ) : (
                    <div className="hidden sm:flex items-center gap-4">
                        <Link
                            href={user.role === "employer" ? "/employer/dashboard" : "/dashboard"}
                            className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity duration-300"
                        >
                            Dashboard
                        </Link>
                        <a
                            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`}
                            className="text-[10px] font-black uppercase tracking-widest text-red-400 opacity-50 hover:opacity-100 transition-opacity duration-300"
                        >
                            Logout
                        </a>
                        {/* Profile avatar */}
                        <div className="w-9 h-9 rounded-full border border-white/20 overflow-hidden">
                            <img
                                src={user.image || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name || 'user'}`}
                                alt="profile"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                )}

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* Mobile menu overlay */}
            {menuOpen && (
                <div className="absolute top-full left-0 w-full bg-[var(--ps5-bg)]/95 backdrop-blur-xl border-b border-[var(--ps5-border)] md:hidden animate-fade-in">
                    <nav className="flex flex-col px-6 py-6 gap-1">
                        {user?.role !== "employer" &&
                            (user ? authNavLinks : publicNavLinks).map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="px-4 py-3 text-[11px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:bg-white/5 rounded-2xl transition-all duration-300"
                                >
                                    {link.label}
                                </Link>
                            ))}

                        {user && (
                            <Link
                                href="/chat"
                                onClick={() => setMenuOpen(false)}
                                className="px-4 py-3 text-[11px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 hover:bg-white/5 rounded-2xl transition-all duration-300 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Messages
                            </Link>
                        )}

                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-1">
                            {!user ? (
                                <>
                                    <Link href="/login" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-cyan-400 hover:bg-white/5 rounded-2xl transition-colors">
                                        Login
                                    </Link>
                                    <Link href="/register" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white bg-blue-600/20 hover:bg-blue-600/30 rounded-2xl transition-colors">
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={user.role === "employer" ? "/employer/dashboard" : "/dashboard"}
                                        onClick={() => setMenuOpen(false)}
                                        className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-cyan-400 hover:bg-white/5 rounded-2xl transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`}
                                        className="px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors"
                                    >
                                        Logout
                                    </a>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
