function favoriyeEkle(ilan) {
  let favoriler = JSON.parse(localStorage.getItem("favoriIlanlar")) || [];

  // Aynı id'ye sahip ilan var mı kontrol et
  const index = favoriler.findIndex(fav => fav.id === ilan.id);

  if (index === -1) {
    // Yoksa ekle
    favoriler.push(ilan);
  } else {
    // Varsa çıkar (favorilerden kaldır)
    favoriler.splice(index, 1);
  }

  localStorage.setItem("favoriIlanlar", JSON.stringify(favoriler));
  favoriListele();
}
function favoriListele() {
  const favoriDiv = document.getElementById("favoriIlanlar");
  const favoriler = JSON.parse(localStorage.getItem("favoriIlanlar")) || [];

  // Profildeki favori sayısını güncelle
  const favoriSayisiEl = document.querySelector(".profile-card p i.bi-heart-fill")?.parentElement;
  if (favoriSayisiEl) {
    favoriSayisiEl.innerHTML = `<i class="bi bi-heart-fill me-1 text-danger"></i> ${favoriler.length} Favori`;
  }

  if (favoriler.length === 0) {
    favoriDiv.innerHTML = "<p class='text-muted'>Henüz favori ilanınız yok.</p>";
    return;
  }

  let html = '<div class="row">';
  favoriler.forEach(i => {
    html += `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-lg border-0">
          <div class="position-relative">
            <img src="${i.gorsel}" class="card-img-top rounded-top p-2" style="height: 250px; object-fit: cover;" alt="${i.isim}">
            <button class="btn position-absolute top-0 end-0 m-2 p-0 bg-transparent border-0 favorite" onclick='favoriyeEkle(${JSON.stringify(i)})'>
              <i class="fa-solid fa-heart fs-4 text-danger"></i>
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
              <button class="btn bg-danger-subtle btn-sm btn-iletisim">
                <i class="fa-solid fa-comments"></i> İletişime Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  html += '</div>';

  favoriDiv.innerHTML = html;
}
document.addEventListener("DOMContentLoaded", () => {
  favoriListele();
});
