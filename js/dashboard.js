const API="https://script.google.com/macros/s/AKfycbz2fHNtKgcbtT_q5TtX33XZRbji30T0Cen7DldaAJi5PW5t3LB2b5ojYSYDPZF1EJkM/exec";

function loadData(){
fetch(API)
.then(r=>r.json())
.then(data=>{
 let html="";
 let saldo=0;
 data.forEach((r,i)=>{
  saldo=r[4];
  html+=`<tr>
    <td>${r[0]}</td>
    <td>${r[1]}</td>
    <td>${r[2]-r[3]}</td>
    <td>${r[5]?`<a href="${r[5]}" target="_blank">📷</a>`:"-"}</td>
    <td><button onclick="hapus(${i+2})">❌</button></td>
  </tr>`;
 });
 list.innerHTML=html;
 saldoBox.innerText=saldo;
 jumlahBox.innerText=data.length;
});
}

function simpan(){
const reader=new FileReader();
const foto=fotoInput.files[0];

reader.onload=()=>kirim(reader.result);
if(foto) reader.readAsDataURL(foto); else kirim("");

function kirim(foto64){
const body=
`tgl=${tglInput.value}&ket=${ketInput.value}&masuk=${masukInput.value}&keluar=${keluarInput.value}&foto=${encodeURIComponent(foto64)}`;

fetch(API,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body})
.then(r=>r.json()).then(()=>loadData());
}
}

function hapus(row){
fetch(API,{
 method:"POST",
 headers:{"Content-Type":"application/x-www-form-urlencoded"},
 body:"action=delete&row="+row
}).then(()=>loadData());
}

const tglInput=document.getElementById("tgl");
const ketInput=document.getElementById("ket");
const masukInput=document.getElementById("masuk");
const keluarInput=document.getElementById("keluar");
const fotoInput=document.getElementById("foto");
const list=document.getElementById("list");
const saldoBox=document.getElementById("saldo");
const jumlahBox=document.getElementById("jumlah");

loadData();
