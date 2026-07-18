// Sadece yönetici uç noktaları için basit paylaşılan-anahtar doğrulaması (rezervasyon/mesaj listeleme).
// Bu anahtara ön yüzün ihtiyacı yoktur — sadece lokantayı yöneten kişinin ihtiyacı vardır.
function requireAdminKey(req, res, next) {
  const provided = req.get('x-admin-key');
  const expected = process.env.ADMIN_API_KEY;

  if (!expected || expected === 'change-this-before-deploying') {
    return res.status(500).json({ error: 'Sunucu yapılandırması eksik: ADMIN_API_KEY ayarlanmamış.' });
  }
  if (!provided || provided !== expected) {
    return res.status(401).json({ error: 'Yetkisiz erişim.' });
  }
  next();
}

module.exports = { requireAdminKey };
