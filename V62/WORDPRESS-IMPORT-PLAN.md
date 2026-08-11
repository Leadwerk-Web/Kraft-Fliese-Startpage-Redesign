# Kraft Fliesen WordPress Import – Uygulama ve Yayına Alma Planı

Bu sürümde eski ACM Air Charter kaynakları kaldırılmış, statik Kraft Fliesen sitesi WordPress için tekrar çalıştırılabilir bir import akışına dönüştürülmüştür.

## 1. Mimari

- `leadwerk-fields`: ACF gerektirmeyen, WordPress `post_meta` tabanlı alan API’si ve sayfa bazlı düzenleme arayüzü.
- `leadwerk-wpml-clone`: Almanca ana sayfaları kaynak kabul eden DE/EN çeviri katmanı. Metin alanları çevrilir; link ve medya kimlikleri diller arasında paylaşılır.
- `leadwerk_importer`: HTML, WebP medya, SEO meta ve bireysel alanları gruplar halinde içe aktarır. Yeniden import mevcut editör içeriklerini aynı kararlı alan anahtarında korur.
- `leadwerk_theme`: Ortak header/footer üretir, bireysel alanları HTML kabuğuna uygular ve `.html` iç linklerini WordPress permalink’lerine dönüştürür.

## 2. Import sırası

1. WordPress yedeği ve staging ortamı oluştur.
2. `leadwerk-wpml-clone.zip`, `leadwerk-fields.zip`, `leadwerk_importer.zip` eklentilerini yükle.
3. Eklentileri aynı sırayla etkinleştir.
4. `leadwerk_theme.zip` temasını yükle ve etkinleştir.
5. Gerçek ACF/WPML kuruluysa import stack’iyle çakışmaması için devre dışı bırak. Bu proje kendi alan ve çeviri katmanını kullanır.
6. WPForms’u etkinleştir. Dağıtım klasöründeki `kraft-fliesen-wpforms.json` (kaynakta `wpforms-kraft-fliesen-kontakt.json`) dosyasını **WPForms → Tools → Import → Import Forms** altında içe aktar.
7. Oluşan form ID’sini **Ayarlar → Kraft Fliesen Website → WPForms Formular-ID (DE)** alanına yaz.
8. **Araçlar → Leadwerk Import** altında önce **Dry Run**, hata yoksa **Live Import** çalıştır.
9. **Ayarlar → Kalıcı Bağlantılar** ekranında bir kez Kaydet’e bas ve önbellekleri temizle.

## 3. Import edilen sayfalar

| Kaynak | WordPress slug | İşlev |
|---|---|---|
| `index.html` | `/` | Statik ön sayfa |
| `sortiment.html` | `/sortiment/` | Sortiment |
| `warum-wir.html` | `/warum-wir/` | USP/avantajlar |
| `unternehmen.html` | `/unternehmen/` | Şirket ve ekip |
| `service.html` | `/service/` | Hizmetler |
| `inspiration.html` | `/inspiration/` | Galeri/wohnideen |
| `bewertungen.html` | `/bewertungen/` | Değerlendirmeler |
| `agb.html` | `/agb/` | AGB |
| `danke.html` | `/danke/` | WPForms başarı yönlendirmesi |
| `legal.html` | `/rechtliches/` | Hukuki doküman merkezi |
| `impressum.html` | `/impressum/` | Güncel sağlayıcı ve şirket bilgileri |
| `datenschutz.html` | `/datenschutz/` | Mevcut teknik entegrasyonlara göre veri koruma metni |

`404.html` statik referanstır; WordPress gerçek 404 yanıtını temadaki `404.php` ile üretir ve HTTP durumunu korur.

## 4. Alan davranışı

- Her sayfadaki başlık, paragraf, liste öğesi, bağımsız span/strong metni ayrı alan olur.
- Her içerik linki ayrı düzenlenir. `service.html`, `/service/` ve `index.html#kontakt` gibi değerler render sırasında gerçek WordPress URL’sine çevrilir.
- `<img>` ve inline `background-image` değerleri Medya Kütüphanesi attachment ID’sine bağlanır.
- Görsel alanında alternatif metin ayrıca düzenlenir.
- Alanlar en yakın `section` ID/class değerine göre sekmelere ayrılır.
- Yeniden import yeni alanları ekler; aynı kararlı anahtardaki metin/link/görsel editlerini korur.

## 5. Form ve teslim doğrulaması

- JSON yalnızca WPForms Lite’ta bulunan çekirdek alan tiplerini kullanır: name, email, text, select, textarea ve GDPR agreement.
- Importer, formu algıladığında WPForms’un GDPR Enhancements ayarını otomatik etkinleştirir; zorunlu onay alanı ön yüzde görünür.
- Bildirim alıcısı `{admin_email}`, Reply-To değeri e-posta alanıdır.
- Başarılı gönderim tema filtresiyle dinamik `/danke/` sayfasına yönlenir; domain veya WordPress alt dizini değişse de çalışır.
- Canlı ortamda SMTP veya sağlayıcı mail teslimatı ayrıca test edilmelidir. Formun WPForms içinde bir test gönderimi yapılmalı, admin e-postası ve Reply-To doğrulanmalıdır.

## 6. Yayın öncesi smoke test

```bash
php scripts/verify-kraft-import.php
find leadwerk-fields leadwerk_importer leadwerk_theme leadwerk-wpml-clone -name '*.php' -print0 | xargs -0 -n1 php -l
node --check script.js
jq empty wpforms-kraft-fliesen-kontakt.json leadwerk_importer/manifest/mapping.json
```

Tarayıcıda ayrıca şu akışları kontrol et:

1. Desktop/mobile header, hamburger menü ve aktif sayfa.
2. Header/footer iç linklerinin `.html` içermemesi.
3. Home hero slider, sayaçlar, timeline ve inspiration galeri/lightbox.
4. Her sayfada en az bir metin, link, normal görsel ve arkaplan görseli edit edip ön yüzde doğrulama.
5. Form gönderimi → e-posta bildirimi → `/danke/`.
6. Bilinmeyen URL → gerçek 404 yanıtı ve uyumlu 404 tasarımı.
7. `/impressum/`, `/datenschutz/`, `/rechtliches/`, `/agb/` ve `/danke/` → AGB ile ortak hero, içerik dizini ve numaralı bölüm yapısı.
8. İngilizce sayfa üretilmez; dil seçici ancak ilgili sayfanın yayınlanmış alternatif çevirisi sonradan oluşturulursa görünür.

## 7. Geri dönüş

- Import, aynı `leadwerk_source_key` ile sayfaları günceller; kopya sayfa üretmez.
- Canlıya geçmeden önce DB ve `wp-content/uploads` yedeği tutulmalıdır.
- Eski ACM kaynakları çalışma ağacından çıkarılmıştır; bu çalışma sırasında kurtarılabilir geçici arşiv `/tmp/leadwerk-acm-archive.CENDlE` altında oluşturulmuştur.
- WebP dönüşüm ayrıntıları `webp-conversion-manifest.json` ve `webp-conversion-report.json` dosyalarındadır. Orijinal root raster dosyaları Git geçmişinden geri getirilebilir.
