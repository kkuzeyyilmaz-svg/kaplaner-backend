const express = require('express');
const { z } = require('zod');
const db = require('../db');
const { requireAdminKey } = require('../middleware/auth');

const router = express.Router();

const messageSchema = z.object({
  name: z.string().trim().min(2, 'Ad soyad çok kısa').max(120),
  contact: z.string().trim().min(3, 'Telefon veya e-posta giriniz').max(150),
  message: z.string().trim().min(2, 'Mesaj çok kısa').max(2000),
});

// POST /api/contact — yeni bir iletişim mesajı oluşturur
router.post('/', (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Geçersiz veri.' });
  }
  const { name, contact, message } = parsed.data;

  const stmt = db.prepare(`INSERT INTO messages (name, contact, message) VALUES (?, ?, ?)`);
  const info = stmt.run(name, contact, message);

  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

// GET /api/contact — sadece yönetici, tüm mesajları listeler
router.get('/', requireAdminKey, (req, res) => {
  const rows = db.prepare(`SELECT * FROM messages ORDER BY created_at DESC`).all();
  res.json(rows);
});

module.exports = router;
