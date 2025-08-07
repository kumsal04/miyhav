async function veterinerleriGetirVeYukle() {
  try {
    const response = await fetch("../json/vet.json"); // JSON dosyasının yolu
    const veterinerler = await response.json();

    const container = document.getElementById("vetContainer");
    container.innerHTML = ""; // önceden varsa temizle

    veterinerler.forEach(vet => {
      const vetHtml = `
        <div class="col-md-6 col-lg-3">
          <div class="card h-100 shadow-sm text-center">
            <img src="${vet.gorsel}" class="card-img-top img-fluid" alt="${vet.isim}">
            <div class="card-body">
              <h5 class="card-title">${vet.isim}</h5>
              <p class="text-muted mb-1">${vet.unvan}</p>
              <p class="small">${vet.sehir} · ${vet.uzmanlik}</p>
              <p class="card-text small">${vet.aciklama}</p>
            </div>
            <div class="card-footer bg-white border-top-0">
              <p class="mb-1 small">
                <i class="fas fa-phone-alt me-2 text-primary"></i>
                <a href="tel:${vet.telefon}" class="text-decoration-none">${formatTelefon(vet.telefon)}</a>
              </p>
              <p class="mb-1 small">
                <i class="fas fa-envelope me-2 text-danger"></i>
                <a href="mailto:${vet.email}" class="text-decoration-none">${vet.email}</a>
              </p>
              <p class="mb-0 small">
                <i class="fas fa-map-marker-alt me-2 text-success"></i>${vet.sehir}
              </p>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", vetHtml);
    });
  } catch (error) {
    console.error("Veteriner verisi alınırken hata oluştu:", error);
  }
}

// Telefon numarasını okunabilir yapmak için fonksiyon
function formatTelefon(tel) {
  return tel.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
}

document.addEventListener("DOMContentLoaded", veterinerleriGetirVeYukle);
