let data = JSON.parse(localStorage.getItem("transaksi")||"[]");

function logout(){
  localStorage.removeItem("login");
  location.href="login.html";
}
const API_URL = "https://script.google.com/macros/s/AKfycbyOR1gCumlqZ0xr0qH3xqll-GN_CLZ-dzGsbTEkk1IMYUWuI-YrtUt51mAhl2ouQHnPxg/exec";

/* ===== SIMPAN TRANSAKSI ===== */
function simpan() {
  if (localStorage.getItem("role") !== "bendahara") {
    alert("Hanya Bendahara yang boleh input");
    return;
  }

  const tgl = document.getElementById("tgl").value;
  const ket = document.getElementById("ket").value;
  const masuk = document.getElementById("masuk").value || 0;
  const keluar = document.getElementById("keluar").value || 0;
  const fotoFile = document.getElementById("foto").files[0];

  if (!tgl || !ket) {
    alert("Tanggal dan keterangan wajib diisi");
    return;
  }

  if (fotoFile) {
    const reader = new FileReader();
    reader.onload = function () {
      kirim(tgl, ket, masuk, keluar, reader.result);
    };
    reader.readAsDataURL(fotoFile);
  } else {
    kirim(tgl, ket, masuk, keluar, "");
  }
}

function kirim(tgl, ket, masuk, keluar, fotoBase64) {
  const data =
    "tgl=" + encodeURIComponent(tgl) +
    "&ket=" + encodeURIComponent(ket) +
    "&masuk=" + encodeURIComponent(masuk) +
    "&keluar=" + encodeURIComponent(keluar) +
    "&foto=" + encodeURIComponent(fotoBase64);

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data
  });

  alert("Transaksi terkirim ke Google Sheet");

  // reset form
  document.getElementById("tgl").value = "";
  document.getElementById("ket").value = "";
  document.getElementById("masuk").value = "";
  document.getElementById("keluar").value = "";
  document.getElementById("foto").value = "";

  // reload biar data baru muncul
  setTimeout(() => {
    location.reload();
  }, 1200);
}

function tampil(){
  let saldo=0, m=0, k=0, html="";

  data.forEach(x=>{
    const mi=parseInt(x.masuk||0);
    const ke=parseInt(x.keluar||0);
    saldo+=mi-ke; m+=mi; k+=ke;

    html+=`<tr>
      <td>${x.tgl}</td>
      <td>${x.ket}</td>
      <td>${mi? "Rp "+mi.toLocaleString():"-"}</td>
      <td>${ke? "Rp "+ke.toLocaleString():"-"}</td>
      <td>${x.foto?`<img src="${x.foto}">`:"-"}</td>
    </tr>`;
  });

  document.getElementById("tabel").innerHTML=html;
  saldoEl.innerText="Rp "+saldo.toLocaleString();
  masukTotal.innerText="Rp "+m.toLocaleString();
  keluarTotal.innerText="Rp "+k.toLocaleString();
}

const saldoEl=document.getElementById("saldo");
const masukTotal=document.getElementById("masukTotal");
const keluarTotal=document.getElementById("keluarTotal");

tampil();
