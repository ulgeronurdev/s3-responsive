# Responsive Düzenlemeler

Code2Work, yeni web sayfaları için yazdığın kodları beğendi. Bir de mobil cihazlarda görmek istediler.
Bu doğrultuda bir tasarım hazırlamışlar. (`responsive.jpg`) Bunu kullanarak ana sayfayı mobil uyumlu hale getirmeni bekliyorlar.

Proje yönergeleri ve ihtiyaç duyacağın sayısal değerler `style.css` dosyasında.

## 🚀 Projeye Başlama

### Adım 1: Projeyi Kendi Hesabınıza Kopyalayın

1. Bu sayfanın sağ üst köşesindeki **Fork** butonuna tıklayın
2. Kendi GitHub hesabınızda proje kopyası oluşacak

### Adım 2: Projeyi Bilgisayarınıza İndirin

Görseldeki adımları takip edin ya da terminali kullanabilirsiniz.

```bash
git clone [buraya-kendi-fork-linkinizi-yazın]
cd [proje-klasor-adi]
```

### Adım 3: Gerekli Kurulumları Yapın

Terminal açın ve sırasıyla şu komutları çalıştırın:

```bash
npm install
npm run c2w
```

> **💡 İpucu:** Bu komutlar gerekli paketleri yükler ve test sistemini başlatır.

## 🔧 VS Code Hazırlığı

### Live Server Eklentisi (Zorunlu)

Live Server, HTML dosyalarınızı tarayıcıda canlı olarak görüntüler. Değişiklikler anında yansır.

**Kurulum:**

1. VS Code'da sol paneldeki **Extensions** (📦) simgesine tıklayın
2. Arama kutusuna `Live Server` yazın
3. **Ritwick Dey** tarafından yapılan eklentiyi bulun
4. **Install** butonuna tıklayın

**Kullanım:**

- HTML dosyanıza sağ tıklayın → **"Open with Live Server"**
- Tarayıcınızda proje otomatik açılır

### Prettier Eklentisi (Önerilen)

Kodunuzu otomatik olarak düzenler ve formatlar.

**Kurulum:**

1. Extensions bölümünde `Prettier` arayın
2. **"Prettier - Code formatter"** eklentisini kurun
3. **Ayarlar** → **"Format On Save"** seçeneğini aktif edin

## 📝 Geliştirme Süreci

### 0. Öğrenci numaranızı `student_id.txt` dosyasına yazın 

### 1. Testleri Takip Edin

- Terminal açık tutun ve test çıktılarını izleyin
- CSS/HTML dosyalarını her kaydettiğinizde testler otomatik çalışır
- Başarılı testler ✅, başarısız testler ❌ ile gösterilir

### 2. Adım Adım İlerleyin

- Her küçük ilerleme sonrası değişiklikleri kaydedin
- Testlerin durumunu kontrol edin
- Bir özelliği tamamen bitirdikten sonra commit yapın

### 3. Düzenli Commit Yapın

GitHub Desktop uygulamasını kullanarak ilerlemenizi sıklıkla GitHub'a gönderin.
Ya da terminali kullanabilirsiniz:

```bash
git add .
git commit -m "Anlamlı bir commit mesajı"
git push origin main
```

## 🧪 Otomatik Değerlendirme Sistemi

Bu proje otomatik test sistemi ile gelir. Test sonuçları terminal penceresinde görünür. Kırmızı (❌) testleri yeşile (✅) çevirmeye odaklanın.

## 🆘 Sorun Giderme

### Yaygın Sorunlar:

- **npm komutları çalışmıyor:** Node.js kurulu olduğundan emin olun
- **Live Server çalışmıyor:** Eklentinin düzgün kurulduğunu kontrol edin
- **Testler çalışmıyor:** Terminal penceresini kapatıp `npm run c2w` komutunu tekrar çalıştırın

### Yardım İçin:

1. Terminal hatasını tam olarak okuyun
2. Dosya yollarının doğru olduğunu kontrol edin
3. Değişiklikleri kaydettiğinizden emin olun

## 📋 Çalışma Akışı Özeti

1. ✅ Projeyi fork edin ve clone edin
2. ✅ `npm install` ve `npm run c2w` çalıştırın
3. ✅ VS Code eklentilerini kurun
4. ✅ Live Server ile projeyi açın
5. ✅ HTML/CSS dosyalarını düzenleyin
6. ✅ Terminal'den test sonuçlarını takip edin
7. ✅ Düzenli olarak commit yapın
8. ✅ İlerleyişinizi GitHub'a push edin

**İyi çalışmalar! 🎨✨**
