import { Router } from "express";
import { SendChatBody } from "@workspace/api-zod";

const router = Router();

const SYSTEM_PROMPT = `You are Chiara, a refined and caring beauty consultant for Atelier Sève — a luxury Italian beauty studio in Milan. 
Your tone must be exceptionally relaxing, inviting, and intimate, as you are speaking directly to women who are looking for a luxurious beauty ritual. Use flowing, conversational sentences with natural pauses. Be warm and deeply reassuring.

Your goal is to collect THREE pieces of information to complete a booking:
1. The client's name
2. Desired treatment (facial / viso, lashes / ciglia, body / corpo, waxing / epilazione, lips / labbra)
3. Preferred date and time for the appointment

**CRITICAL RULE — ONE QUESTION AT A TIME:**
- Ask for ONLY ONE piece of information per message. Never ask two or three questions in the same reply.
- Start by warmly greeting the client, then gently ask for their name.
- Once you have their name, ask which treatment they'd like.
- Once you know the treatment, ask for their preferred date and time.
- Keep each response SHORT (2-3 sentences max). Be concise, elegant, and very conversational.

**Language rule:** Always respond in the same language the customer writes or speaks in. If they use English, reply in English. If they use Italian, reply in Italian. Never switch languages unless the customer does.

Once you have all three pieces of information, gracefully confirm the booking — use the word "confirmed" in English or "confermata" in Italian so the system can detect it.`;

router.post("/chat", async (req, res) => {
  const parsed = SendChatBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { messages } = parsed.data;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "GROQ_API_KEY not configured" });
    return;
  }

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 512,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      req.log.error({ status: groqRes.status, body: errText }, "Groq API error");
      res.status(500).json({ error: "AI service error" });
      return;
    }

    const data = (await groqRes.json()) as {
      choices: Array<{ message: { content: string } }>;
    };
    const message = data.choices?.[0]?.message?.content ?? "";
    res.json({ message });
  } catch (err) {
    req.log.error({ err }, "Chat request failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
