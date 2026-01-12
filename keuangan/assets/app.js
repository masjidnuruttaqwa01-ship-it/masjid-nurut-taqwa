const API="https://script.google.com/macros/s/AKfycbz2fHNtKgcbtT_q5TtX33XZRbji30T0Cen7DldaAJi5PW5t3LB2b5ojYSYDPZF1EJkM/exec";

const list=document.getElementById("list");
const saldoBox=document.getElementById("saldoBox");

function load(){
 fetch(API)
 .then(r=>r.json())
 .then(rows=>{
  let saldo=0,html="";
  rows.forEach((r,i)=>{
    saldo=r[4];
    html+=`
    <tr>
      <td>${r[0]}</td>
      <td>${r[1]}</td>
      <td>${r[2]}</td>
      <td>${r[3]}</td>
      <td>${r[5]?`<a href="${r[5]}" target="_blank">📷</a>`:"-"}</td>
      <td><button onclick="hapus(${i+2})">❌</button></td>
    </tr>`;
  });
  list.innerHTML=html;
  saldoBox.innerText="Rp "+saldo;
 });
}

function simpan(){
 const tgl=document.getElementById("tgl").value;
 const ket=document.getElementById("ket").value;
 const masuk=document.getElementById("masuk").value;
 const keluar=document.getElementById("keluar").value;
 const foto=document.getElementById("foto").files[0];

 if(!tgl||!ket){alert("Lengkapi data");return;}

 if(foto){
  const r=new FileReader();
  r.onload=()=>kirim(r.result);
  r.readAsDataURL(foto);
 }else{
  kirim("");
 }
}

function kirim(foto){
 const body=`tgl=${tgl.value}&ket=${ket.value}&masuk=${masuk.value}&keluar=${keluar.value}&foto=${encodeURIComponent(foto)}`;
 fetch(API,{
  method:"POST",
  headers:{"Content-Type":"application/x-www-form-urlencoded"},
  body
 }).then(()=>load());
}

function hapus(r){
 fetch(API,{
  method:"POST",
  headers:{"Content-Type":"application/x-www-form-urlencoded"},
  body:"action=delete&row="+r
 }).then(()=>load());
}

function logout(){
 localStorage.clear();
 location="../login.html";
}

load();
