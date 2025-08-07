async function kampanyaVerileriniGetir() {
  try {
    const response = await fetch("../json/slider-data.json"); // JSON dosyanın yolu
    const kampanyalar = await response.json();

    const carouselInner = document.querySelector("#slider .carousel-inner");
    carouselInner.innerHTML = "";

    kampanyalar.forEach((kampanya, index) => {
      const activeClass = index === 0 ? "active" : "";

      const itemHtml = `
        <div class="carousel-item ${activeClass}" data-id="${kampanya.id}" style="cursor:pointer;">
          <img src="${kampanya.img}" class="d-block w-100" alt="${kampanya.baslik}" />
        </div>
      `;
      carouselInner.insertAdjacentHTML("beforeend", itemHtml);
    });

    // Modal oluşturma ve tıklama event'i
    const modalHtml = `
      <div class="modal fade" id="kampanyaModal" tabindex="-1" aria-labelledby="kampanyaModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="kampanyaModalLabel"></h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Kapat"></button>
            </div>
            <div class="modal-body d-flex gap-4">
              <img id="modalImg" src="" alt="" class="img-fluid rounded" style="max-width: 300px;"/>
              <div>
                <p id="modalAciklama"></p>
                <ul>
                  <li><strong>Kampanya Bitiş Tarihi:</strong> <span id="modalTarih"></span></li>
                  <li><strong>Kalan Stok:</strong> <span id="modalStok"></span></li>
                  <li><strong>Bu kampanyayı alan kişi sayısı:</strong> <span id="modalKisiSayisi"></span></li>
                </ul>
                <button class="btn btn-success">Hemen Satın Al</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const kampanyaModal = new bootstrap.Modal(document.getElementById("kampanyaModal"));

    carouselInner.querySelectorAll(".carousel-item").forEach(item => {
      item.addEventListener("click", () => {
        const id = Number(item.getAttribute("data-id"));
        const kampanya = kampanyalar.find(k => k.id === id);

        if (kampanya) {
          document.getElementById("kampanyaModalLabel").textContent = kampanya.baslik;
          document.getElementById("modalImg").src = kampanya.img;
          document.getElementById("modalImg").alt = kampanya.baslik;
          document.getElementById("modalAciklama").textContent = kampanya.aciklama;
          document.getElementById("modalTarih").textContent = kampanya.kampanyaSonTarih;
          document.getElementById("modalStok").textContent = kampanya.stokAdedi;
          document.getElementById("modalKisiSayisi").textContent = kampanya.kisiSayisi;

          kampanyaModal.show();
        }
      });
    });
  } catch (err) {
    console.error("Kampanya verisi yüklenirken hata oluştu:", err);
  }
}

document.addEventListener("DOMContentLoaded", kampanyaVerileriniGetir);
