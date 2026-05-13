"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setMessage(data.message || "Failed to send reset link.");
                return;
            }

            setStatus("success");
            setMessage(data.message || "If an account exists, a reset link has been sent.");
        } catch (err) {
            console.error(err);
            setStatus("error");
            setMessage("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30 flex items-center justify-center px-4 relative overflow-hidden bg-slate-50 dark:bg-[#030308]">
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="glass-card p-8 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent" />

                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-2">
                        Reset Password
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8">
                        Enter your email to receive a password reset link.
                    </p>

                    {status === "success" ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="mb-8 rounded-md bg-green-500/10 p-4 text-sm text-green-400 border border-green-500/20">
                                {message}
                            </div>
                            <Link
                                href="/login"
                                className="w-full block py-3 px-4 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-800 text-slate-900 dark:text-white font-semibold transition-all duration-300 text-center"
                            >
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            {status === "error" && (
                                <div className="mb-6 rounded-md bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 text-center">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gradient-to-r from-brand-primary to-blue-600 text-slate-900 dark:text-white font-bold hover:shadow-[0_0_20px_rgba(14,165,233,0.4)] disabled:opacity-50 transition-all duration-300"
                                >
                                    {status === "loading" ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending Link...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </button>
                            </form>

                            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                                Remember your password?{" "}
                                <Link href="/login" className="text-brand-accent hover:text-brand-primary font-semibold transition-colors">
                                    Log in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
