"use client";

import { useEffect, useState } from "react";
import {
  getSkills,
  addPredefinedSkill,
  addCustomSkill,
  deleteSkill,
} from "@/lib/skills";

type SkillLevel = "beginner" | "intermediate" | "advanced";

const LEVELS: SkillLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export default function SkillsPage() {
  const [data, setData] = useState<{
    available: any[];
    predefined: any[];
    custom: any[];
  } | null>(null);

  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [customSkillName, setCustomSkillName] = useState("");
  const [level, setLevel] = useState<SkillLevel>("beginner");
  const [loading, setLoading] = useState(false);

  const loadSkills = async () => {
    try {
      const res = await getSkills();
      if (res && Array.isArray(res.available)) {
        setData(res);
      } else {
        // Fallback for API errors (e.g. unauthenticated or backend error)
        setData({ available: [], predefined: [], custom: [] });
      }
    } catch (err) {
      console.error(err);
      setData({ available: [], predefined: [], custom: [] });
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleAddSkill = async () => {
    if (!level) return;

    setLoading(true);

    if (selectedSkillId) {
      await addPredefinedSkill(selectedSkillId, level);
    } else if (customSkillName.trim()) {
      await addCustomSkill(customSkillName.trim(), level);
      setCustomSkillName("");
    }

    setSelectedSkillId("");
    setLevel("beginner");
    await loadSkills();
    setLoading(false);
  };

  if (!data) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-500 animate-pulse">
          <div className="w-8 h-8 rounded-full border-t-2 border-brand-primary animate-spin"></div>
          Loading skills...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          My <span className="text-brand-accent">Skills</span>
        </h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Highlight your expertise to increase search visibility.</p>
      </div>

      {/* ADD SKILL FORM */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-bl-full pointer-events-none" />

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
          <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
          Add New Skill
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          {/* Skill dropdown */}
          <div className="md:col-span-2 relative">
            <select
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="w-full appearance-none rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
            >
              <option value="" className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                Other (Custom Skill)
              </option>
              {data.available.map((skill) => (
                <option key={skill.id} value={skill.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {skill.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Level dropdown */}
          <div className="md:col-span-2 relative">
            <select
              value={level}
              onChange={(e) =>
                setLevel(e.target.value as SkillLevel)
              }
              className="w-full appearance-none rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white capitalize focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white capitalize">
                  {l}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Custom skill input */}
          {!selectedSkillId && (
            <div className="md:col-span-4 mt-2">
              <input
                value={customSkillName}
                onChange={(e) => setCustomSkillName(e.target.value)}
                placeholder="Type your custom skill name..."
                className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
              />
            </div>
          )}
        </div>

        <button
          onClick={handleAddSkill}
          disabled={loading || (!selectedSkillId && !customSkillName.trim())}
          className="mt-6 primary-button px-6 py-2.5 text-sm flex items-center gap-2 shadow-brand disabled:opacity-50 relative z-10"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border-t-2 border-white animate-spin"></div>
              Adding...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Skill to Profile
            </>
          )}
        </button>
      </div>

      {/* MY SKILLS LIST */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-1 bg-brand-primary rounded-full" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Current Competencies
          </h3>
        </div>

        {(data.predefined.length === 0 && data.custom.length === 0) ? (
          <div className="glass-card border-dashed p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-[rgba(255,255,255,0.05)] flex items-center justify-center mx-auto mb-4 text-slate-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">You haven't listed any skills yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.predefined.map((item) => (
              <SkillCard
                key={item.id}
                name={item.skill.name}
                level={item.level}
                onDelete={() =>
                  deleteSkill(item.id, "predefined").then(loadSkills)
                }
              />
            ))}

            {data.custom.map((item) => (
              <SkillCard
                key={item.id}
                name={item.name}
                level={item.level}
                onDelete={() =>
                  deleteSkill(item.id, "custom").then(loadSkills)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Skill Card ---------- */

function SkillCard({
  name,
  level,
  onDelete,
}: {
  name: string;
  level: SkillLevel;
  onDelete: () => void;
}) {
  const levelColors = {
    beginner: "text-slate-400 bg-slate-800/50 border-slate-700",
    intermediate: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
    advanced: "text-brand-accent bg-brand-accent/10 border-brand-accent/20",
  };

  return (
    <div className="glass-card p-4 flex items-center justify-between group hover:border-brand-primary/30 transition-colors">
      <div className="truncate pr-4">
        <p className="font-bold text-slate-900 dark:text-white truncate" title={name}>
          {name}
        </p>
        <span className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${levelColors[level]}`}>
          {level}
        </span>
      </div>

      <button
        onClick={onDelete}
        title="Remove skill"
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center justify-center"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
