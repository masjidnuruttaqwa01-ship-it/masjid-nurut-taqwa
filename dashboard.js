const API = "https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

/* ===== ROLE ===== */
const role = localStorage.getItem("role") || "publik";

/* ===== MODE LABEL ===== */
const modeLabel = document.getElementById("modeLabel");
if(modeLabel){
  if(role === "bendahara"){
    modeLabel.innerText = "Mode DKM";
    modeLabel.style.background="#0f766e";
    modeLabel.style.color="#fff";
  } else {
    modeLabel.innerText="Publik";
  }
}

/* ===== FORM ACCESS ===== */
if(role !== "bendahara"){
  const f = document.getElementById("form");
  if(f) f.style.display="none";
}

/* ===== LOAD DATA FROM GOOGLE SHEET ===== */
function load(){
 fetch(API)
 .then(r=>r.json())
 .then(rows=>{
   let html="";
   let masuk=0, keluar=0, saldo=0;

   rows.reverse().forEach(r=>{
     const tgl   = r[0];
     const ket   = r[1];
     const m     = Number(r[2]||0);
     const k     = Number(r[3]||0);
     const s     = Number(r[4]||0);
     const foto  = r[5];

     masuk+=m;
     keluar+=k;
     saldo=s;

     html+=`
     <div class="row">
       <div class="left">
         <b>${ket}</b>
         <small>${tgl}</small>
         ${foto?`<img src="${foto}">`:""}
       </div>
       <div class="right">
         <b>${m?"+Rp "+m.toLocaleString():"-Rp "+k.toLocaleString()}</b>
       </div>
     </div>`;
   });

   document.getElementById("list").innerHTML = html;
   document.getElementById("saldo").innerText = "Rp "+saldo.toLocaleString();
   document.getElementById("masuk").innerText = "Rp "+masuk.toLocaleString();
   document.getElementById("keluar").innerText = "Rp "+keluar.toLocaleString();
   document.getElementById("jumlah").innerText = rows.length;
 });
}

/* ===== SIMPAN KE GOOGLE SHEET ===== */
function simpan(){
 if(role !== "bendahara"){
   alert("Hanya Bendahara boleh input");
   return;
 }

 const fd = new FormData();
 fd.append("tgl", tgl.value);
 fd.append("ket", ket.value);
 fd.append("masuk", masukInput.value||0);
 fd.append("keluar", keluarInput.value||0);

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

/* ===== KIRIM KE APPS SCRIPT ===== */
function kirim(fd){
 fetch(API,{method:"POST",body:fd})
 .then(r=>r.json())
 .then(d=>{
   alert("Tersimpan ke Spreadsheet");
   load();
 });
}

/* ===== LOGOUT ===== */
function logout(){
 localStorage.clear();
 location="login.html";
}

load();
