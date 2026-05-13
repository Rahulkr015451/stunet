"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/lib/profile";
import { getCurrentUser } from "@/lib/auth";
import { getPublicProjects } from "@/lib/projects";
import { getSkills } from "@/lib/skills";
import Link from "next/link";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<{ predefined: any[]; custom: any[] }>({ predefined: [], custom: [] });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", avatar: "", college: "", degree: "",
    graduationYear: "", bio: "", resumeUrl: "",
    linkedInUrl: "", location: "",
  });

  const loadData = async () => {
    const user = await getCurrentUser();
    const profile = await getProfile();
    const publicProjects = await getPublicProjects();
    const skillsData = await getSkills().catch(() => ({ predefined: [], custom: [] }));

    setForm({
      name: profile?.user?.name || user?.name || "",
      avatar: profile?.user?.image || user?.image || "",
      college: profile?.college || "",
      degree: profile?.degree || "",
      graduationYear: profile?.graduationYear || "",
      bio: profile?.bio || "",
      resumeUrl: profile?.resumeUrl || "",
      linkedInUrl: profile?.linkedInUrl || "",
      location: profile?.location || "",
    });
    setProjects(publicProjects || []);
    setSkills(skillsData || { predefined: [], custom: [] });

    if (profile) { setHasProfile(true); setIsEditing(false); }
    else { setHasProfile(false); setIsEditing(true); }
    setPageLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    await saveProfile({
      name: form.name, college: form.college, degree: form.degree,
      graduationYear: form.graduationYear, bio: form.bio,
      resumeUrl: form.resumeUrl, linkedInUrl: form.linkedInUrl, location: form.location,
    });
    setHasProfile(true); setIsEditing(false); setLoading(false);
    await loadData();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setAvatarLoading(true);
        const { updateAvatar } = await import("@/lib/profile");
        const updated = await updateAvatar(reader.result as string);
        setForm((prev) => ({ ...prev, avatar: updated.image }));
      } catch (err) { console.error("Failed to update avatar", err); }
      finally { setAvatarLoading(false); }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      setResumeLoading(true);
      try { setForm((prev) => ({ ...prev, resumeUrl: reader.result as string })); }
      catch (err) { console.error("Failed to process resume", err); }
      finally { setResumeLoading(false); }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const allSkills = [
    ...(skills.predefined || []).map((s: any) => ({ name: s.skill?.name || s.name, level: s.level })),
    ...(skills.custom || []).map((s: any) => ({ name: s.name, level: s.level })),
  ];

  if (pageLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 opacity-30">
          <div className="w-8 h-8 rounded-full border-t-2 border-cyan-400 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">Loading profile...</span>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     EDIT MODE
     ═══════════════════════════════════════════ */
  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto boot-up">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight">
            {hasProfile ? "Update " : "Create "}
            <span className="text-cyan-400">Profile</span>
          </h2>
          <p className="mt-2 text-sm opacity-30">Ensure your details are up-to-date so employers can find you.</p>
        </div>

        <div className="ps5-shell p-8 md:p-10 space-y-6 relative">
          {/* Avatar in edit mode */}
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-black flex items-center justify-center relative group shrink-0">
              {form.avatar ? (
                <img src={form.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-white/30">{form.name ? form.name.charAt(0).toUpperCase() : "?"}</span>
              )}
              <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                {avatarLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                ) : (
                  <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Change</span>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={avatarLoading} />
              </label>
            </div>
            <div className="flex-1">
              <EditField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
            </div>
          </div>

          <EditField label="Location Preferences" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Remote, New York, San Francisco..." />
          <EditField label="College / University" name="college" value={form.college} onChange={handleChange} placeholder="e.g. Stanford University" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EditField label="Degree" name="degree" value={form.degree} onChange={handleChange} placeholder="e.g. B.Tech Computer Science" />
            <EditField label="Graduation Year" name="graduationYear" value={form.graduationYear} onChange={handleChange} placeholder="e.g. 2026" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Professional Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
              placeholder="Introduce yourself, your passions, and what you are building..."
              className="ps5-input !rounded-2xl resize-y min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Resume (PDF)</label>
              <div className={`p-5 border border-dashed rounded-2xl transition-colors ${form.resumeUrl ? "border-cyan-400/30 bg-cyan-400/5" : "border-white/10 bg-white/[0.02]"}`}>
                <div className="flex flex-col items-center gap-2">
                  {resumeLoading ? (
                    <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin my-2" />
                  ) : (
                    <>
                      <svg className={`w-7 h-7 ${form.resumeUrl ? "text-cyan-400" : "opacity-20"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                        {form.resumeUrl ? "Resume uploaded ✓" : "Click to upload"}
                      </p>
                      <label className="ps5-btn-sm cursor-pointer !text-[9px] mt-1">
                        Choose File
                        <input type="file" className="hidden" accept=".pdf" onChange={handleResumeUpload} disabled={resumeLoading} />
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
            <EditField label="LinkedIn Profile URL" name="linkedInUrl" value={form.linkedInUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
            <button onClick={handleSave} disabled={loading} className="ps5-btn disabled:opacity-50">
              {loading ? "Saving..." : "Save Profile"}
            </button>
            {hasProfile && (
              <button onClick={() => setIsEditing(false)} className="ps5-shell-sm px-8 py-3 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-colors">
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     VIEW MODE — LinkedIn-style Profile
     ═══════════════════════════════════════════ */
  return (
    <div className="max-w-4xl mx-auto boot-up space-y-6">

      {/* ───── Hero Card (Cover + Avatar + Name) ───── */}
      <div className="ps5-shell overflow-hidden relative">
        {/* Cover banner */}
        <div className="h-40 md:h-52 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-blue-900/60 to-cyan-600/30" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] opacity-60" />
          {/* Edit button */}
          {hasProfile && (
            <button onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 z-20 ps5-btn-sm !bg-white/10 !text-white/80 backdrop-blur-sm border border-white/10 hover:!bg-white/20 gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* Avatar + Identity */}
        <div className="px-8 pb-8 relative">
          {/* Avatar — overlaps the banner */}
          <div className="-mt-16 mb-4 flex items-end gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#00020a] bg-black flex items-center justify-center relative group shadow-[0_0_30px_rgba(0,68,255,0.3)] shrink-0">
              {form.avatar ? (
                <img src={form.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-black text-white/20">{form.name ? form.name.charAt(0).toUpperCase() : "?"}</span>
              )}
              <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity rounded-full">
                {avatarLoading ? (
                  <div className="w-6 h-6 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 text-cyan-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">Change</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={avatarLoading} />
                  </>
                )}
              </label>
            </div>

            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight truncate">{form.name || "Your Name"}</h1>
              {(form.degree || form.college) && (
                <p className="text-sm opacity-50 mt-1 truncate">
                  {form.degree}{form.degree && form.college ? " · " : ""}{form.college}
                </p>
              )}
              {form.location && (
                <div className="flex items-center gap-1.5 mt-2 text-xs opacity-30">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {form.location}
                </div>
              )}
            </div>
          </div>

          {/* Quick action pills */}
          <div className="flex flex-wrap gap-3 mt-2">
            {form.linkedInUrl && (
              <a href={form.linkedInUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-cyan-400 hover:bg-blue-600/20 transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            )}
            {form.resumeUrl && (
              <a href={form.resumeUrl} target="_blank" download="resume.pdf"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 hover:bg-white/10 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Resume
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ───── About Section ───── */}
      {form.bio && (
        <div className="ps5-shell-sm p-8">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">About</h3>
          <p className="text-sm leading-relaxed opacity-60 whitespace-pre-line">{form.bio}</p>
        </div>
      )}

      {/* ───── Education Section ───── */}
      {(form.college || form.degree) && (
        <div className="ps5-shell-sm p-8">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-6">Education</h3>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zM12 14v7" />
              </svg>
            </div>
            <div>
              {form.college && <p className="font-bold text-base">{form.college}</p>}
              {form.degree && <p className="text-sm opacity-50 mt-0.5">{form.degree}</p>}
              {form.graduationYear && <p className="text-xs opacity-30 mt-1">Class of {form.graduationYear}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ───── Skills Section ───── */}
      {allSkills.length > 0 && (
        <div className="ps5-shell-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Skills</h3>
            <Link href="/dashboard/skills" className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-cyan-400 transition-all flex items-center gap-1">
              Manage <span>→</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, i) => (
              <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-bold opacity-60 hover:opacity-100 hover:border-cyan-400/30 hover:bg-cyan-400/5 transition-all">
                {skill.name}
                {skill.level && <span className="ml-1.5 text-cyan-400/60 text-[10px]">· {skill.level}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ───── Projects Section ───── */}
      {projects.length > 0 && (
        <div className="ps5-shell-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Projects</h3>
            <Link href="/dashboard/projects" className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-cyan-400 transition-all flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>
          <div className="space-y-4">
            {projects.slice(0, 4).map((p: any) => (
              <div key={p.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group">
                <h4 className="font-bold text-base group-hover:text-cyan-400 transition-colors">{p.title}</h4>
                {p.description && <p className="text-sm opacity-40 mt-1 line-clamp-2">{p.description}</p>}
                {p.techStack && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60 mt-3">{p.techStack}</p>
                )}
                <div className="flex gap-4 mt-3">
                  {p.githubUrl && (
                    <a href={p.githubUrl} target="_blank" className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 hover:text-white transition-all flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                      GitHub
                    </a>
                  )}
                  {p.liveUrl && (
                    <a href={p.liveUrl} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-cyan-400/50 hover:text-cyan-400 transition-all flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────── Edit Field Component ────── */
function EditField({ label, name, value, onChange, placeholder }: {
  label: string; name: string; value: string; onChange: any; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">{label}</label>
      <input type="text" name={name} value={value} onChange={onChange} placeholder={placeholder} className="ps5-input" />
    </div>
  );
}