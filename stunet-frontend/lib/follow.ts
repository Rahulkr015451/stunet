const API = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function followEmployer(employerId: string) {
  const res = await fetch(`${API}/api/follow/${employerId}`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to follow employer");
  }

  return res.json();
}

export async function unfollowEmployer(employerId: string) {
  const res = await fetch(`${API}/api/follow/${employerId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to unfollow employer");
  }

  return res.json();
}

export async function getFollowStatus(employerId: string) {
  const res = await fetch(`${API}/api/follow/status/${employerId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    return { following: false };
  }

  return res.json();
}

export async function getFollowing() {
  const res = await fetch(`${API}/api/follow/following`, {
    credentials: "include",
  });

  if (!res.ok) {
    console.error("Failed to fetch following list");
    return [];
  }

  return res.json();
}

export async function getFollowFeed() {
  const res = await fetch(`${API}/api/follow/feed`, {
    credentials: "include",
  });

  if (!res.ok) {
    console.error("Failed to fetch feed");
    return [];
  }

  return res.json();
}

export async function getEmployers() {
  const res = await fetch(`${API}/api/employers`, {
    credentials: "include",
  });

  if (!res.ok) {
    console.error("Failed to fetch employers");
    return [];
  }

  return res.json();
}

export async function getEmployerProfile(id: string) {
  const res = await fetch(`${API}/api/employers/${id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch employer profile");
  }

  return res.json();
}
