"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EmployerApplicationsPage() {
  const { id } = useParams();
  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/employer/jobs/${id}/applications`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then(setApps)
      .catch(() => setApps([]));
  }, [id]);

  return (
    <div className="min-h-screen bg-white px-10 py-8">
      <h1 className="text-2xl font-bold text-neutral-900">
        Applicants
      </h1>

      <div className="mt-6 space-y-4">
        {apps.length === 0 && (
          <p className="text-neutral-600">
            No applications yet.
          </p>
        )}

        {apps.map((a) => (
          <div
            key={a.id}
            className="rounded-lg border border-neutral-200 p-5"
          >
            <h3 className="font-medium text-neutral-900">
              {a.student.name}
            </h3>

            <p className="text-sm text-neutral-600">
              {a.student.email}
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Applied on{" "}
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
