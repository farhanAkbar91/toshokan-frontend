# 🎨 Toshokan Frontend Application

Antarmuka web interaktif berbasis Single Page Application (SPA) untuk Sistem Informasi Perpustakaan Digital Toshokan. Dibangun menggunakan **React.js**, **Vite**, dan **Tailwind CSS v4**.

---

## 🛠️ Desain Arsitektur: Atomic Design

Kode program antarmuka disusun secara modular mengikuti metodologi **Atomic Design** untuk mempermudah pemeliharaan dan penggunaan kembali komponen:

```bash
src/components/
├── atoms/          # Komponen dasar yang berdiri sendiri (tidak bergantung komponen lain)
│   ├── Badge.jsx   # Label status (aktif, selesai, tidak aktif, denda)
│   ├── Button.jsx  # Tombol dengan varian warna dan animasi
│   ├── Input.jsx   # Form input teks terstandardisasi
│   └── Select.jsx  # Dropdown pilihan data kategori/anggota
│
├── molecules/      # Gabungan dari beberapa komponen atoms
│   ├── FormField.jsx   # Input field lengkap dengan label dan label error
│   ├── StatCard.jsx    # Kartu penampil metrik ringkasan di dashboard
│   └── Toast.jsx       # Alert notifikasi pop-up mengambang
│
├── organisms/      # Komponen kompleks yang berinteraksi langsung dengan data/operasi
│   ├── Sidebar.jsx          # Panel navigasi kiri (dinamis sesuai role pengguna)
│   ├── BookFormModal.jsx    # Modal form tambah/edit buku
│   ├── LoanFormModal.jsx    # Modal checkout peminjaman oleh pustakawan
│   └── MemberFormModal.jsx  # Modal input data anggota baru
│
└── templates/      # Kerangka layout utama halaman
    └── Layout.jsx  # Menggabungkan Sidebar dan kontainer konten halaman
```

---

## 🧭 Halaman Aplikasi (`src/pages`)

*   **📈 Dashboard (Admin):** Ringkasan metrik (total buku, transaksi aktif, antrean) dan grafik log transaksi sirkulasi terbaru.
*   **📚 Books (Admin & Member):** Katalog pencarian buku. Admin dapat melakukan manipulasi CRUD penuh, sementara Anggota hanya melihat informasi stok dan tombol *Ajukan Peminjaman*.
*   **👥 Members (Admin):** Daftar anggota dengan tab pemisah khusus pendaftaran mandiri yang membutuhkan tindakan persetujuan (*approval*).
*   **🔄 Circulation (Admin):** Pengendali sirkulasi berjalan, antrean pinjaman anggota, pelunasan denda tunai, dan proses pengembalian buku.
*   **📋 Reports (Admin):** Penyusun laporan transaksi sirkulasi dengan filter rentang tanggal, ringkasan kalkulasi keuangan denda, serta tata letak ramah cetak.
*   **📥 MyLoans (Anggota):** Halaman pemantauan peminjaman buku aktif, status pengajuan, serta informasi denda berjalan khusus untuk anggota terkait.

---

## ⚙️ Pengembangan Lokal (Development)

Untuk menjalankan server pengembangan lokal:

```bash
# Masuk ke direktori frontend
cd toshokan-frontend

# Instal dependensi proyek
npm install

# Jalankan server lokal Vite
npm run dev
```

Server lokal akan berjalan di `http://localhost:5173`. Request ke `/api/*` secara otomatis diproksikan ke server backend Node.js (`http://localhost:3000`) sesuai pengaturan di `vite.config.js`.

---

## 🚀 Pengaturan Hosting Produksi (Vercel)

Saat dideploy di platform hosting **Vercel**, Vite proxy tidak berjalan karena berkas diunggah sebagai aset statis. Oleh karena itu, berkas `vercel.json` disediakan di root direktori frontend untuk mengalihkan rute pemanggilan API secara langsung di tingkat server CDN Vercel:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://toshokan-backend.onrender.com/api/:path*"
    }
  ]
}
```

> **Catatan:** Pastikan Anda menyunting destinasi URL tersebut apabila URL backend peladen Render Anda mengalami perubahan.
