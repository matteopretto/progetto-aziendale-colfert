// backend/routes/login.js
import express from 'express';
import {Login} from '../libs/clientclasses.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { code, password } = req.body;

  if (!code || !password) {
    return res.status(400).json({ success: false, message: 'Codice e password sono obbligatori' });
  }

  try {
    
    const result = await Login(code, password, 'statistics');



      if (result && result.authentic === true) {
      res.json({
        success: true,
        message: 'Login effettuato con successo',
        user: {
          identifier: result.identifier,
          code: result.code,
          name: result.name,
          email: result.email,
          role: result.role,
          token: result.token,
          acl: result.acl
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenziali non valide',
        details: result
      });
    }

  } catch (err) {
    console.error("Errore durante il login:", err);
    res.status(500).json({
      success: false,
      message: 'Errore del server',
      error: err.message
    });
  }
});

export default router;
