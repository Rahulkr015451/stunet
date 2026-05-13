"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SkillDevelopmentPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public/courses`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch courses:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="px-6 md:px-12 pt-36 pb-24 max-w-[1600px] mx-auto text-center relative z-10">
        <div className="boot-up">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Skill <span className="text-blue-500">Library</span>
          </h1>
          <p className="text-base opacity-30 max-w-xl mx-auto mb-16 font-medium">
            Elevate your expertise with our curated technical modules and workshops.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center items-center">
            <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="mt-16 ps5-shell p-12 relative overflow-hidden animate-fade-in max-w-xl mx-auto" style={{ animationDelay: '200ms' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-600/5 rounded-full blur-[80px]" />
            <svg className="w-16 h-16 text-blue-400/30 mx-auto mb-6 animate-pulse relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <h2 className="text-2xl font-black relative z-10">We&apos;re cooking up something special.</h2>
            <p className="mt-3 opacity-30 text-sm relative z-10">Our new skill progression modules are currently in development. Coming soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left animate-fade-in" style={{ animationDelay: '200ms' }}>
            {courses.map((course, index) => (
              <div
                key={course.id}
                className={`ps5-shell-sm p-8 relative overflow-hidden group glow-hover flex flex-col h-full animate-fade-in-up stagger-${Math.min(index + 1, 6)}`}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-600/10 rounded-bl-[40px] group-hover:bg-blue-600/20 transition-colors pointer-events-none" />

                <h3 className="text-xl font-black mb-3 group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h3>

                <p className="text-sm opacity-30 leading-relaxed mb-8 flex-grow">
                  {course.description}
                </p>

                <a
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ps5-btn w-full mt-auto relative z-10"
                >
                  Start Course
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
