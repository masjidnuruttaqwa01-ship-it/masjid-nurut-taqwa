const API = "https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

function load(){
 fetch(API)
  .then(r=>r.json())
  .then(data=>{

    let html = "";
    let totalMasuk = 0;
    let totalKeluar = 0;

    data.reverse().forEach((r,i)=>{

      const tgl    = r[0];
      const ket    = r[1];
      const masuk  = Number(r[2] || 0);
      const keluar = Number(r[3] || 0);
      const foto   = r[4] || "";

      totalMasuk += masuk;
      totalKeluar += keluar;

      html += `
      <div class="row">
        <div class="left">
          <b>${ket}</b>
          <small>${tgl.split("T")[0]}</small>
          ${foto ? `<img src="${foto}" style="width:60px;border-radius:8px;margin-top:6px">` : ""}
        </div>
        <div class="right">
          <b>${masuk ? "+Rp "+masuk.toLocaleString() : "-Rp "+keluar.toLocaleString()}</b><br>
        </div>
      </div>`;
    });

    const saldo = totalMasuk - totalKeluar;

    document.getElementById("list").innerHTML = html;
    document.getElementById("saldo").innerText = "Rp " + saldo.toLocaleString();
    document.getElementById("jumlah").innerText = data.length;
    document.getElementById("masuk").innerText = "Rp " + totalMasuk.toLocaleString();
    document.getElementById("keluar").innerText = "Rp " + totalKeluar.toLocaleString();
 });
}

/* ================== SIMPAN =================== */
function simpan(){
 const fd = new FormData();
 fd.append("tgl", tgl.value);
 fd.append("ket", ket.value);
 fd.append("masuk", masukInput.value || 0);
 fd.append("keluar", keluarInput.value || 0);

 const file = foto.files[0];
 if(file){
   const r = new FileReader();
   r.onload = ()=>{
     fd.append("foto", r.result);
     kirim(fd);
   }
   r.readAsDataURL(file);
 } else {
   kirim(fd);
 }
}

function kirim(fd){
 fetch(API,{method:"POST",body:fd})
 .then(r=>r.json())
 .then(res=>{
   alert("Tersimpan");
   load();
 });
}

/* ================== LOGOUT =================== */
function logout(){
 localStorage.clear();
 location="login.html";
}

load();
