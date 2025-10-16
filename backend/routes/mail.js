import express from "express";
import { SendMail } from "../libs/clientclasses.js";

const router = express.Router();

// POST /mail/send
router.post("/send", async (req, res) => {
  try {
    const { to, cc, bcc, subject, body, attachments } = req.body;

    // Passa direttamente l'array di allegati in memoria
    // Gli oggetti devono avere { filename, contentBase64 }
    const filesToSend = (attachments || []).map(a => ({
      filename: a.filename,
      content: a.contentBase64
    }));

    const result = await SendMail(
      "noreply@colfert.com", // mittente fisso
      to ?? "",
      cc ?? "",
      bcc ?? "",
      subject ?? "",
      body ?? "",
      filesToSend 
    );

    res.json({ ok: true, message: "Email inviata con successo", result });
  } catch (err) {
    console.error("Errore invio mail:", err);
    res.status(500).json({ ok: false, message: "Errore invio mail", error: err.message });
  }
});

export default router;
