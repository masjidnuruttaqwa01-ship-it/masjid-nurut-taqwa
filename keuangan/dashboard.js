const API = "https://script.google.com/macros/s/AKfycbz2fHNtKgcbtT_q5TtX33XZRbji30T0Cen7DldaAJi5PW5t3LB2b5ojYSYDPZF1EJkM/exec";

if(localStorage.getItem("login")!=="true"){
 location="login.html";
}

const role = localStorage.getItem("role") || "anggota";
if(role==="anggota"){
 document.getElementById("formInput").style.display="none";
}

function load(){
 fetch(API).then(r=>r.json()).then(d=>{
  let html="";
  let saldo=0, masuk=0, keluar=0;
  let todayIn=0,todayOut=0;
  const today=new Date().toISOString().slice(0,10);

  d.forEach(x=>{
   saldo=x.saldo;
   masuk+=Number(x.masuk);
   keluar+=Number(x.keluar);

   if(x.tanggal===today){
    todayIn+=Number(x.masuk);
    todayOut+=Number(x.keluar);
   }

   html+=`
    <div>
     ${x.tanggal}<br>
     <b>${x.ket}</b><br>
     <span style="color:green">+Rp ${x.masuk}</span>
     <span style="color:red">-Rp ${x.keluar}</span><br>
     <a href="${x.foto}" target="_blank">📷 Lihat Bukti</a>
    </div>`;
  });

  list.innerHTML=html;
  document.getElementById("saldo").innerText="Rp "+saldo;
  document.getElementById("masuk").innerText="Rp "+masuk;
  document.getElementById("keluar").innerText="Rp "+keluar;
  document.getElementById("today").innerText="Hari ini +Rp "+todayIn+" | -Rp "+todayOut;
 });
}

load();

function simpan(){
 if(role!=="bendahara"){
  alert("Hanya bendahara");
  return;
 }

 const fd=new FormData();
 fd.append("tgl",tgl.value);
 fd.append("ket",ket.value);
 fd.append("masuk",masukInput.value);
 fd.append("keluar",keluarInput.value);
 if(foto.files[0]) fd.append("foto",foto.files[0]);

 fetch(API,{method:"POST",body:fd})
 .then(r=>r.text())
 .then(x=>{
  alert("Tersimpan");
  load();
 });
}

function logout(){
 localStorage.clear();
 location="login.html";
}
