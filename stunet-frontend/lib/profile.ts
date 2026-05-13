export async function getProfile() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/api/profile",
    {
      credentials: "include",
    }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function saveProfile(profile: {
  name?: string;
  college: string;
  degree: string;
  graduationYear: string;
  bio: string;
  resumeUrl?: string;
  linkedInUrl?: string;
  location?: string;
}) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/api/profile",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profile),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to save profile");
  }

  return res.json();
}
export async function updateAvatar(imageUrl: string) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/api/profile/avatar",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ imageUrl }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload avatar");
  }

  return res.json();
}
