"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import Logo from "@/app/components/Logo";

function RegisterContent() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"student" | "employer">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Refresh layout context by standard page reload
      if (data.user?.role === "admin") {
        window.location.href = "/admin";
      } else if (data.user?.role === "employer") {
        window.location.href = "/employer/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden py-12">
      {/* Background glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Scanline */}
      <div className="scanline" />

      <div className="w-full max-w-md relative z-10 boot-up">
        <div className="flex justify-center mb-10">
          <Logo size="lg" />
        </div>

        {/* PS5 Plate Card */}
        <div className="ps5-plate-outer p-[3px]">
          <div className="ps5-plate-inner p-8 sm:p-10">
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-600 to-cyan-400 rounded-t-full" />

            <h1 className="text-3xl font-black text-center mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-center text-[11px] font-bold uppercase tracking-widest opacity-30 mb-10">
              Join STUNET and power your future
            </p>

            {/* Role Toggle */}
            <div className="flex p-1 mb-8 bg-white/5 rounded-2xl border border-white/5">
              <button
                onClick={() => setRole("student")}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  role === "student"
                    ? "bg-blue-600/20 text-cyan-400 border border-blue-500/30 shadow-[0_0_15px_rgba(0,68,255,0.2)]"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Candidate
              </button>
              <button
                onClick={() => setRole("employer")}
                className={`flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                  role === "employer"
                    ? "bg-blue-600/20 text-cyan-400 border border-blue-500/30 shadow-[0_0_15px_rgba(0,68,255,0.2)]"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                Employer
              </button>
            </div>

            {errorMsg && (
              <div className="mb-6 rounded-2xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20 text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleEmailRegister} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="ps5-input"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="ps5-input"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="ps5-input"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full ps5-btn !py-4 !text-sm !mt-8 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-4 bg-black text-white/30 font-bold uppercase tracking-widest">Or continue with</span>
              </div>
            </div>

            <div className="mt-8">
              <a
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?role=${role}`}
                className="flex items-center justify-center w-full py-3.5 px-4 rounded-full bg-white/5 border border-white/10 font-black text-[11px] uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all duration-300 gap-3"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </a>
            </div>

            <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest opacity-30">
              Already have an account?{" "}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center opacity-30 text-sm font-bold uppercase tracking-widest">Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
