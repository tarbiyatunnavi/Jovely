Saya ingin kamu membantu saya merancang dan membangun sebuah aplikasi bernama **Jovely**.

## 1. Konsep Produk

Jovely adalah aplikasi self-assessment kesiapan menikah yang dikemas dengan gamifikasi ala Duolingo — bukan kuesioner kaku, tapi pengalaman seperti main game yang tetap menghasilkan hasil psikometri yang bermakna di akhir.

Aplikasi ini punya **2 modul berurutan**:

1. **Modul Cinta Romantis** — dikerjakan **lebih dulu**. Ini adalah modul eksploratif/reflektif tentang bagaimana pengguna memandang dan memaknai cinta romantis (bukan tes benar-salah, lebih ke self-discovery gaya cinta).
2. **Modul Kesiapan Menikah** — dikerjakan **setelah** Modul Cinta Romantis selesai semua. Ini modul utama yang menghasilkan skor psikometri kesiapan menikah.

Target pengguna: dewasa muda Indonesia (18 tahun ke atas), belum menikah.

## 2. Branding

- Nama aplikasi: **Jovely**
- Palet warna: dominan **putih** dengan aksen **soft lylac/lilac** (ungu pastel lembut) — nuansa clean, calming, ramah, dan sedikit playful, cocok untuk topik yang cukup personal/sensitif seperti cinta dan kesiapan menikah.
- Tone bahasa di seluruh UI: gaya **Gen Z**, santai, mudah dipahami, tidak terasa seperti kuesioner akademik/klinis. Hindari istilah psikologi yang berat tanpa penjelasan sederhana.

## 3. Alur & Fitur Aplikasi

### 3.1 Autentikasi
- **Daftar akun**: nama, usia, jenis kelamin, nomor HP, password.
- **Login**: hanya nomor HP + password.
- **Lupa password**: alur reset password (misalnya via OTP nomor HP atau link/kode reset — silakan usulkan mekanisme paling praktis untuk MVP).

### 3.2 Fitur Utama — Peta Level (seperti skill tree Duolingo)
- Tampilan peta jalur level berurutan. **Modul Cinta Romantis (12 level) harus diselesaikan lebih dulu**, baru setelah itu **Modul Kesiapan Menikah (8 level) terbuka** dan bisa dikerjakan.
- Masing-masing level mewakili satu dimensi psikologis (rincian lengkap di bagian 4). Khusus level-level di Modul Cinta Romantis, bentuk jawaban tiap item adalah pilihan sederhana **Setuju / Tidak Setuju** (bukan skala 5 poin) — boleh dibungkus jadi interaksi game seperti swipe kiri-kanan, tap kartu, dsb. Level-level di Modul Kesiapan Menikah tetap pakai skala Likert 5 poin.
- Setiap level punya **mekanik game yang berbeda-beda** supaya tidak monoton — misalnya tebak gambar/skenario, mini story-telling dengan pilihan cabang, drag-and-drop, true/false cepat, dsb. Kamu boleh mengusulkan mekanik yang paling cocok untuk tiap dimensi, tapi tiap level tetap harus memuat semua item pertanyaan dimensi tersebut (dengan makna yang sama, hanya dibungkus dalam bentuk game).
- Progress bar, XP/poin, dan sedikit reward visual (badge/emoji/animasi ringan) di tiap level selesai — sesuai gaya Duolingo, tapi jangan berlebihan karena topiknya cukup personal.
- Setelah Modul Cinta Romantis selesai, **jangan tampilkan halaman skor/hasil terpisah** — langsung lanjutkan pengguna ke Modul Kesiapan Menikah. Data jawaban Modul Cinta Romantis tetap disimpan untuk dipakai di halaman hasil akhir nanti.

### 3.3 Sistem Skoring

