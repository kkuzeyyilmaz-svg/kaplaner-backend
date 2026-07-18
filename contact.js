require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const reservationsRouter = require('./routes/reservations');
const contactRouter = require('./routes/contact');
const menu = require('./data/menu.json');

const app = express();
const PORT = process.env.PORT || 4000;

// --- güvenlik ve istek gövdesi ayrıştırma ---
app.use(helmet());
app.use(express.json({ limit: '20kb' }));

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
}));

// --- form gönderimleri için spam/istismarı caydıracak hız sınırlama ---
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.' },
});

// --- uç noktalar ---
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.get('/api/menu', (req, res) => res.json(menu));

app.use('/api/reservations', formLimiter, reservationsRouter);
app.use('/api/contact', formLimiter, contactRouter);

// İsteğe bağlı: index.html dosyasını bir üst klasöre (../) koyarsanız
// tek başına `npm start` ile geliştirme ortamında tüm site sunulabilir.
app.use(express.static(path.join(__dirname, '..')));

// --- hata yönetimi ---
app.use((req, res) => res.status(404).json({ error: 'Bulunamadı.' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Sunucu hatası.' });
});

app.listen(PORT, () => {
  console.log(`Kaplaner backend çalışıyor: http://localhost:${PORT}`);
});
