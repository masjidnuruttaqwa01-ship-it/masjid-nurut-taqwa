const API_URL = "https://script.google.com/macros/s/AKfycbytLyuCvtaHnCE_2Z3TxcegAnE1YtZkNoK7uYtQe5GOSFYaPUjr8KbuTdy5fb4J6Ysz/exec";

function load(){
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
}

function simpan(){
 const fd=new FormData();
 fd.append("tgl",tgl.value);
 fd.append("ket",ket.value);
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

function kirim(fd){
 fetch(API_URL,{method:"POST",body:fd})
 .then(r=>r.json())
 .then(d=>{
  if(d.status=="ok"){ alert("Tersimpan"); load(); }
  else alert(d.message);
 });
}

load();
