import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "https://stunet.vercel.app";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/network`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    // Fetch public jobs
    const jobsRes = await fetch(`${backendUrl}/api/public/jobs`, { next: { revalidate: 3600 } });
    if (jobsRes.ok) {
      const jobsData = await jobsRes.json();
      const jobs = jobsData.jobs || []; // Assuming the endpoint returns { jobs: [...] }

      jobs.forEach((job: any) => {
        routes.push({
          url: `${baseUrl}/jobs/${job.id}`,
          lastModified: new Date(job.updatedAt || job.createdAt || new Date()),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching jobs for sitemap:", error);
  }

  try {
    // Fetch employers (for the network page)
    const empRes = await fetch(`${backendUrl}/api/employers`, { next: { revalidate: 86400 } });
    if (empRes.ok) {
      const employers = await empRes.json();
      employers.forEach((emp: any) => {
        routes.push({
          url: `${baseUrl}/dashboard/employers/${emp.id}`, // Public employer profile route if it exists, otherwise adjust
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      });
    }
  } catch (error) {
    console.error("Error fetching employers for sitemap:", error);
  }

  return routes;
}
