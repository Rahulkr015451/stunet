"use client";

import { useEffect, useState } from "react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/courses`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  async function addCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description || !link) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/courses`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description, link }),
        }
      );

      const newCourse = await res.json();
      setCourses((prev) => [newCourse, ...prev]);

      setTitle("");
      setDescription("");
      setLink("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
          Manage <span className="primary-gradient-text text-glow">Courses</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Add new skill development modules and learning paths.
        </p>
      </header>

      {/* Course Creation Form */}
      <div className="glass-card p-8 relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-[50px] pointer-events-none" />

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Create New Course</h2>

        <form onSubmit={addCourse} className="space-y-5 relative z-10">
          <Input
            label="Course Title"
            value={title}
            set={setTitle}
            placeholder="e.g., Advanced React Patterns"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what the course covers"
              className="w-full bg-[rgba(15,23,42,0.8)] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all min-h-[100px] resize-y"
              required
            />
          </div>
          <Input
            label="Course Link (URL)"
            value={link}
            set={setLink}
            placeholder="https://..."
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="primary-button flex items-center gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding Course...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Course List */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Existing Courses</h2>

        {isLoading ? (
          <div className="glass-card p-10 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="glass-card p-10 text-center text-slate-500 dark:text-slate-400">
            No courses have been added yet.
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glass-card p-5 hover:border-brand-primary/30 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{course.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                      {course.description}
                    </p>
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      View Resource
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  set,
  placeholder = ""
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full bg-[rgba(15,23,42,0.8)] border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all font-medium"
      />
    </div>
  );
}