**Modul Cinta Romantis (tidak ada skor benar/salah — berbasis konsensus setuju/tidak setuju):**
- Setiap item dijawab dengan pilihan sederhana **2 opsi: Setuju / Tidak Setuju** (bukan skala 5 poin) — ini meniru cara skoring pada riset aslinya, yang secara sengaja menyederhanakan jawaban jadi dua pilihan supaya lebih menangkap pola persetujuan umum ketimbang variasi intensitas jawaban.
- Hitung persentase "Setuju" per dimensi (12 dimensi, lihat bagian 4), lalu urutkan dimensi dari persentase tertinggi ke terendah untuk pengguna tersebut.
- Tampilkan sebagai "gaya/pandangan cinta yang paling menonjol" pada diri pengguna: ambil 3–5 dimensi teratas dengan persentase persetujuan tertinggi. Ini murni reflektif dan personal (semacam "cermin" pandangan cinta pengguna), bukan penilaian benar/salah, dan tidak perlu dibandingkan dengan norma populasi mana pun.

**Modul Kesiapan Menikah:**
- Setiap item dijawab dengan skala Likert 5 poin.
- Sebagian item bersifat **favorable (F)** dan sebagian **unfavorable (UF)** — item UF harus di-reverse-score. Penanda F/UF ada di bagian 4.
- Skor dijumlah per dimensi dan total.

### 3.4 Halaman Hasil Akhir
Halaman hasil **hanya muncul satu kali, setelah pengguna menyelesaikan seluruh level di Modul Kesiapan Menikah** (bukan setelah Modul Cinta Romantis). Isi halaman ini mencakup gabungan dari kedua modul:
- Skor total kesiapan menikah + breakdown skor per 8 dimensi (misalnya radar chart atau bar chart yang playful), dengan interpretasi reflektif-edukatif (bukan label klinis/diagnostik, bukan vonis "siap/tidak siap" yang kaku — lebih ke arah "area yang sudah kuat" vs "area yang masih perlu dipersiapkan").
- Ringkasan singkat "gaya/pandangan cinta romantis yang paling menonjol" dari Modul Cinta Romantis, sebagai pelengkap reflektif (bukan skor utama).

### 3.5 Fitur Profil
- Profil pengguna (data akun, riwayat hasil)
- Log out
- Syarat & Ketentuan aplikasi
- Tentang Aplikasi
- Hubungi Admin/CS

## 4. Rincian Level

Catatan: item nomor 17, 19, dan 31 dari daftar asli sengaja **tidak dipakai** — sudah dikeluarkan dari daftar di bawah ini.

### Modul A — Cinta Romantis (12 level, dikerjakan lebih dulu, total 31 item)

Format: **[Nomor Level] Nama Level (dimensi) — jumlah item — daftar item (parafrase, makna dipertahankan sama)**

1. **Consummate Love** — 1 item
   - Cinta itu gabungan dari perhatian, komitmen, saling paham, tanggung jawab, penghargaan, dan kepercayaan ke pasangan

2. **Attachment** — 3 item
   - Mencintai seseorang apa adanya — baik dulu, sekarang, maupun nanti
   - "Rumah" itu di mana pun berada bareng orang yang dicintai, meski sering pindah-pindah
   - Cinta bukan soal nemuin orang buat hidup bareng, tapi nemuin orang yang bikin kamu ngerasa nggak bisa hidup tanpanya

3. **Transcendence** — 8 item
   - Dicintai dengan tulus sama seseorang bikin ngerasa lebih kuat
   - Cinta bisa bikin pasangan jadi versi yang lebih kuat dan lebih baik
   - Kalau lagi cinta, rasanya bisa ngelakuin apa aja
   - Hidup itu kayak permainan buat semua orang, dan cinta adalah hadiahnya
   - Pelajaran paling berharga dalam hidup adalah belajar mencintai dan dicintai balik
   - Jatuh cinta rasanya kayak lagi di surga
   - Cinta itu yang bikin segala sesuatu jadi punya makna
   - Cinta romantis adalah bentuk kebahagiaan tertinggi dalam hidup

