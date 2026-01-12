const API_URL = "const API_URL = "https://script.google.com/macros/s/AKfycbz2fHNtKgcbtT_q5TtX33XZRbji30T0Cen7DldaAJi5PW5t3LB2b5ojYSYDPZF1EJkM/exec";";

/* =============================
   SIMPAN TRANSAKSI KE SHEET
============================= */
function simpan() {

  if (localStorage.getItem("role") !== "bendahara") {
    alert("Hanya bendahara yang boleh input");
    return;
  }

  const tgl    = document.getElementById("tgl").value;
  const ket    = document.getElementById("ket").value;
  const masuk  = document.getElementById("masuk").value || 0;
  const keluar = document.getElementById("keluar").value || 0;
  const foto   = document.getElementById("foto").files[0];

  if (!tgl || !ket) {
    alert("Tanggal dan keterangan wajib diisi");
    return;
  }

  if (foto) {
    const reader = new FileReader();
    reader.onload = function () {
      kirimKeSheet(tgl, ket, masuk, keluar, reader.result);
    };
    reader.readAsDataURL(foto);
  } else {
    kirimKeSheet(tgl, ket, masuk, keluar, "");
  }
}

/* =============================
   KIRIM KE GOOGLE SCRIPT
============================= */
function kirimKeSheet(tgl, ket, masuk, keluar, fotoBase64) {

  const data =
    "tgl="    + encodeURIComponent(tgl) +
    "&ket="   + encodeURIComponent(ket) +
    "&masuk=" + encodeURIComponent(masuk) +
    "&keluar="+ encodeURIComponent(keluar) +
    "&foto="  + encodeURIComponent(fotoBase64);

  fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data
  });

  alert("Data dikirim ke Google Sheet");

  // reset form
  document.getElementById("tgl").value = "";
  document.getElementById("ket").value = "";
  document.getElementById("masuk").value = "";
  document.getElementById("keluar").value = "";
  document.getElementById("foto").value = "";

  // reload setelah kirim
  setTimeout(() => {
    location.reload();
  }, 1500);
}
