const BASE = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/skills";

export async function getSkills() {
  const res = await fetch(BASE, { credentials: "include" });
  return res.json();
}

export async function addPredefinedSkill(skillId: string, level: string) {
  const res = await fetch(BASE, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ skillId, level }),
  });
  return res.json();
}

export async function addCustomSkill(name: string, level: string) {
  const res = await fetch(BASE, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, level }),
  });
  return res.json();
}

export async function deleteSkill(id: string, type: "predefined" | "custom") {
  await fetch(`${BASE}/${id}?type=${type}`, {
    method: "DELETE",
    credentials: "include",
  });
}
