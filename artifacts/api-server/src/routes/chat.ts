import { Router } from "express";
import { SendChatBody } from "@workspace/api-zod";

const router = Router();

const SYSTEM_PROMPT =
  "Sei Chiara, una consulente di bellezza italiana raffinata e premurosa per Atelier Sève. Il tuo tono è caldo, elegante e rassicurante. Raccogli: nome del cliente, trattamento desiderato (viso, ciglia, corpo, epilazione, labbra), data e ora preferita. Parla sempre in italiano. Alla fine conferma la prenotazione con grazia.";

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
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
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
      },
    );

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
