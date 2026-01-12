const API = "https://script.google.com/macros/s/AKfycbz2fHNtKgcbtT_q5TtX33XZRbji30T0Cen7DldaAJi5PW5t3LB2b5ojYSYDPZF1EJkM/exec";

const role = localStorage.getItem("role") || "anggota";
if(role === "anggota") document.getElementById("formInput").style.display="none";

function load(){
  fetch(API)
  .then(r=>r.json())
  .then(data=>{
    let saldo=0, masuk=0, keluar=0;
    let html="";

    data.forEach((r,i)=>{
      saldo = r.saldo;
      masuk += Number(r.masuk);
      keluar += Number(r.keluar);

      html += `
        <div class="item">
          <b>${r.tanggal}</b><br>
          ${r.ket}<br>
          ${r.masuk ? "Rp "+r.masuk : "- Rp "+r.keluar}<br>
          ${r.foto ? `<a href="${r.foto}" target="_blank">📷</a>` : ""}
          ${role==="bendahara"?`<button onclick="hapus(${r.id})">🗑</button>`:""}
        </div>`;
    });

    document.getElementById("list").innerHTML = html;
    saldo.innerText="Rp "+saldo;
    masukTotal.innerText="Rp "+masuk;
    keluarTotal.innerText="Rp "+keluar;
    jumlah.innerText=data.length;
  });
}

function simpan(){
  const f = new FormData();
  f.append("tgl",tgl.value);
  f.append("ket",ket.value);
  f.append("masuk",masuk.value);
  f.append("keluar",keluar.value);

  if(foto.files[0]){
    const r=new FileReader();
    r.onload=()=>{f.append("foto",r.result); kirim(f);}
    r.readAsDataURL(foto.files[0]);
  } else kirim(f);
}

function kirim(f){
  fetch(API,{method:"POST",body:f})
  .then(()=>{alert("Tersimpan"); load();});
}

function hapus(id){
  if(!confirm("Hapus transaksi ini?")) return;
  fetch(API+"?hapus="+id)
  .then(()=>load());
}

function logout(){
  localStorage.clear();
  location="login.html";
}

load();
