const role = localStorage.getItem("role") || "publik";
const API = "https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

function load(){
 fetch(API).then(r=>r.json()).then(data=>{
   let html="";
   let masuk=0, keluar=0;

   data.reverse().forEach(r=>{
     const tgl = r[0];
     const ket = r[1];
     const m = Number(r[2]||0);
     const k = Number(r[3]||0);
     const foto = r[4]||"";

     masuk += m;
     keluar += k;

     html += `
<div class="row">
  <div class="left">
    <b>${ket}</b>
    <small>${tgl}</small>
    ${ foto ? `<img src="${foto}" onclick="preview('${foto}')">` : "" }
  </div>
</div>
`;

   const saldo = masuk - keluar;
   document.getElementById("list").innerHTML = html;
   document.getElementById("saldo").innerText = "Rp " + saldo.toLocaleString();
   document.getElementById("masuk").innerText = "Rp " + masuk.toLocaleString();
   document.getElementById("keluar").innerText = "Rp " + keluar.toLocaleString();
   document.getElementById("jumlah").innerText = data.length;
 });
}

function simpan(){

  if(role !== "dkm"){
    alert("Akses ditolak. Hanya DKM yang boleh input.");
    return;
  }
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
 }else{
   kirim(fd);
 }
}

function kirim(fd){
 fetch(API,{method:"POST",body:fd})
 .then(r=>r.json())
 .then(x=>{
   alert("Tersimpan");
   toggleForm();
   load();
 });
}

function toggleForm(){
 document.getElementById("form").classList.toggle("hide");
}

function logout(){
 localStorage.clear();
 location="login.html";
}
// ==== MODE PUBLIK & DKM ====
if(role === "publik"){
  const form = document.getElementById("form");
  const addBtn = document.getElementById("addBtn"); // tombol +

  if(form) form.style.display = "none";
  if(addBtn) addBtn.style.display = "none";
}
load();
