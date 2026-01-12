const API="https://script.google.com/macros/s/AKfycbz2fHNtKgcbtT_q5TtX33XZRbji30T0Cen7DldaAJi5PW5t3LB2b5ojYSYDPZF1EJkM/exec";

function load(){
 fetch(API).then(r=>r.json()).then(rows=>{
  let saldo=0, html="";
  rows.forEach((r,i)=>{
   saldo=r[4];
   html+=`
   <tr>
    <td>${r[0]}</td>
    <td>${r[1]}</td>
    <td>${r[2]-r[3]}</td>
    <td>${r[5]?`<a href="${r[5]}" target="_blank">📷</a>`:"-"}</td>
    <td><button onclick="hapus(${i+2})">❌</button></td>
   </tr>`;
  });
  list.innerHTML=html;
  saldoBox.innerText="Rp "+saldo.toLocaleString();
 });
}

function simpan(){
 const f=new FileReader();
 const foto=fotoInput.files[0];
 if(foto) f.readAsDataURL(foto);
 f.onload=()=>kirim(f.result);
 if(!foto) kirim("");
}

function kirim(foto64){
 const body=`tgl=${tgl.value}&ket=${ket.value}&masuk=${masuk.value}&keluar=${keluar.value}&foto=${encodeURIComponent(foto64)}`;
 fetch(API,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body})
 .then(()=>load());
}

function hapus(r){
 fetch(API,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"action=delete&row="+r})
 .then(()=>load());
}
