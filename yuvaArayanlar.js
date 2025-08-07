let tumIlanlar = [];

document.addEventListener("DOMContentLoaded", () => {
  ilanlariGetir();

  document.querySelector(".btn-tum").addEventListener("click", () => ilanlariGoster(tumIlanlar));
  document.querySelector(".btn-kedi").addEventListener("click", () => ilanlariGoster(tumIlanlar.filter(i => i.tur === "Kedi")));
  document.querySelector(".btn-kopek").addEventListener("click", () => ilanlariGoster(tumIlanlar.filter(i => i.tur === "Köpek")));

  document.querySelectorAll("input, select").forEach(e => e.addEventListener("change", filtrele));
  document.getElementById("filtreSifirlaBtn").addEventListener("click", () => {
    document.querySelectorAll("input[type=checkbox], input[type=radio]").forEach(el => el.checked = false);
    document.getElementById("sehirSelect").selectedIndex = 0;
    ilanlariGoster(tumIlanlar);
  });
});

async function ilanlariGetir() {
  try {
    const res = await fetch("../json/hayvan-ilanlari.json");
    if (!res.ok) throw new Error("Veri alınamadı");
    tumIlanlar = await res.json();
    ilanlariGoster(tumIlanlar);
  } catch (err) {
    console.error("Hata:", err);
  }
}

function ilanlariGoster(ilanlar) {
  const alan = document.getElementById("ilanlarAlani");
  alan.innerHTML = "";

  if (ilanlar.length === 0) {
    alan.innerHTML = "<p class='text-muted'>Sonuç bulunamadı.</p>";
    return;
  }

  ilanlar.forEach((i, index) => {
    alan.innerHTML += `
<div class="col-md-4 mb-4">
    <div class="card h-100 shadow-lg border-0">
      <div class="position-relative">
        <img src="${i.gorsel}" class="card-img-top rounded-top p-2" style="height: 250px;" alt="${i.isim}">
          <button class="btn position-absolute top-0 end-0 m-2 p-0 bg-transparent border-0 favorite" onclick='favoriyeEkle(${JSON.stringify(i)})'>
            <i class="fa-regular fa-heart fs-4 text-danger"></i>
          </button>

      </div>
      <div class="card-body">
        <h5 class="card-title fw-bold text-center">${i.isim}</h5>
            <div class="d-flex justify-content-around mb-2 border-top">
            <span class="text-primary"><i class="fas fa-paw me-1"></i> ${i.tur}</span>
            <span class="text-success"><i class="fas fa-venus-mars me-1"></i> ${i.cinsiyet}</span>
            <span class="text-warning"><i class="fas fa-hourglass-half me-1"></i> ${i.yas}</span>
            </div>
        <p class="text-muted text-center mb-3">
          <i class="fa-solid fa-location-dot"></i> ${i.sehir}
        </p>
        <div class="d-grid">
          <button class="btn bg-danger-subtle btn-sm btn-iletisim" data-index="${index}">
            <i class="fa-solid fa-comments"></i> İletişime Geç
          </button>
        </div>
      </div>
    </div>
  </div>
    `;
  });
}

function filtrele() {
  let filtrelenen = [...tumIlanlar];

  const seciliCinsiyet = document.querySelector('input[name="cinsiyet"]:checked')?.value;
  const seciliYaslar = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(i => i.value);
  const seciliSehir = document.getElementById("sehirSelect").value;

  if (seciliCinsiyet) filtrelenen = filtrelenen.filter(i => i.cinsiyet === seciliCinsiyet);
  if (seciliYaslar.length > 0) filtrelenen = filtrelenen.filter(i => seciliYaslar.includes(i.yas));
  if (seciliSehir && seciliSehir !== "Şehir seçin") filtrelenen = filtrelenen.filter(i => i.sehir === seciliSehir);

  ilanlariGoster(filtrelenen);
}

// Favori kalp ikon toggle
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("fa-heart")) {
    e.target.classList.toggle("fa-regular");
    e.target.classList.toggle("fa-solid");
  }
});

// İletişime Geç butonuna tıklanınca modal aç
document.getElementById("ilanlarAlani").addEventListener("click", function(e) {
  const btn = e.target.closest(".btn-iletisim");
  if (btn) {
    const ilanIndex = btn.dataset.index;
    const secilenIlan = tumIlanlar[ilanIndex];

    // Modal içeriği doldur
    document.getElementById("modalIsim").innerText = secilenIlan.isim;
    document.getElementById("modalTur").innerText = secilenIlan.tur;
    document.getElementById("modalCinsiyet").innerText = secilenIlan.cinsiyet;
    document.getElementById("modalYas").innerText = secilenIlan.yas;
    document.getElementById("modalSehir").innerText = secilenIlan.sehir;
    document.getElementById("modalGorsel").src = secilenIlan.gorsel;
    document.getElementById("modalSahip").innerText = secilenIlan.sahip;

    // Telefon bağlantısı
    const telEl = document.getElementById("modalTel");
    telEl.textContent = secilenIlan.telefon;
    telEl.href = `tel:${secilenIlan.telefon.replace(/\s+/g, '')}`; // Boşlukları kaldır

    // E-posta bağlantısı
      const mailEl = document.getElementById("modalMail");
      mailEl.textContent = secilenIlan.email;
      mailEl.href = `mailto:${secilenIlan.email}`;
      mailEl.classList.add("text-decoration-none", "text-dark");


    // Modalı göster
    new bootstrap.Modal(document.getElementById("ilanDetayModal")).show();
  }
});

function favoriyeEkle(ilan) {
  let favoriler = JSON.parse(localStorage.getItem("favoriIlanlar")) || [];

  // Aynı ilan zaten eklenmiş mi?
  const varsa = favoriler.some(i => i.id === ilan.id);
  if (!varsa) {
    favoriler.push(ilan);
    localStorage.setItem("favoriIlanlar", JSON.stringify(favoriler));

    alert(`${ilan.isim} favorilere eklendi!`);
  } else {
    alert(`${ilan.isim} zaten favorilerde!`);
  }
}





const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = Array.from(tooltipTriggerList).map(el => new bootstrap.Tooltip(el));
