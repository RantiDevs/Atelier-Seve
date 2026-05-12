import { Router } from "express";
import { SubmitIntakeBody } from "@workspace/api-zod";

const router = Router();

router.post("/intake", async (req, res) => {
  const parsed = SubmitIntakeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Dati non validi. Riprova." });
    return;
  }

  // In a full implementation this would be stored in a DB
  req.log.info({ intake: parsed.data }, "New client intake received");

  res.status(201).json({
    success: true,
    message: "Grazie! Ti contatteremo presto.",
  });
});

export default router;
