const API = "https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

if(localStorage.getItem("login")!=="true") location="login.html";

if(localStorage.getItem("role")==="anggota"){
 document.getElementById("form").style.display="none";
}

function load(){
 fetch(API)
 .then(r=>r.json())
 .then(d=>{
  let html="",saldo=0,masuk=0,keluar=0;
  d.forEach((r,i)=>{
   saldo=r.saldo;
   masuk+=Number(r.masuk);
   keluar+=Number(r.keluar);
   html+=`<tr>
   <td>${r.tgl}</td><td>${r.ket}</td>
   <td>${r.masuk||"-"} ${r.keluar? "-"+r.keluar:""}</td>
   <td>${r.foto?`<a href="${r.foto}" target="_blank">📷</a>`:""}</td>
   <td><button onclick="hapus(${i})">🗑</button></td></tr>`;
  });
  list.innerHTML=html;
  saldo.innerText="Rp "+saldo;
  masuk.innerText="Rp "+masuk;
  keluar.innerText="Rp "+keluar;
 });
}

function simpan(){
 if(localStorage.getItem("role")!=="bendahara"){alert("No akses");return;}

 const fd=new FormData();
 fd.append("tgl",tgl.value);
 fd.append("ket",ket.value);
 fd.append("masuk",masukIn.value);
 fd.append("keluar",keluarIn.value);
 if(foto.files[0]){
  const r=new FileReader();
  r.onload=()=>{fd.append("foto",r.result);kirim(fd);}
  r.readAsDataURL(foto.files[0]);
 } else kirim(fd);
}

function kirim(fd){
 fetch(API,{method:"POST",body:fd})
 .then(()=>{load();});
}

function hapus(i){
 fetch(API+"?hapus="+i).then(()=>load());
}

function logout(){
 localStorage.clear();
 location="login.html";
}

load();
