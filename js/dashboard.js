let data = JSON.parse(localStorage.getItem("transaksi")||"[]");

function logout(){
  localStorage.removeItem("login");
  location.href="login.html";
}

function simpan(){
  const tgl = document.getElementById("tgl").value;
  const ket = document.getElementById("ket").value;
  const masuk = document.getElementById("masuk").value;
  const keluar = document.getElementById("keluar").value;
  const file = document.getElementById("bukti").files[0];

  if(!tgl || !ket){
    alert("Lengkapi data");
    return;
  }

  if(file){
    const r = new FileReader();
    r.onload = ()=>{
      data.push({tgl,ket,masuk,keluar,foto:r.result});
      localStorage.setItem("transaksi",JSON.stringify(data));
      tampil();
    }
    r.readAsDataURL(file);
  } else {
    data.push({tgl,ket,masuk,keluar});
    localStorage.setItem("transaksi",JSON.stringify(data));
    tampil();
  }
}

function tampil(){
  let saldo=0, m=0, k=0, html="";

  data.forEach(x=>{
    const mi=parseInt(x.masuk||0);
    const ke=parseInt(x.keluar||0);
    saldo+=mi-ke; m+=mi; k+=ke;

    html+=`<tr>
      <td>${x.tgl}</td>
      <td>${x.ket}</td>
      <td>${mi? "Rp "+mi.toLocaleString():"-"}</td>
      <td>${ke? "Rp "+ke.toLocaleString():"-"}</td>
      <td>${x.foto?`<img src="${x.foto}">`:"-"}</td>
    </tr>`;
  });

  document.getElementById("tabel").innerHTML=html;
  saldoEl.innerText="Rp "+saldo.toLocaleString();
  masukTotal.innerText="Rp "+m.toLocaleString();
  keluarTotal.innerText="Rp "+k.toLocaleString();
}

const saldoEl=document.getElementById("saldo");
const masukTotal=document.getElementById("masukTotal");
const keluarTotal=document.getElementById("keluarTotal");

tampil();
