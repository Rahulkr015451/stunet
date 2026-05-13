export async function getCurrentUser() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/api/me",
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  return data.user;
}

export async function logout() {
  await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/logout",
    {
      method: "POST",
      credentials: "include",
    }
  );
}