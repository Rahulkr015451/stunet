"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TEASERS = [
    {
        id: 1,
        question: "You have two strings of varying thickness, each taking exactly 60 minutes to burn. How do you measure 45 minutes using only these two strings and a lighter?",
        answer: "Light the first string at both ends and the second string at one end. When the first string burns out completely, exactly 30 minutes have passed. At that exact moment, light the other end of the second string. It will burn out in 15 minutes, giving you exactly 45 minutes.",
        difficulty: "Hard",
        points: 100
    },
    {
        id: 2,
        question: "What comes next in the sequence: 1, 11, 21, 1211, 111221, ...?",
        answer: "312211. This is the 'Look and Say' sequence. You read the previous term out loud. '1' is read as 'one 1' (11). '11' is read as 'two 1s' (21). '21' is 'one 2, one 1' (1211).",
        difficulty: "Medium",
        points: 50
    },
    {
        id: 3,
        question: "A man is pushing his car along the road when he comes to a hotel. He shouts, 'I'm bankrupt!' Why?",
        answer: "He is playing Monopoly.",
        difficulty: "Easy",
        points: 25
    },
    {
        id: 4,
        question: "You have 8 balls. One is slightly heavier than the rest. Using a balance scale, what is the minimum number of weighings needed to find the heavy ball?",
        answer: "Two weighings. Weigh 3 vs 3. If they balance, weigh the remaining 2 against each other. If one group of 3 is heavier, take 2 of those 3 and weigh them against each other.",
        difficulty: "Medium",
        points: 75
    }
];

export default function BrainTeasersPage() {
    return (
        <div className="min-h-screen text-slate-900 dark:text-slate-100 selection:bg-brand-primary/30">
            <Navbar />

            <div className="px-6 md:px-12 pt-32 pb-20 max-w-7xl mx-auto">
                <div className="text-center mb-16 relative animate-fade-in">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 relative z-10">
                        Brain <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Teasers</span>
                    </h1>
                    <p className="mt-4 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto relative z-10">
                        Sharpen your mind and test your analytical skills with curated logic puzzles.
                        Click the cards to reveal the answers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {TEASERS.map((teaser, i) => (
                        <div key={teaser.id} className={`animate-fade-in-up stagger-${Math.min(i + 1, 6)}`}>
                            <TeaserCard teaser={teaser} />
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}

function TeaserCard({ teaser }: { teaser: any }) {
    const [isRevealed, setIsRevealed] = useState(false);

    return (
        <div
            className={`glass-card p-8 group relative overflow-hidden flex flex-col h-full transform transition-all duration-500 cursor-pointer ${isRevealed ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'hover:-translate-y-1 hover:border-brand-primary/50'}`}
            onClick={() => setIsRevealed(!isRevealed)}
        >
            <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${teaser.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    teaser.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    {teaser.difficulty}
                </span>
                <span className="text-sm font-bold text-slate-500">{teaser.points} pts</span>
            </div>

            <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">
                {teaser.question}
            </h3>

            <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.05)] relative">
                <div className={`transition-all duration-500 overflow-hidden ${isRevealed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <p className="text-emerald-100 font-medium">
                            {teaser.answer}
                        </p>
                    </div>
                </div>

                {!isRevealed && (
                    <p className="text-sm text-center font-bold text-brand-primary group-hover:text-brand-accent transition-colors">
                        Click to reveal answer
                    </p>
                )}
            </div>
        </div>
    );
}
