"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCurrentUser } from "@/lib/auth";

interface FeedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  createdAt: string;
}

interface Teaser {
  id: number;
  question: string;
  answer: string;
  difficulty: string;
  points: number;
}

const TEASERS: Teaser[] = [
  {
    id: 1,
    question: "You have two strings of varying thickness, each taking exactly 60 minutes to burn. How do you measure 45 minutes using only these two strings and a lighter?",
    answer: "Light the first string at both ends and the second string at one end. When the first string burns out completely, exactly 30 minutes have passed. At that exact moment, light the other end of the second string. It will burn out in 15 minutes, giving you exactly 45 minutes.",
    difficulty: "Hard",
    points: 100,
  },
  {
    id: 2,
    question: "What comes next in the sequence: 1, 11, 21, 1211, 111221, ...?",
    answer: "312211. This is the 'Look and Say' sequence. You read the previous term out loud. '1' is read as 'one 1' (11). '11' is read as 'two 1s' (21). '21' is 'one 2, one 1' (1211).",
    difficulty: "Medium",
    points: 50,
  },
  {
    id: 3,
    question: "A man is pushing his car along the road when he comes to a hotel. He shouts, 'I'm bankrupt!' Why?",
    answer: "He is playing Monopoly.",
    difficulty: "Easy",
    points: 25,
  },
  {
    id: 4,
    question: "You have 8 balls. One is slightly heavier than the rest. Using a balance scale, what is the minimum number of weighings needed to find the heavy ball?",
    answer: "Two weighings. Weigh 3 vs 3. If they balance, weigh the remaining 2 against each other. If one group of 3 is heavier, take 2 of those 3 and weigh them against each other.",
    difficulty: "Medium",
    points: 75,
  },
  {
    id: 5,
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?",
    answer: "An echo.",
    difficulty: "Easy",
    points: 25,
  },
  {
    id: 6,
    question: "Three boxes are labeled 'Apples', 'Oranges', and 'Mixed'. Each label is wrong. You can pick one fruit from one box. How do you correctly label all three boxes?",
    answer: "Pick from the box labeled 'Mixed'. Since the label is wrong, it contains only apples or only oranges. Say it has an apple — label it 'Apples'. The box labeled 'Oranges' can't be oranges (wrong label) and can't be apples (already found), so it's 'Mixed'. The last box is 'Oranges'.",
    difficulty: "Hard",
    points: 100,
  },
];

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

type FeedItem =
  | { type: "job"; data: FeedJob }
  | { type: "teaser"; data: Teaser };

function buildFeed(jobs: FeedJob[]): FeedItem[] {
  const items: FeedItem[] = [];
  const shuffledTeasers = [...TEASERS].sort(() => Math.random() - 0.5);
  let teaserIndex = 0;

  for (let i = 0; i < jobs.length; i++) {
    items.push({ type: "job", data: jobs[i] });

    // Insert a teaser every 3 job posts
    if ((i + 1) % 3 === 0 && teaserIndex < shuffledTeasers.length) {
      items.push({ type: "teaser", data: shuffledTeasers[teaserIndex] });
      teaserIndex++;
    }
  }

  // If no jobs but we have teasers, show some teasers
  if (jobs.length === 0) {
    shuffledTeasers.slice(0, 3).forEach((t) => items.push({ type: "teaser", data: t }));
  }

  return items;
}

export default function FeedPage() {
  const [jobs, setJobs] = useState<FeedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setAuthChecked(true);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
          setFeedItems(buildFeed(data));
        }
      })
      .catch((err) => console.error("Error fetching feed:", err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-[-10%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <div className="px-6 md:px-12 pt-36 pb-24 max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 relative boot-up">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]" />
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 relative z-10">
            Your <span className="text-blue-500">Feed</span>
          </h1>
          <p className="text-base opacity-30 max-w-xl mx-auto relative z-10 font-medium">
            Latest opportunities from employers, mixed with brain teasers to keep you sharp.
          </p>
        </div>

        {/* Login gate */}
        {authChecked && !user ? (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto animate-fade-in-up">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sign in to view your feed</h3>
            <p className="text-slate-400 max-w-md mb-6">Log in to see personalized opportunities and brain teasers.</p>
            <div className="flex gap-4">
              <Link href="/login" className="primary-button">Login</Link>
              <Link href="/register" className="secondary-button">Register</Link>
            </div>
          </div>
        ) : (
        <>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-30 animate-pulse">
            <div className="w-8 h-8 rounded-full border-t-2 border-cyan-400 animate-spin mb-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Loading your feed...</span>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-blue-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-black mb-2">No feed items yet</h3>
            <p className="text-slate-500 max-w-md">
              Check back soon! Employers are posting new opportunities every day.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {feedItems.map((item, i) =>
              item.type === "job" ? (
                <JobFeedCard key={`job-${item.data.id}`} job={item.data as FeedJob} index={i} />
              ) : (
                <TeaserFeedCard key={`teaser-${(item.data as Teaser).id}`} teaser={item.data as Teaser} index={i} />
              )
            )}
          </div>
        )}
        </>
        )}
      </div>

      <Footer />
    </div>
  );
}

function JobFeedCard({ job, index }: { job: FeedJob; index: number }) {
  return (
    <div className={`animate-fade-in-up`} style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}>
      <Link href={`/jobs/${job.id}`} className="block group">
        <div className="glass-card p-6 md:p-8 relative overflow-hidden hover:border-brand-primary/40 transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-bl-full pointer-events-none transition-colors duration-500 group-hover:bg-brand-primary/15" />

          {/* Employer header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-accent/20 border border-brand-primary/20 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-black text-brand-primary">
                {(job.company || "?").charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{job.company}</p>
              <p className="text-xs text-slate-400">Posted a new opportunity · {timeAgo(job.createdAt)}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-bold text-brand-primary shrink-0">
              {job.type}
            </span>
          </div>

          {/* Job content */}
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-accent transition-colors duration-300">
            {job.title}
          </h3>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[rgba(255,255,255,0.05)]">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </div>
            <span className="text-sm font-bold text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-1">
              View Details
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function TeaserFeedCard({ teaser, index }: { teaser: Teaser; index: number }) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className={`animate-fade-in-up`} style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}>
      <div
        className={`glass-card p-6 md:p-8 relative overflow-hidden cursor-pointer transition-all duration-500 ${
          isRevealed
            ? "border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.08)]"
            : "hover:border-emerald-500/30"
        }`}
        onClick={() => setIsRevealed(!isRevealed)}
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

        {/* Teaser header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-400">Brain Teaser</p>
            <p className="text-xs text-slate-400">Sharpen your mind</p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                teaser.difficulty === "Easy"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : teaser.difficulty === "Medium"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {teaser.difficulty}
            </span>
            <span className="text-xs font-bold text-slate-500">{teaser.points} pts</span>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 leading-relaxed">
          {teaser.question}
        </h3>

        {/* Answer */}
        <div className="pt-4 border-t border-slate-200 dark:border-[rgba(255,255,255,0.05)]">
          <div
            className={`transition-all duration-500 overflow-hidden ${
              isRevealed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm text-emerald-300 font-medium leading-relaxed">{teaser.answer}</p>
            </div>
          </div>

          {!isRevealed && (
            <p className="text-sm text-center font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              Click to reveal answer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
