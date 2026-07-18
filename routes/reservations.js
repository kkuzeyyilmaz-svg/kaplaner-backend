const express = require('express');
const { z } = require('zod');
const db = require('../db');
const { requireAdminKey } = require('../middleware/auth');

const router = express.Router();

const reservationSchema = z.object({
  name: z.string().trim().min(2, 'Ad soyad çok kısa').max(120),
  phone: z.string().trim().min(7, 'Geçerli bir telefon giriniz').max(30),
  guests: z.coerce.number().int().min(1).max(100),
  date: z.string().trim().min(4).max(20),
  time: z.string().trim().min(3).max(10),
  note: z.string().trim().max(500).optional().or(z.literal('')),
});

// POST /api/reservations — yeni bir rezervasyon talebi oluşturur
router.post('/', (req, res) => {
  const parsed = reservationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Geçersiz veri.' });
  }
  const { name, phone, guests, date, time, note } = parsed.data;

  const stmt = db.prepare(`
    INSERT INTO reservations (name, phone, guests, date, time, note)
    VALUES (@name, @phone, @guests, @date, @time, @note)
  `);
  const info = stmt.run({ name, phone, guests, date, time, note: note || null });

  res.status(201).json({ ok: true, id: info.lastInsertRowid });
});

// GET /api/reservations — sadece yönetici, tüm rezervasyonları listeler
router.get('/', requireAdminKey, (req, res) => {
  const rows = db.prepare(`SELECT * FROM reservations ORDER BY created_at DESC`).all();
  res.json(rows);
});

// PATCH /api/reservations/:id — sadece yönetici, durumu günceller (pending/confirmed/cancelled)
router.patch('/:id', requireAdminKey, (req, res) => {
  const allowed = ['pending', 'confirmed', 'cancelled'];
  const { status } = req.body || {};
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: `status alanı şunlardan biri olmalı: ${allowed.join(', ')}` });
  }
  const info = db.prepare(`UPDATE reservations SET status = ? WHERE id = ?`).run(status, req.params.id);
  if (info.changes === 0) return res.status(404).json({ error: 'Kayıt bulunamadı.' });
  res.json({ ok: true });
});

module.exports = router;
