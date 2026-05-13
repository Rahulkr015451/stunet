import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

/**
 * GET /api/chat/conversations
 * List all conversations for the logged-in user with last message preview
 */
router.get("/conversations", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ userAId: user.userId }, { userBId: user.userId }],
      },
      include: {
        userA: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        userB: {
          select: { id: true, name: true, email: true, image: true, role: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { text: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Map to a cleaner format
    const mapped = conversations.map((conv) => {
      const otherUser =
        conv.userAId === user.userId ? conv.userB : conv.userA;
      const lastMessage = conv.messages[0] || null;

      return {
        id: conv.id,
        otherUser,
        lastMessage: lastMessage
          ? {
              text: lastMessage.text,
              createdAt: lastMessage.createdAt,
              isOwn: lastMessage.senderId === user.userId,
            }
          : null,
        updatedAt: conv.updatedAt,
      };
    });

    res.json(mapped);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

/**
 * POST /api/chat/conversations
 * Create or get a conversation with another user
 * Body: { recipientId: string }
 */
router.post("/conversations", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: "recipientId is required" });
    }

    if (recipientId === user.userId) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    // Check recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Sort IDs to ensure consistent unique constraint
    const [userAId, userBId] =
      user.userId < recipientId
        ? [user.userId, recipientId]
        : [recipientId, user.userId];

    // Try to find existing conversation
    let conversation = await prisma.conversation.findUnique({
      where: {
        userAId_userBId: { userAId, userBId },
      },
    });

    // Create if not exists
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { userAId, userBId },
      });
    }

    res.json({ id: conversation.id });
  } catch (error) {
    console.error("Create conversation error:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
});

/**
 * GET /api/chat/conversations/:id/messages
 * Get messages for a conversation
 */
router.get("/conversations/:id/messages", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (
      !conversation ||
      (conversation.userAId !== user.userId &&
        conversation.userBId !== user.userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        text: true,
        senderId: true,
        createdAt: true,
      },
    });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/**
 * POST /api/chat/conversations/:id/messages
 * Send a message
 * Body: { text: string }
 */
router.post("/conversations/:id/messages", requireAuth, async (req, res) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id },
    });

    if (
      !conversation ||
      (conversation.userAId !== user.userId &&
        conversation.userBId !== user.userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create message and update conversation timestamp
    const [message] = await prisma.$transaction([
      prisma.message.create({
        data: {
          conversationId: id,
          senderId: user.userId,
          text: text.trim(),
        },
      }),
      prisma.conversation.update({
        where: { id },
        data: { updatedAt: new Date() },
      }),
    ]);

    res.json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

export default router;