4. **Limerence** — 4 item
   - Pas lagi jatuh cinta, pikiran terus-terusan ke orang itu
   - Kamu nggak akan tahu seberapa dalam seseorang bisa mencintai
   - Jatuh cinta kadang bikin orang jadi nggak masuk akal/bodoh
   - Cinta itu kondisi di mana kebahagiaan pasangan ikut nentuin kebahagiaan diri sendiri

5. **Infatuated Love** — 1 item
   - Orang bisa jatuh cinta tanpa alasan jelas, bahkan tanpa direncanain — cinta emang nggak bisa diatur

6. **Companionate Love** — 3 item
   - Cinta yang tulus itu nggak pernah benar-benar berakhir
   - Cinta itu terbentuk dari semua hal yang udah dilalui bareng seseorang
   - Cinta itu nggak tunduk sama waktu — dia melampaui waktu

7. **Attraction** — 3 item
   - Cinta itu kayak satu jiwa yang menyatu di dua orang
   - Cinta sering muncul justru dari ketemunya dua sisi rapuh/lemah dua orang
   - Sebelum jatuh cinta sama seseorang, rasanya banyak hal belum terasa bermakna

8. **Agape** — 4 item
   - Cinta yang paling kuat itu justru yang berani nunjukin sisi rapuhnya
   - Mencintai seseorang apa adanya, tanpa syarat
   - Cinta yang dikasih dengan tulus/ikhlas justru yang bakal bertahan lama
   - Cinta itu bisa ngalahin apa pun

9. **Pragma** — 1 item
   - Daripada capek nyari pasangan yang sempurna, mending fokus bangun hubungan yang sempurna bareng-bareng

10. **Fatuous Love** — 1 item
    - Cinta itu buta — kadang bikin nggak lihat kekurangan orang yang dicintai

11. **Commitment** — 1 item
    - Rela ngelakuin apa aja demi orang yang dicintai

12. **Mania** — 1 item
    - Yang dibutuhkan cuma cinta — cinta itu segalanya

### Modul B — Kesiapan Menikah (8 level, dikerjakan setelah Modul A selesai, total 18 item)

Format: **[Nomor Level] Nama Level — jumlah item — daftar item (F = favorable, UF = unfavorable, harus reverse-score)**

1. **Kesiapan Emosi** — 2 item
   - (UF) Pengalaman menyakitkan di masa lalu bikin ragu untuk berkomitmen menikah
   - (UF) Takut kalau masalah/trauma masa lalu akan mengganggu kebahagiaan pernikahan di masa depan

2. **Kesiapan Sosial** — 3 item
   - (F) Nyaman menghabiskan waktu senggang bareng orang lain
   - (F) Senang kenalan dan bertemu orang baru
   - (UF) Lebih milih di rumah aja daripada ngobrol/bersosialisasi dengan tetangga

3. **Kesiapan Peran** — 3 item
   - (UF) Merasa keterbukaan dengan pasangan nggak membantu dalam berbagi peran rumah tangga
   - (F) Nggak keberatan kalau suami-istri berbagi peran dan tugas pekerjaan rumah tangga
   - (UF) Merasa keberatan kalau harus berbagi tugas pekerjaan rumah dengan pasangan

4. **Kesiapan Finansial** — 3 item
   - (F) Sebelum menikah, harus sudah punya pekerjaan atau penghasilan
   - (UF) Menurutku pekerjaan dan penghasilan nggak berpengaruh terhadap pernikahan
   - (UF) Nggak punya penghasilan/pekerjaan sebelum atau sesudah menikah itu hal yang wajar

5. **Kesiapan Agama** — 2 item
   - (F) Harus menikah dengan pasangan yang agamanya sama
   - (F) Mempelajari dan menyiapkan ilmu agama itu penting sebagai bekal berumah tangga

6. **Kesiapan Norma Masyarakat** — 2 item
   - (F) Sadar bahwa pacaran itu sesuatu yang nggak sesuai dengan norma masyarakat
   - (UF) Merasa pacaran dan kontak fisik itu hal yang wajar menurut norma masyarakat

