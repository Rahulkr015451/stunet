const BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL + "/api/projects";

export async function getProjects() {
  const res = await fetch(BASE, {
    credentials: "include",
  });
  return res.json();
}

export async function createProject(data: any) {
  const res = await fetch(BASE, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProject(id: string, data: any) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProject(id: string) {
  await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function getPublicProjects() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL +
      "/api/projects/public",
    { credentials: "include" }
  );
  return res.json();
}
