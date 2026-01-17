/* ================= SUPABASE CONFIG ================= */
const SUPABASE_URL = "https://xntiicnhmhgpujeekmxt.supabase.co";
const SUPABASE_KEY = "PASTE_ANON_PUBLIC_KEY_KAMU_DI_SINI";

/* ================= ROLE ================= */
const role = localStorage.getItem("role") || "publik";

/* ================= MODE LABEL ================= */
const modeLabel = document.getElementById("modeLabel");
if (modeLabel) {
  if (role === "bendahara") {
    modeLabel.innerText = "Mode DKM";
    modeLabel.style.background = "#0f766e";
    modeLabel.style.color = "#fff";
  } else {
    modeLabel.innerText = "Publik";
  }
}

/* ================= FORM ACCESS ================= */
if (role !== "bendahara") {
  const f = document.getElementById("form");
  if (f) f.style.display = "none";
}

/* ================= LOAD DATA ================= */
async function load() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/kas?select=*&order=id.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );

  const rows = await res.json();

  let html = "";
  let masuk = 0,
    keluar = 0,
    saldo = 0;

  rows.forEach((r) => {
    const tgl = r.tanggal;
    const ket = r.keterangan;
    const m = Number(r.masuk || 0);
    const k = Number(r.keluar || 0);

    masuk += m;
    keluar += k;
    saldo += m - k;

    html += `
      <div class="row">
        <div class="left">
          <b>${ket}</b>
          <small>${tgl}</small>
        </div>
        <div class="right">
          <b>${m ? "+Rp " + m.toLocaleString() : "-Rp " + k.toLocaleString()}</b>
        </div>
      </div>`;
  });

  document.getElementById("list").innerHTML = html;
  document.getElementById("saldo").innerText = "Rp " + saldo.toLocaleString();
  document.getElementById("masuk").innerText = "Rp " + masuk.toLocaleString();
  document.getElementById("keluar").innerText = "Rp " + keluar.toLocaleString();
  document.getElementById("jumlah").innerText = rows.length;
}

/* ================= SIMPAN ================= */
async function simpan() {
  if (role !== "bendahara") {
    alert("Hanya Bendahara boleh input");
    return;
  }

  const data = {
    tanggal: tgl.value,
    keterangan: ket.value,
    masuk: Number(masukInput.value || 0),
    keluar: Number(keluarInput.value || 0),
  };

  if (!data.tanggal || !data.keterangan) {
    alert("Tanggal & keterangan wajib diisi");
    return;
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/kas`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.error(await res.text());
    alert("Gagal simpan");
    return;
  }

  alert("✅ Transaksi tersimpan");
  load();
}

/* ================= LOGOUT ================= */
function logout() {
  localStorage.clear();
  location = "login.html";
}

/* ================= INIT ================= */
load();
