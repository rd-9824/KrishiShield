import express from 'express';
import jwt from 'jsonwebtoken';
import { sendAlertSmsDetailed } from '../services/smsAlerts.js';

const router = express.Router();

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Missing authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub || payload.id };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Browser-friendly check (GET). The actual send endpoint is POST.
router.get('/test', (req, res) => {
  return res.status(200).json({
    ok: true,
    message: 'SMS test endpoint is alive. Use POST /api/sms/test with Authorization: Bearer <token> to send.',
  });
});

// Sends a test SMS to all TWILIO_ALERT_PHONES.
// Body can be overridden for testing.
router.post('/test', auth, async (req, res) => {
  const body = String(req.body?.message || 'KrishiShield test: SMS is configured.').slice(0, 1600);
  try {
    const results = await sendAlertSmsDetailed(body);
    return res.json({ ok: true, results });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
});

export default router;
