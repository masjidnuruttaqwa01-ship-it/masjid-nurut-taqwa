const API="https://script.google.com/macros/s/AKfycbz2fHNtKgcbtT_q5TtX33XZRbji30T0Cen7DldaAJi5PW5t3LB2b5ojYSYDPZF1EJkM/exec";

if(localStorage.getItem("login")!=="true"){
 location="login.html";
}

const role=localStorage.getItem("role");
if(role==="anggota"){
 document.getElementById("form").style.display="none";
}

function logout(){
 localStorage.clear();
 location="login.html";
}

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
  });
  list.innerHTML=html;
  saldo.innerText="Rp "+saldo;
 });
}

function simpan(){
 const fd=new FormData();
 fd.append("tgl",tgl.value);
 fd.append("ket",ket.value);
 fd.append("masuk",masuk.value);
 fd.append("keluar",keluar.value);
 fd.append("foto",foto.files[0]);

 fetch(API,{method:"POST",body:fd})
 .then(r=>r.text())
 .then(()=>{
  alert("Tersimpan");
  load();
 });
}

function hapus(id){
 if(!confirm("Hapus transaksi?"))return;
 fetch(API+"?delete="+id).then(()=>load());
}

load();
