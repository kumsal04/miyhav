  let tumUrunler = [];

  async function urunleriGetir() {
    try {
      const response = await fetch("../json/urunler.json"); // Tek JSON dosyası
      tumUrunler = await response.json();
      urunleriGoster(tumUrunler);
    } catch (error) {
      console.error("JSON yüklenirken hata:", error);
    }
  }

  function urunleriGoster(liste) {
    const urunlerAlani = document.getElementById("urunlerAlani");
    urunlerAlani.innerHTML = "";

    liste.forEach(urun => {
      const populerBadge = urun.populer
        ? `<span class="badge bg-success position-absolute top-0 end-0 m-2">Popüler</span>`
        : "";

      const card = `
        <div class="col-md-4 product-item position-relative">
          ${populerBadge}
          <div class="card h-100 shadow product-title">
            <img src="${urun.gorsel}" class="card-img-top" alt="${urun.isim}">
            <div class="card-body">
              <div class="d-flex flex-column justify-content-between align-items-center mb-2">
                <span class="fw-bold text-warning">${urun.puan} ★</span>
                <small class="text-muted">${urun.degerlendirme} Değerlendirme</small>
              </div>
              <h6 class="card-title fw-bold">${urun.isim}</h6>
              <p class="mb-1"><span class="badge bg-danger">${urun.indirim} İndirim</span></p>
              <p class="mb-1">
                <del class="text-muted">₺${urun.eskiFiyat}</del>
                <span class="fw-bold text-dark">₺${urun.fiyat}</span>
              </p>
              <div class="d-grid">
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
      `;
      urunlerAlani.insertAdjacentHTML("beforeend", card);
    });
  }

  document.getElementById("urunlerAlani").addEventListener("click", function(e) {
    const detayBtn = e.target.closest(".btn-urun-detay");
    if (detayBtn) {
      const urunId = detayBtn.dataset.id;
      const secilenUrun = tumUrunler.find(u => u.id == urunId);
      if (!secilenUrun) return;

      document.getElementById("modalUrunIsim").innerText = secilenUrun.isim;
      document.getElementById("modalUrunGorsel").src = secilenUrun.gorsel;
      document.getElementById("modalUrunPuan").innerText = secilenUrun.puan;
      document.getElementById("modalUrunDegerlendirme").innerText = secilenUrun.degerlendirme;
      document.getElementById("modalUrunIndirim").innerText = secilenUrun.indirim;
      document.getElementById("modalUrunFiyat").innerText = secilenUrun.fiyat;
      document.getElementById("modalUrunEskiFiyat").innerText = secilenUrun.eskiFiyat;

      const ozelliklerList = document.getElementById("modalUrunOzellikleri");
      ozelliklerList.innerHTML = "";
      if (secilenUrun.ozellikler && secilenUrun.ozellikler.length) {
        secilenUrun.ozellikler.forEach(ozellik => {
          const li = document.createElement("li");
          li.textContent = ozellik;
          ozelliklerList.appendChild(li);
        });
      }

      document.getElementById("modalUrunSatici").innerText = secilenUrun.satici || "MiyHav Petshop";

      const yorumlarDiv = document.getElementById("modalUrunYorumlar");
      yorumlarDiv.innerHTML = "";
      if (secilenUrun.yorumlar && secilenUrun.yorumlar.length) {
        secilenUrun.yorumlar.forEach(yorum => {
          const p = document.createElement("p");
          p.innerHTML = `<strong>${yorum.kullanici}:</strong> ${yorum.yorum}`;
          yorumlarDiv.appendChild(p);
        });
      }

      new bootstrap.Modal(document.getElementById("urunDetayModal")).show();
    }

    const sepeteBtn = e.target.closest(".btn-sepete-ekle");
    if (sepeteBtn) {
      const urunId = sepeteBtn.dataset.id;
      const secilenUrun = tumUrunler.find(u => u.id == urunId);
      if (!secilenUrun) return;

      sepeteEkle(secilenUrun);
    }
  });

  function sepeteEkle(urun) {
    fetch(`http://localhost:3000/sepet?id=${urun.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          // Ürün zaten sepette → adetini artır
          const mevcutUrun = data[0];
          return fetch(`http://localhost:3000/sepet/${mevcutUrun.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ adet: mevcutUrun.adet + 1 })
          });
        } else {
          // Ürün sepette yok → yeni ekle
          const yeniUrun = {
            id: urun.id,
            isim: urun.isim,
            fiyat: urun.fiyat,
            gorsel: urun.gorsel,
            adet: 1
          };
          return fetch("http://localhost:3000/sepet", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(yeniUrun)
          });
        }
      })
      .then(() => {
        alert(`${urun.isim} sepete eklendi!`);
      })
      .catch(err => console.error("Sepete eklenirken hata:", err));
  }


  document.getElementById("filter-btn").addEventListener("click", () => {
    const maxFiyat = Number(document.getElementById("priceRange").value);
    const kategori = document.getElementById("categorySelect").value;
    const marka = document.getElementById("brandSelect").value;
    const yas = document.getElementById("ageSelect").value;
    const tur = document.getElementById("typeSelect").value;

    const filtrelenmis = tumUrunler.filter(urun => {
      return (urun.fiyat <= maxFiyat) &&
            (kategori === "" || urun.kategori === kategori) &&
            (marka === "" || urun.marka === marka) &&
            (yas === "" || urun.yas === yas) &&
            (tur === "" || urun.tur === tur);
    });

    urunleriGoster(filtrelenmis);
  });

  document.getElementById("reset-btn").addEventListener("click", () => {
    document.getElementById("priceRange").value = 1000;
    document.getElementById("priceValue").innerText = 1000;
    document.getElementById("categorySelect").value = "";
    document.getElementById("brandSelect").value = "";
    document.getElementById("ageSelect").value = "";
    document.getElementById("typeSelect").value = "";
    urunleriGoster(tumUrunler);
  });

  // Price range slider value gösterimi
  document.getElementById("priceRange").addEventListener("input", (e) => {
    document.getElementById("priceValue").innerText = e.target.value;
  });

  document.addEventListener("DOMContentLoaded", urunleriGetir);
