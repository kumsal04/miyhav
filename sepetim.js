document.getElementById("urunlerAlani").addEventListener("click", function(e) {
  const sepeteBtn = e.target.closest(".btn-sepete-ekle");
  if (sepeteBtn) {
    const urunId = sepeteBtn.dataset.id;
    const secilenUrun = tumUrunler.find(u => u.id == urunId);
    if (!secilenUrun) return;

    sepeteEkle(secilenUrun);
  }
});

function sepeteEkle(urun) {
  fetch(`http://localhost:3000/api/sepet/${urun.id}`)
    .then(res => res.json())
    .then(data => {
      if (data.length > 0) {
        const mevcutUrun = data[0];
        return fetch(`http://localhost:3000/api/sepet/${mevcutUrun.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adet: mevcutUrun.adet + 1 })
        });
      } else {
        const yeniUrun = {
          id: urun.id,
          isim: urun.isim,
          fiyat: urun.fiyat,
          gorsel: urun.gorsel,
          adet: 1
        };
        return fetch("http://localhost:3000/api/sepet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(yeniUrun)
        });
      }
    })
    .then(() => alert(`${urun.isim} sepete eklendi!`))
    .catch(err => console.error("Sepete eklenirken hata:", err));
    
}