7. **Kesiapan Mental** — 1 item
   - (UF) Belum punya rencana untuk membangun kehidupan berumah tangga

8. **Kesiapan Menerima Satu Sama Lain** — 2 item
   - (F) Siap mengutamakan kebutuhan pasangan di atas kebutuhan pribadi
   - (F) Akan tetap menghargai pekerjaan pasangan meskipun penghasilannya kecil

Total: 20 level (12 Cinta Romantis + 8 Kesiapan Menikah), 49 item — ini sudah final, cukup dikemas ulang jadi bentuk game per level, jangan diubah maknanya.

## 5. Yang Saya Mau Kamu Lakukan Sekarang

Bangun aplikasi ini secara langsung dalam bentuk **PWA (Progressive Web App)**, sampai selesai penuh, tanpa perlu menunggu konfirmasi saya di tengah jalan. Kerjakan semua bagian di bawah ini sampai tuntas, lalu deploy sendiri, dan pada akhirnya kirim ke saya **satu link publik yang sudah live dan bisa langsung saya buka/test dari HP** — itu yang saya butuhkan sebagai hasil akhir.

- **Wajib pakai layanan gratis** — hosting di **Cloudflare Pages** (free tier) via **GitHub** (push ke repo → auto-deploy), dan kalau butuh backend/DB pakai yang free tier juga (Cloudflare Pages Functions + D1/KV termasuk gratis). Jangan pakai layanan berbayar.
- Stack: pilih sendiri yang paling praktis untuk PWA (misalnya React/Vite, atau Next.js versi static export) — cukup sebutkan singkat stack yang dipakai dan kenapa, tidak perlu menunggu persetujuan saya untuk lanjut.
- Wajib punya `manifest.json` (nama app, icon, theme color putih + soft lylac, display: standalone) dan **service worker** yang benar supaya bisa di-install ke homescreen dan tetap jalan offline-basic.
- Struktur project harus siap untuk static build (`npm run build` menghasilkan folder statis, misalnya `dist/`), karena akan di-deploy sebagai static site di Cloudflare Pages — hindari fitur yang butuh server Node.js runtime kecuali pakai Cloudflare Pages Functions/Workers.
- Setelah semuanya jadi, langsung **deploy ke Cloudflare Pages sampai statusnya live**, lalu kirim ke saya link publiknya. Tidak perlu kirim langkah-langkah manual untuk saya deploy sendiri — saya cuma butuh link jadi yang sudah bisa diakses.

Cakupan yang harus selesai dibangun (kerjakan semua, tidak perlu japri konfirmasi per bagian):

1. Setup project, tema (putih + soft lylac), dan konfigurasi PWA.
2. Fitur autentikasi: daftar akun (nama, usia, jenis kelamin, no HP, password), login (nomor HP + password), dan alur lupa password.
3. Peta level (skill tree ala Duolingo) — 20 level total: 12 level Modul Cinta Romantis harus dituntaskan dulu, baru 8 level Modul Kesiapan Menikah terbuka. Sertakan progress bar/XP.
4. Gameplay untuk seluruh 12 level Modul Cinta Romantis, dengan mekanik game yang bervariasi antar level, memuat semua item di bagian 4 dengan makna yang sama persis.
5. Gameplay untuk seluruh 8 level Modul Kesiapan Menikah, termasuk logika F/UF (reverse-score) sesuai bagian 4.
6. Sistem skoring & halaman hasil akhir — skor total + breakdown per 8 dimensi Kesiapan Menikah (radar/bar chart, interpretasi reflektif-edukatif, bukan vonis klinis) ditambah ringkasan gaya cinta dari Modul Cinta Romantis. Halaman ini muncul setelah Modul Kesiapan Menikah selesai.
7. Fitur profil: profil pengguna & riwayat hasil, log out, syarat & ketentuan, tentang aplikasi, hubungi admin/CS.
8. Deploy final ke Cloudflare Pages sampai bisa diakses publik.

Setelah semua selesai dan sudah live, kirimkan ke saya link publiknya langsung.
