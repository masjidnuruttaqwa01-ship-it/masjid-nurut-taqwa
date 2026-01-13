const API = "https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

function load(){
 fetch(API).then(r=>r.json()).then(data=>{
   let html="";
   let saldo=0, masuk=0, keluar=0;

   data.reverse().forEach(r=>{
     saldo = r.saldo;
     masuk += r.masuk;
     keluar += r.keluar;

     html+=`
     <div class="row">
       <div class="left">
         <b>${r.ket}</b>
         <small>${r.tgl}</small>
         ${r.foto?`<img src="${r.foto}">`:""}
       </div>
       <div class="right">
         <b>${r.masuk?"+Rp "+r.masuk:"-Rp "+r.keluar}</b><br>
         <button class="delete" onclick="hapus(${r.id})">🗑</button>
       </div>
     </div>`;
   });

   document.getElementById("list").innerHTML = html;
   document.getElementById("saldo").innerText = "Rp "+saldo;
   document.getElementById("jumlah").innerText = data.length;
   document.getElementById("masuk").innerText = "Rp "+masuk;
   document.getElementById("keluar").innerText = "Rp "+keluar;
 });
}

function simpan(){
 const fd = new FormData();
 fd.append("tgl",tgl.value);
 fd.append("ket",ket.value);
 fd.append("masuk",masukInput.value);
 fd.append("keluar",keluarInput.value);

 const file = foto.files[0];
 if(file){
   const r = new FileReader();
   r.onload = ()=>{ fd.append("foto",r.result); kirim(fd); }
   r.readAsDataURL(file);
 } else kirim(fd);
}

function kirim(fd){
 fetch(API,{method:"POST",body:fd})
 .then(r=>r.json())
 .then(x=>{
   alert("Tersimpan");
   load();
 });
}

function hapus(id){
 if(!confirm("Hapus transaksi?"))return;
 fetch(API+"?id="+id,{method:"DELETE"})
 .then(()=>load());
}

function logout(){
 localStorage.clear();
 location="login.html";
}

load();
