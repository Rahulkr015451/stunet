"use client";

import { useEffect, useState } from "react";
import { createProject, deleteProject } from "@/lib/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: "",
    isPublic: true,
  });

  // Reusable defensive fetch logic
  const fetchProjects = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/projects`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else if (Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await createProject(form);
    setForm({
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      liveUrl: "",
      isPublic: true,
    });
    setShowForm(false);
    await fetchProjects();
    setLoading(false);
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My <span className="text-brand-accent">Projects</span>
          </h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Showcase your best work to top employers.</p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="primary-button text-sm py-2 px-6 flex items-center gap-2 shadow-brand"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        )}
      </div>

      {/* Add Project Form */}
      {showForm && (
        <div className="mb-10 glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-bl-full pointer-events-none" />

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 relative z-10">
            <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
            New Portfolio Project
          </h3>

          <div className="space-y-6 relative z-10">
            <Input
              label="Project Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Next.js E-commerce Platform"
            />

            <Textarea
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain the problem it solves and your role..."
            />

            <Input
              label="Tech Stack"
              name="techStack"
              placeholder="e.g. React, Node.js, PostgreSQL"
              value={form.techStack}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="GitHub URL (optional)"
                name="githubUrl"
                value={form.githubUrl}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />

              <Input
                label="Live Demo URL (optional)"
                name="liveUrl"
                value={form.liveUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)] flex gap-4 relative z-10">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="primary-button px-6 py-2.5 text-sm flex items-center gap-2 shadow-brand disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Project"}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-white rounded-lg border border-[rgba(255,255,255,0.1)] hover:bg-slate-800/50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Project List */}
      <div className="space-y-6">
        {projects.length === 0 && !showForm ? (
          <div className="glass-card border-dashed p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-[rgba(255,255,255,0.05)] flex items-center justify-center mx-auto mb-4 text-slate-500">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Build Your Portfolio</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">You haven't added any projects yet. Showcase your skills by adding your first project.</p>
            <button
              onClick={() => setShowForm(true)}
              className="secondary-button"
            >
              Add Your First Project
            </button>
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className="glass-card p-6 md:p-8 hover:border-brand-primary/30 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand-primary transition-colors">
                    {p.title}
                  </h4>

                  <p className="text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">{p.description}</p>

                  <div className="mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Tech Stack</span>
                    <p className="inline-flex px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-[11px] font-bold tracking-wider text-brand-accent">
                      {p.techStack}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-brand-primary transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
                        GitHub Repository
                      </a>
                    )}
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" className="text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteProject(p.id).then(fetchProjects)}
                  className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- Reusable Inputs ---------- */

function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors"
      />
    </div>
  );
}

function Textarea({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
        {label}
      </label>
      <textarea
        {...props}
        rows={4}
        className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-colors resize-y"
      />
    </div>
  );
}