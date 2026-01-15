const role = localStorage.getItem("role") || "publik";
const modeLabel = document.getElementById("modeLabel");

if(role === "bendahara"){
  modeLabel.innerText = "Mode DKM";
  modeLabel.style.background = "#0f766e";
  modeLabel.style.color = "#fff";
}else{
  modeLabel.innerText = "Publik";
}
const API="https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

if(localStorage.getItem("login")!=="true"){
 location="login.html";
}

const role=localStorage.getItem("role");
if(role==="anggota"){
 if(role === "bendahara"){
  document.getElementById("form").style.display = "block";
}else{
  document.getElementById("form").style.display = "none";
}
}

function logout(){
 localStorage.clear();
 location="login.html";
}
const API_URL = "https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

function load(){
 fetch(API).then(r=>r.json()).then(d=>{
  let html="", saldo=0;
  d.forEach(x=>{
   saldo = x.saldo;
   html+=`
    <div class="item">
      <b>${x.tanggal}</b><br>
      ${x.ket}<br>
      ${x.masuk?"Rp "+x.masuk:""} ${x.keluar?"- Rp "+x.keluar:""}<br>
      ${x.foto?`<a href="${x.foto}" target="_blank">📷</a>`:""}
      ${role==="bendahara"?`<button onclick="hapus(${x.id})">🗑</button>`:""}
    </div>
   `;
 fetch(API_URL)
  .then(r=>r.json())
  .then(rows=>{
    let saldo=0,m=0,k=0,html="";
    rows.forEach(r=>{
      saldo=r[4];
      m+=Number(r[2]);
      k+=Number(r[3]);
      html+=`
      <div class="card">
        <b>${r[1]}</b><br>
        ${r[0]}<br>
        Rp ${r[2]} / Rp ${r[3]}<br>
        ${r[5]?`<img src="${r[5]}">`:""}
      </div>`;
    });
    saldoEl.innerText=saldo;
    masuk.innerText=m;
    keluar.innerText=k;
    list.innerHTML=html;
  });
  list.innerHTML=html;
  saldo.innerText="Rp "+saldo;
 });
}

function simpan(){
 const fd = new FormData();
 fd.append("tgl", tgl.value);
 fd.append("ket", ket.value);
 fd.append("masuk", masukInput.value);
 fd.append("keluar", keluarInput.value);

 const file = foto.files[0];
 if(file){
   const r = new FileReader();
   r.onload=()=>{
     fd.append("foto",r.result);
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
 .then(x=>{
   alert("Tersimpan di Spreadsheet");
   load();
 });
}
 fd.append("masuk",masukInput.value);
 fd.append("keluar",keluarInput.value);

 const f=foto.files[0];
 if(f){
  const r=new FileReader();
  r.onload=()=>{
    fd.append("foto",r.result);
    kirim(fd);
  }
  r.readAsDataURL(f);
 } else kirim(fd);
}

function hapus(id){
 if(!confirm("Hapus transaksi?"))return;
 fetch(API+"?delete="+id).then(()=>load());
function kirim(fd){
 fetch(API_URL,{method:"POST",body:fd})
 .then(r=>r.json())
 .then(d=>{
  if(d.status=="ok"){ alert("Tersimpan"); load(); }
  else alert(d.message);
 });
}

load();
  function load(){
 fetch(API)
 .then(r=>r.json())
 .then(data=>{
   let html="";
   let masuk=0, keluar=0, saldo=0;

   data.reverse().forEach(r=>{
     const tgl = r[0];
     const ket = r[1];
     const m   = Number(r[2]);
     const k   = Number(r[3]);
     const s   = Number(r[4]);
     const foto= r[5];

     masuk+=m; keluar+=k; saldo=s;

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

   list.innerHTML = html;
   document.getElementById("saldo").innerText="Rp "+saldo.toLocaleString();
   document.getElementById("masuk").innerText="Rp "+masuk.toLocaleString();
   document.getElementById("keluar").innerText="Rp "+keluar.toLocaleString();
   document.getElementById("jumlah").innerText=data.length;
 });
  }
