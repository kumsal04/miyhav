let tumUrunler = [];

async function populerUrunleriGetir() {
  try {
    const response = await fetch('../json/urunler.json'); // tüm ürünler
    const urunler = await response.json();

    tumUrunler = urunler;

    const populerUrunler = urunler.filter(u => u.populer === true);

    const container = document.getElementById('populerCarouselInner');
    container.innerHTML = "";

    for (let i = 0; i < populerUrunler.length; i += 4) {
      const grup = populerUrunler.slice(i, i + 4);
      const activeClass = (i === 0) ? "active" : "";

      const kartlarHtml = grup.map(urun => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-3">
          <div class="card h-100 shadow product-title">
            <img src="${urun.gorsel}" class="card-img-top" alt="${urun.isim}">
            <div class="card-body">
              <div class="d-flex flex-column justify-content-between align-items-center mb-2">
                <span class="fw-bold text-warning">${urun.puan} ★</span>
                <small class="text-muted">${urun.yorumlar.length} Değerlendirme</small>
              </div>
              <h6 class="card-title fw-bold">${urun.isim}</h6>
              <p class="mb-1"><span class="badge bg-danger">${urun.indirim} İndirim</span></p>
              <p class="mb-1">
                <del class="text-muted">₺${urun.eskiFiyat}</del>
                <span class="fw-bold text-dark">₺${urun.fiyat}</span>
              </p>
              <div class="d-grid mb-2">
                <button class="btn bg-danger-subtle btn-sm btn-urun-detay" data-id="${urun.id}">
                  <i class="fa-solid fa-comments"></i> Ürüne Git
                </button>
              </div>
              <div class="mt-3">
                <button class="btn btn-success btn-sm btn-sepete-ekle" data-id="${urun.id}">Sepete Ekle</button>
              </div>
            </div>
          </div>
        </div>
      `).join("");

      const itemHtml = `
        <div class="carousel-item ${activeClass}">
          <div class="row justify-content-center">
            ${kartlarHtml}
          </div>
        </div>
      `;

      container.insertAdjacentHTML("beforeend", itemHtml);
    }

  } catch (error) {
    console.error("Ürünler JSON verisi alınamadı:", error);
  }
}

function modalBilgileriGoster(id) {
  const urun = tumUrunler.find(u => u.id === id);
  if (!urun) return;

  document.getElementById("modalUrunIsim").textContent = urun.isim;
  document.getElementById("modalUrunGorsel").src = urun.gorsel;
  document.getElementById("modalUrunGorsel").alt = urun.isim;
  document.getElementById("modalUrunFiyat").textContent = urun.fiyat;
  document.getElementById("modalUrunEskiFiyat").textContent = urun.eskiFiyat;
  document.getElementById("modalUrunPuan").textContent = urun.puan;
  document.getElementById("modalUrunDegerlendirme").textContent = `(${urun.yorumlar.length} değerlendirme)`;
  document.getElementById("modalUrunIndirim").textContent = urun.indirim;

  const ozellikler = `
    <li><strong>Yaş Grubu:</strong> ${urun.yasGrubu}</li>
    <li><strong>Kategori:</strong> ${urun.kategori}</li>
    <li><strong>Marka:</strong> ${urun.marka}</li>
    <li><strong>Satıcı:</strong> ${urun.satici}</li>
  `;
  document.getElementById("modalUrunOzellikleri").innerHTML = ozellikler;

  const yorumlarHTML = urun.yorumlar.map(yorum => `
    <div class="border-bottom pb-2 mb-2">
      <p class="mb-1"><strong>${yorum.kullanici}</strong> - ${yorum.puan}⭐</p>
      <p class="mb-0">${yorum.yorum}</p>
    </div>
  `).join("");
  document.getElementById("modalUrunYorumlar").innerHTML = yorumlarHTML;

  const modalElement = document.getElementById('urunDetayModal');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-urun-detay")) {
    const id = parseInt(e.target.getAttribute("data-id"));
    modalBilgileriGoster(id);
  }
});

document.addEventListener("DOMContentLoaded", populerUrunleriGetir);
