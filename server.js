const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// JSON klasörü ve dosya yolları
const dataDir = path.join(__dirname, "json");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

const sepetDosyaYolu = path.join(dataDir, "sepet.json");
const siparisDosyaYolu = path.join(dataDir, "siparisler.json");

// JSON okuma
function jsonDosyaOku(dosyaYolu) {
  try {
    if (!fs.existsSync(dosyaYolu)) {
      fs.writeFileSync(dosyaYolu, "[]", "utf-8");
      return [];
    }
    return JSON.parse(fs.readFileSync(dosyaYolu, "utf-8"));
  } catch (err) {
    console.error("Dosya okuma hatası:", err);
    return [];
  }
}

// JSON yazma
function jsonDosyaYaz(dosyaYolu, veri) {
  try {
    fs.writeFileSync(dosyaYolu, JSON.stringify(veri, null, 2), "utf-8");
  } catch (err) {
    console.error("Dosya yazma hatası:", err);
  }
}

// Sepeti getir
app.get("/api/sepet", (req, res) => {
  const sepet = jsonDosyaOku(sepetDosyaYolu);
  res.json(sepet);
});

// Sepette ürün var mı sorgula (ID ile)
app.get("/api/sepet/:id", (req, res) => {
  const sepet = jsonDosyaOku(sepetDosyaYolu);
  const urun = sepet.filter(u => u.id == req.params.id);
  res.json(urun); // Dizi olarak dönüyor
});

// Sepete ürün ekle veya adet artır
app.post("/api/sepet", (req, res) => {
  const yeniUrun = req.body; // id, isim, fiyat, adet, gorsel vb.

  if (!yeniUrun || !yeniUrun.id || !yeniUrun.adet) {
    return res.status(400).json({ message: "Geçersiz ürün verisi." });
  }

  const sepet = jsonDosyaOku(sepetDosyaYolu);
  const index = sepet.findIndex(u => u.id === yeniUrun.id);

  if (index !== -1) {
    // Ürün varsa adet artır
    sepet[index].adet += yeniUrun.adet;
  } else {
    sepet.push(yeniUrun);
  }

  jsonDosyaYaz(sepetDosyaYolu, sepet);
  res.json({ message: "Ürün sepete eklendi.", sepet });
});

// Sepetteki ürün adedini güncelle
app.patch("/api/sepet/:id", (req, res) => {
  const sepet = jsonDosyaOku(sepetDosyaYolu);
  const index = sepet.findIndex(u => u.id == req.params.id);

  if (index === -1) return res.status(404).json({ message: "Ürün bulunamadı." });

  const adet = req.body.adet;
  if (adet <= 0) {
    sepet.splice(index, 1); // Adet 0 veya altı ise ürünü sil
  } else {
    sepet[index].adet = adet;
  }

  jsonDosyaYaz(sepetDosyaYolu, sepet);
  res.json({ message: "Sepet güncellendi.", sepet });
});

// Sepeti temizle
app.delete("/api/sepet", (req, res) => {
  jsonDosyaYaz(sepetDosyaYolu, []);
  res.json({ message: "Sepet temizlendi." });
});

// Siparişleri getir
app.get("/api/siparisler", (req, res) => {
  const siparisler = jsonDosyaOku(siparisDosyaYolu);
  res.json(siparisler);
});

// Sipariş ekle
app.post("/api/siparisler", (req, res) => {
  const yeniSiparis = req.body; // { siparisId, musteriId, urunler: [...], toplamTutar, tarih }

  if (
    !yeniSiparis ||
    !yeniSiparis.siparisId ||
    !yeniSiparis.musteriId ||
    !Array.isArray(yeniSiparis.urunler)
  ) {
    return res.status(400).json({ message: "Geçersiz sipariş verisi." });
  }

  const siparisler = jsonDosyaOku(siparisDosyaYolu);
  siparisler.push(yeniSiparis);
  jsonDosyaYaz(siparisDosyaYolu, siparisler);

  // Sipariş sonrası sepeti temizle
  jsonDosyaYaz(sepetDosyaYolu, []);

  res.json({ message: "Sipariş kaydedildi.", siparisler });
});

// Statik dosyalar (frontend) için
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
