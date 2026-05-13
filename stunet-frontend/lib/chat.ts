const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getConversations() {
  const res = await fetch(`${BASE}/api/chat/conversations`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function getOrCreateConversation(recipientId: string) {
  const res = await fetch(`${BASE}/api/chat/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ recipientId }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  return res.json();
}

export async function getMessages(conversationId: string) {
  const res = await fetch(
    `${BASE}/api/chat/conversations/${conversationId}/messages`,
    { credentials: "include" }
  );
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function sendMessage(conversationId: string, text: string) {
  const res = await fetch(
    `${BASE}/api/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    }
  );
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}
