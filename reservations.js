# API'nin dinleyeceği port
PORT=4000

# Bu API'yi tarayıcıdan çağırmasına izin verilen origin'lerin virgülle ayrılmış listesi.
# Siteyi yayına aldığınızda gerçek alan adınızı ekleyin (örn. https://kaplanerlokantasi.com)
CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:5500

# Rezervasyon/mesajları okumak için "x-admin-key" başlığında istenen gizli anahtar.
# Yayına almadan önce gerçek, rastgele bir değer üretin, örn.: openssl rand -hex 32
ADMIN_API_KEY=change-this-before-deploying

# SQLite veritabanı dosyasının yolu
DB_PATH=./data/kaplaner.db
