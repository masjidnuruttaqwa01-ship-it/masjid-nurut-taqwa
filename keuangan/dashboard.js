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
     <div class="item">
       <div>
         <b>${ket}</b>
         <small>${tgl.split("T")[0]}</small>
         ${foto?`<img src="${foto}">`:""}
       </div>
       <div>
         <b>${m?"+Rp "+m.toLocaleString():"-Rp "+k.toLocaleString()}</b>
       </div>
     </div>`;
   });

   const saldo = masuk - keluar;
   document.getElementById("list").innerHTML = html;
   document.getElementById("saldo").innerText = "Rp " + saldo.toLocaleString();
   document.getElementById("masuk").innerText = "Rp " + masuk.toLocaleString();
   document.getElementById("keluar").innerText = "Rp " + keluar.toLocaleString();
   document.getElementById("jumlah").innerText = data.length;
 });
}

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

load();
