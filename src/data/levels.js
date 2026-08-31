// Data lengkap level & item Jovely
// Modul A: Peta Samudra Rasa (11 level, 27 item) - jawaban Setuju/Tidak Setuju
// Modul B: Arus Bawah Laut (7 level, 8 item) - jawaban Setuju/Tidak Setuju (swipe)
// Modul C: Ekspedisi Pondasi Bahtera (7 level, 18 item) - skala Likert 5 poin, F/UF reverse-score

export const MODULES = [
  {
    id: 'A',
    name: 'Peta Samudra Rasa',
    subtitle: 'Eksplorasi peta cintamu',
    order: 1,
    levels: [
      {
        id: 'A1', order: 1, name: 'Puncak Mahkota Cita', icon: 'complete',
        items: [
          {
            id: 'A1.1',
            scenario: 'Kamu sedang menjalani perjalanan bersama seseorang yang berarti bagimu. Hari ini dia terlihat berbeda dari biasanya dan menjadi lebih pendiam. Apa yang akan kamu lakukan?',
            choices: [
              { id: 'A', text: 'Mengajaknya berbicara dan mencari tahu apa yang sedang terjadi.', score: 4 },
              { id: 'B', text: 'Menunggu sampai dia sendiri menceritakan apa yang terjadi.', score: 3 },
              { id: 'C', text: 'Membiarkannya karena setiap orang memiliki urusannya masing-masing.', score: 2 },
              { id: 'D', text: 'Mengabaikannya dan melanjutkan aktivitas seperti biasa.', score: 1 }
            ]
          },
          {
            id: 'A1.2',
            scenario: 'Perjalanan kalian mulai menghadapi rintangan. Ada pilihan untuk meninggalkan perjalanan atau tetap menyelesaikannya bersama. Apa keputusanmu?',
            choices: [
              { id: 'A', text: 'Tetap bersama dan mencari jalan keluar.', score: 4 },
              { id: 'B', text: 'Mencoba bertahan selama keadaan masih memungkinkan.', score: 3 },
              { id: 'C', text: 'Menyerahkan keputusan sepenuhnya kepadanya.', score: 2 },
              { id: 'D', text: 'Memilih pergi ketika perjalanan mulai terasa sulit.', score: 1 }
            ]
          },
          {
            id: 'A1.3',
            scenario: 'Seseorang yang berarti bagimu mengambil keputusan yang tidak langsung kamu mengerti. Apa yang kamu lakukan?',
            choices: [
              { id: 'A', text: 'Mencoba memahami alasan dan sudut pandangnya sebelum menilai.', score: 4 },
              { id: 'B', text: 'Memintanya menjelaskan alasan keputusannya.', score: 3 },
              { id: 'C', text: 'Menganggap keputusan tersebut sebagai sesuatu yang tidak perlu kamu pahami.', score: 2 },
              { id: 'D', text: 'Langsung menganggap keputusan tersebut salah.', score: 1 }
            ]
          },
          {
            id: 'A1.4',
            scenario: 'Sebuah masalah muncul karena keputusan yang kamu ambil. Apa yang akan kamu lakukan?',
            choices: [
              { id: 'A', text: 'Mengakui bagianmu dan berusaha memperbaiki keadaan.', score: 4 },
              { id: 'B', text: 'Mengakui kesalahan jika memang terbukti berasal darimu.', score: 3 },
              { id: 'C', text: 'Menunggu orang lain menyelesaikan masalah tersebut.', score: 2 },
              { id: 'D', text: 'Mencari alasan agar kesalahan tidak sepenuhnya menjadi tanggung jawabmu.', score: 1 }
            ]
          },
          {
            id: 'A1.5',
            scenario: 'Setelah melewati perjalanan yang panjang, orang tersebut melakukan sesuatu yang mungkin terlihat sederhana, tetapi sebenarnya membutuhkan usaha. Apa yang kamu lakukan?',
            choices: [
              { id: 'A', text: 'Menghargai usaha yang telah diberikan dan menunjukkannya secara tulus.', score: 4 },
              { id: 'B', text: 'Mengakui usahanya ketika ada kesempatan.', score: 3 },
              { id: 'C', text: 'Menganggap hal tersebut sebagai sesuatu yang memang sudah seharusnya dilakukan.', score: 2 },
              { id: 'D', text: 'Tidak memberikan perhatian karena menurutmu itu bukan sesuatu yang penting.', score: 1 }
            ]
          },
          {
            id: 'A1.6',
            scenario: 'Di tengah perjalanan, kamu tidak selalu bisa mengetahui apa yang dilakukan orang tersebut ketika tidak bersamamu. Apa yang kamu pilih?',
            choices: [
              { id: 'A', text: 'Memberikan kepercayaan tanpa harus terus-menerus mengawasi.', score: 4 },
              { id: 'B', text: 'Mempercayainya, tetapi tetap membutuhkan kepastian sesekali.', score: 3 },
              { id: 'C', text: 'Merasa perlu mengetahui sebagian besar aktivitasnya.', score: 2 },
              { id: 'D', text: 'Sulit mempercayainya tanpa melakukan pengecekan.', score: 1 }
            ]
          }
        ]
      },
      {
        id: 'A2', order: 2, name: 'Jangkar Pelabuhan Utama', icon: 'attach',
        items: [
          { id: 'A2.1', text: 'Mencintai seseorang apa adanya — baik dulu, sekarang, maupun nanti.' },
          { id: 'A2.2', text: 'Rumah adalah ketika kita bersama orang yang kita cintai, di mana pun kita berada.' },
          { id: 'A2.3', text: 'Cinta bukan tentang orang buat hidup bersama, tapi nemuin orang yang bikin kamu merasa tidak bisa hidup tanpanya.' }
        ]
      },
      {
        id: 'A3', order: 3, name: 'Lembah Ketenangan Jiwa', icon: 'sparkle',
        items: [
          { id: 'A3.1', text: 'Dicintai dengan tulus dengan seseorang buat kamu lebih kuat.' },
          { id: 'A3.2', text: 'Cinta bisa bikin pasangan jadi versi yang lebih kuat dan lebih baik.' },
          { id: 'A3.3', text: 'Kalau lagi cinta, rasanya bisa melakukan apa saja.' },
          { id: 'A3.4', text: 'Hidup itu seperti permainan buat semua orang, dan cinta adalah hadiahnya.' },
          { id: 'A3.5', text: 'Hal terhebat yang akan kupelajari sepanjang hidup ini adalah mencintai dan dicintai sebagai balasannya.' },
          { id: 'A3.6', text: 'Jatuh cinta rasanya seperti lagi di surga.' },
          { id: 'A3.7', text: 'Cinta itu bikin segala sesuatu jadi punya makna.' },
          { id: 'A3.8', text: 'Cinta romantis adalah bentuk kebahagiaan tertinggi dalam hidup.' }
        ]
      },
      {
        id: 'A4', order: 4, name: 'Badai Magnetik', icon: 'obsessed',
        items: [
          { id: 'A4.1', text: 'Pas lagi jatuh cinta, pikiran terus-terusan kepikiran tentang orang itu.' },
          { id: 'A4.2', text: 'Kamu nggak akan tahu seberapa dalam aku bisa mencintai seseorang.' },
          { id: 'A4.3', text: 'Jatuh cinta kadang bikin orang jadi nggak punya masuk akal sehat.' },
          { id: 'A4.4', text: 'Cinta itu kondisi di mana kebahagiaan pasangan berpengaruh ke kebahagiaanku.' }
        ]
      },
      {
        id: 'A5', order: 5, name: 'Lentera Percik Api', icon: 'spark',
        items: [
          { id: 'A5.1', text: 'Orang bisa jatuh cinta tanpa alasan jelas, bahkan tanpa direncanain – cinta memang nggak bisa diatur.' },
          { id: 'A5.2', text: 'Cinta yang tulus itu tidak pernah berakhir.' },
          { id: 'A5.3', text: 'Cinta itu terbentuk dari semua hal yang udah dilalui berdua dengan seseorang.' },
          { id: 'A5.4', text: 'Cinta tidak lekang oleh waktu seperti perasaan yang tetap ada meskipun waktu terus berlalu.' }
        ]
      },
      {
        id: 'A6', order: 6, name: 'Bahtera Sahabat Sejati', icon: 'companion',
        items: [
          { id: 'A6.1', text: 'Cinta adalah satu jiwa yang hidup dalam diri dua orang.' },
          { id: 'A6.2', text: 'Cinta sering muncul justru dari ketemunya sisi rapuh dua orang.' },
          { id: 'A6.3', text: 'Sebelum jatuh cinta sama seseorang, segalanya terasa belum bermakna.' }
        ]
      },
      {
        id: 'A7', order: 7, name: 'Mata Air Ketulusan', icon: 'halo',
        items: [
          { id: 'A7.1', text: 'Cinta paling kuat yang berani menunjukkan sisi rapuhnya.' },
          { id: 'A7.2', text: 'Mencintai seseorang apa adanya, tanpa syarat.' },
          { id: 'A7.3', text: 'Cinta yang seadanya, akan berakhir sia-sia.' },
          { id: 'A7.4', text: 'Cinta itu bisa mengalahkan apa pun.' }
        ]
      },
      {
        id: 'A8', order: 8, name: 'Kompas Logika', icon: 'handshake',
        items: [
          { id: 'A8.1', text: 'Daripada capek cari pasangan yang sempurna, lebih baik fokus bangun hubungan yang sempurna bareng pasangan.' }
        ]
      },
      {
        id: 'A9', order: 9, name: 'Kilat Tanpa Akar', icon: 'blindfold',
        items: [
          { id: 'A9.1', text: 'Cinta itu buta – kadang bisa membuat tidak melihat kekurangan orang yang dicintai.' }
        ]
      },
      {
        id: 'A10', order: 10, name: 'Sumpah Penjaga Takdir', icon: 'flag',
        items: [
          { id: 'A10.1', text: 'Rela melakukan apa aja demi orang yang dicintai.' }
        ]
      },
      {
        id: 'A11', order: 11, name: 'Pusaran Angin Gelisah', icon: 'fire',
        items: [
          { id: 'A11.1', text: 'Yang dibutuhkan cuma cinta — cinta itu segalanya.' }
        ]
      }
    ]
  },
  {
    id: 'B',
    name: 'Arus Bawah Laut',
    subtitle: 'Petualangan maritim pola asuh',
    order: 2,
    levels: [
      {
        id: 'B1', order: 12, name: 'Palung Hangat Pelindung', icon: 'warmth',
        items: [
          {
            id: 'B1.1',
            scenario: 'Kapalmu sedang menghadapi badai. Kamu menemukan sesuatu yang membuatmu takut dan bingung. Di dekatmu ada Kapten Senior, orang yang selalu menjadi tempatmu meminta bantuan. Apa yang terjadi ketika kamu ingin menceritakan masalahmu?',
            choices: [
              { id: 'A', text: 'Kapten Senior biasanya menyadari keadaanku dan mengajakku untuk bercerita.', score: 4 },
              { id: 'B', text: 'Kapten Senior biasanya menanyakan keadaanku, lalu membiarkanku menentukan apakah ingin bercerita atau tidak.', score: 3 },
              { id: 'C', text: 'Kapten Senior biasanya menunggu sampai aku sendiri yang mulai menceritakan masalahku.', score: 2 },
              { id: 'D', text: 'Kapten Senior biasanya tetap berada di dekatku, tetapi tidak banyak membicarakan masalah yang sedang kuhadapi.', score: 1 }
            ]
          }
        ]
      },
      {
        id: 'B2', order: 13, name: 'Mercusuar Utama', icon: 'lighthouse',
        items: [
          {
            id: 'B2.1',
            scenario: 'Mercusuar memberi tanda bahwa kamu tidak boleh melewati Area Berbahaya. Saat kecil, kamu juga pernah menerima aturan dari Kapten Senior yang harus kamu taati. Ketika kamu bertanya mengapa aturan itu harus dilakukan, kejadian mana yang paling mirip dengan pengalamanmu bersama Kapten Senior?',
            choices: [
              { id: 'A', text: 'Kapten Senior menjelaskan alasan aturan tersebut agar aku memahami mengapa harus mematuhinya.', score: 4 },
              { id: 'B', text: 'Kapten Senior memberikan penjelasan singkat, kemudian memintaku mengikuti aturan tersebut.', score: 3 },
              { id: 'C', text: 'Kapten Senior biasanya mengatakan bahwa aturan itu harus dipatuhi, tanpa banyak menjelaskan alasannya.', score: 2 },
              { id: 'D', text: 'Kapten Senior biasanya meminta aku mengikuti aturan terlebih dahulu dan baru menjelaskan alasannya jika aku bertanya.', score: 1 }
            ]
          }
        ]
      },
      {
        id: 'B3', order: 14, name: 'Samudra Bebas', icon: 'freedom',
        items: [
          {
            id: 'B3.1',
            scenario: 'Kamu menemukan rute baru yang belum tercatat di peta lama. Kamu memiliki pendapat sendiri tentang rute tersebut dan ingin menyampaikannya kepada Kapten Senior. Jika mengingat pengalamanmu bersama Kapten Senior ketika masih kecil, respons mana yang paling mirip dengan apa yang biasanya terjadi?',
            choices: [
              { id: 'A', text: 'Kapten Senior mendengarkan pendapatku dan memintaku menjelaskan alasan di balik pendapat tersebut.', score: 4 },
              { id: 'B', text: 'Kapten Senior mendengarkan ketika aku menyampaikan pendapat, tetapi keputusan akhirnya tetap ditentukan olehnya.', score: 3 },
              { id: 'C', text: 'Kapten Senior biasanya baru mendengarkan pendapatku ketika aku menyampaikannya terlebih dahulu.', score: 2 },
              { id: 'D', text: 'Kapten Senior biasanya menentukan rute yang harus dipilih tanpa meminta pendapatku.', score: 1 }
            ]
          }
        ]
      },
      {
        id: 'B4', order: 15, name: 'Kedalaman Ekstrem', icon: 'depth',
        items: [
          {
            id: 'B4.1',
            scenario: 'Saat kapalmu salah arah, Kapten Senior harus mengingatkanmu agar kesalahan yang sama tidak terulang. Jika mengingat pengalamanmu bersama Kapten Senior ketika masih kecil, bagaimana biasanya ia merespons ketika kamu melakukan kesalahan?',
            choices: [
              { id: 'A', text: 'Kapten Senior menjelaskan kesalahanku dan meminta aku memperbaikinya.', score: 4 },
              { id: 'B', text: 'Kapten Senior memberikan teguran atau konsekuensi agar aku lebih berhati-hati.', score: 3 },
              { id: 'C', text: 'Kapten Senior memberikan hukuman yang melibatkan tindakan fisik untuk membuatku jera.', score: 2 },
              { id: 'D', text: 'Kapten Senior menunjukkan ketidaksetujuannya dengan cara yang membuatku merasa takut atau tertekan.', score: 1 }
            ]
          }
        ]
      },
      {
        id: 'B5', order: 16, name: 'Badai Bertubi', icon: 'storm',
        items: [
          {
            id: 'B5.1',
            scenario: 'Bagaimana gema suara di dalam kabin saat kamu tak sengaja melanggar aturan? Jika mengingat pengalamanmu bersama Kapten Senior ketika masih kecil, kejadian mana yang paling mirip dengan apa yang biasanya kamu alami?',
            choices: [
              { id: 'A', text: 'Kapten Senior menjelaskan kesalahanku dan membicarakan apa yang perlu diperbaiki.', score: 4 },
              { id: 'B', text: 'Kapten Senior menunjukkan bahwa ia marah karena kesalahanku, lalu memberiku waktu untuk memperbaikinya.', score: 3 },
              { id: 'C', text: 'Kapten Senior meluapkan kemarahannya kepadaku ketika sedang marah karena kesalahanku.', score: 2 },
              { id: 'D', text: 'Kapten Senior menjadi lebih diam atau menjauh setelah mengetahui kesalahanku.', score: 1 }
            ]
          }
        ]
      },
      {
        id: 'B6', order: 17, name: 'Pemblokiran Karang Misterius', icon: 'block',
        items: [
          {
            id: 'B6.1',
            scenario: 'Kamu baru saja melakukan kesalahan dalam perjalanan. Saat hendak melanjutkan ekspedisi, kamu mendapati izin menyelammu dicabut dan akses ke ruang penyimpanan dikunci. Kamu bertanya kepada Kapten Senior mengapa hakmu untuk menggunakan fasilitas tersebut dicabut. Jika mengingat pengalamanmu bersama Kapten Senior ketika masih kecil, kejadian mana yang paling mirip dengan apa yang biasanya kamu alami?',
            choices: [
              { id: 'A', text: 'Kapten Senior menjelaskan kesalahanku dan alasan mengapa aku tidak boleh menggunakan fasilitas tersebut untuk sementara.', score: 4 },
              { id: 'B', text: 'Kapten Senior mengatakan bahwa aku tidak boleh menggunakan fasilitas tersebut untuk sementara, lalu menjelaskan alasannya secara singkat ketika aku bertanya.', score: 3 },
              { id: 'C', text: 'Kapten Senior mencabut hakku menggunakan fasilitas tersebut dan hanya memberikan sedikit penjelasan mengenai alasannya.', score: 2 },
              { id: 'D', text: 'Kapten Senior mencabut hakku menggunakan fasilitas tersebut dan menganggap aku sudah mengetahui alasan mengapa hak itu dicabut.', score: 1 }
            ]
          }
        ]
      },
      {
        id: 'B7', order: 18, name: 'Terumbu Tanpa Jangkar', icon: 'reef',
        items: [
          {
            id: 'B7.1',
            scenario: 'Saat kamu masih menjadi awak kapal, Kapten Senior menetapkan sebuah aturan: "Jangan memasuki Area Terlarang. Jika aturan ini dilanggar, akan ada konsekuensinya." Suatu hari, kamu tanpa sengaja memasuki area tersebut. Kamu kemudian mengingat kembali pengalamanmu bersama Kapten Senior. Apa yang biasanya terjadi ketika aturan yang disertai konsekuensi itu kamu langgar?',
            choices: [
              { id: 'A', text: 'Kapten Senior menjalankan konsekuensi yang sebelumnya sudah disampaikan kepadaku.', score: 4 },
              { id: 'B', text: 'Kapten Senior terkadang menjalankan konsekuensi tersebut, tetapi pada kesempatan lain tidak.', score: 3 },
              { id: 'C', text: 'Kapten Senior mengingatkan kembali tentang konsekuensinya, tetapi biasanya tidak benar-benar menjalankannya.', score: 2 },
              { id: 'D', text: 'Kapten Senior menetapkan konsekuensi, tetapi ketika aturan dilanggar, konsekuensi tersebut sering kali tidak diterapkan.', score: 1 }
            ]
          },
          {
            id: 'B7.2',
            scenario: 'Kamu melanggar aturan, ia terkadang membunyikan sirene peringatan dan mengatakan bahwa akan ada konsekuensi jika kamu mengulanginya. Namun, tidak setiap peringatan berakhir dengan konsekuensi yang benar-benar diberikan. Jika mengingat pengalamanmu bersama Kapten Senior ketika masih kecil, situasi mana yang paling mirip dengan apa yang biasanya terjadi?',
            choices: [
              { id: 'A', text: 'Ketika Kapten Senior memberikan peringatan tentang konsekuensi, biasanya konsekuensi tersebut benar-benar diberikan.', score: 4 },
              { id: 'B', text: 'Terkadang Kapten Senior hanya memberikan peringatan, tetapi pada kesempatan lain konsekuensinya benar-benar diberikan.', score: 3 },
              { id: 'C', text: 'Kapten Senior cukup sering memberikan peringatan tentang hukuman, tetapi biasanya tidak sampai benar-benar memberikannya.', score: 2 },
              { id: 'D', text: 'Kapten Senior lebih sering memperingatkanku tentang hukuman daripada benar-benar memberikan hukuman tersebut.', score: 1 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'C',
    name: 'Ekspedisi Pondasi Bahtera',
    subtitle: 'Ukur kesiapan perjalananmu',
    order: 3,
    levels: [
      {
        id: 'C1', order: 19, name: 'Perisai Jiwa', icon: 'emotion',
        items: [
          { id: 'C1.1', polarity: 'F', text: 'Siap mengutamakan kebutuhan pasangan di atas kebutuhan pribadi.' },
          { id: 'C1.2', polarity: 'UF', text: 'Merasa keterbukaan dengan pasangan membantu dalam berbagi peran rumah tangga.' },
          { id: 'C1.3', polarity: 'UF', text: 'Pengalaman menyakitkan di masa lalu membuat ragu untuk berkomitmen menikah.' },
          { id: 'C1.4', polarity: 'UF', text: 'Saya cemas masa lalu akan mengganggu kebahagiaan pernikahan saya di masa depan.' }
        ]
      },
      {
        id: 'C2', order: 20, name: 'Jaringan Aliansi', icon: 'social',
        items: [
          { id: 'C2.1', polarity: 'F', text: 'Nyaman menghabiskan waktu luang senggang bersama orang lain.' },
          { id: 'C2.2', polarity: 'F', text: 'Saya senang berkenalan dan bertemu orang baru.' },
          { id: 'C2.3', polarity: 'UF', text: 'Lebih pilih di rumah daripada ngobrol dengan tetangga.' }
        ]
      },
      {
        id: 'C3', order: 21, name: 'Pembagian Singgasana', icon: 'role',
        items: [
          { id: 'C3.1', polarity: 'F', text: 'Tidak keberatan kalau suami-istri berbagi peran dan tugas pekerjaan rumah tangga.' },
          { id: 'C3.2', polarity: 'UF', text: 'Merasa keberatan kalau harus berbagi tugas pekerjaan rumah dengan pasangan.' }
        ]
      },
      {
        id: 'C4', order: 22, name: 'Lumbung Perbekalan', icon: 'finance',
        items: [
          { id: 'C4.1', polarity: 'F', text: 'Sebelum menikah, harus sudah punya pekerjaan atau penghasilan.' },
          { id: 'C4.2', polarity: 'F', text: 'Tetap menghargai pekerjaan pasangan meskipun penghasilannya kecil.' },
          { id: 'C4.3', polarity: 'UF', text: 'Menurutku pekerjaan dan penghasilan tidak berpengaruh terhadap pernikahan.' },
          { id: 'C4.4', polarity: 'UF', text: 'Tidak apa-apa belum punya penghasilan atau pekerjaan sebelum dan setelah menikah.' }
        ]
      },
      {
        id: 'C5', order: 23, name: 'Pondasi Karang', icon: 'mental',
        items: [
          { id: 'C5.1', polarity: 'UF', text: 'Belum punya rencana untuk membangun kehidupan berumah tangga.' }
        ]
      },
      {
        id: 'C6', order: 24, name: 'Kompas Spiritual', icon: 'religion',
        items: [
          { id: 'C6.1', polarity: 'F', text: 'Harus menikah dengan pasangan yang agamanya sama.' },
          { id: 'C6.2', polarity: 'F', text: 'Ilmu agama penting dipelajari sebagai bekal dalam berumah tangga.' }
        ]
      },
      {
        id: 'C7', order: 25, name: 'Pijakan Tradisi', icon: 'norms',
        items: [
          { id: 'C7.1', polarity: 'F', text: 'Sadar bahwa pacaran itu sesuatu yang nggak sesuai dengan norma masyarakat.' },
          { id: 'C7.2', polarity: 'UF', text: 'Menurut saya, pacaran dan kontak fisik adalah hal yang wajar di masyarakat.' }
        ]
      }
    ]
  }
]

export const ALL_LEVELS = MODULES.flatMap(m => m.levels)
export const TOTAL_LEVELS = ALL_LEVELS.length // 25
export const TOTAL_ITEMS = ALL_LEVELS.reduce((s, l) => s + l.items.length, 0) // 53

// mecari level by id
export function getLevel(levelId) {
  return ALL_LEVELS.find(l => l.id === levelId)
}

// mecari level selanjutnya
export function getNextLevel(levelId) {
  const idx = ALL_LEVELS.findIndex(l => l.id === levelId)
  return idx >= 0 && idx < ALL_LEVELS.length - 1 ? ALL_LEVELS[idx + 1] : null
}

// mecari module by level id
export function getModuleOf(levelId) {
  return MODULES.find(m => m.levels.some(l => l.id === levelId))
}

// daftar level pada sebuah module
export function getLevelsOfModule(moduleId) {
  return MODULES.find(m => m.id === moduleId)?.levels || []
}

// XP per level = base 20 + jumlah item * 5
export function getLevelXP(levelId) {
  const lvl = getLevel(levelId)
  if (!lvl) return 0
  return 20 + lvl.items.length * 5
}

// === Logika Skoring ===

// Modul A: persentase Setuju per dimensi
// Mendukung 2 format item:
//  - text: jawaban 'agree'|'disagree' → agree/total * 100
//  - choices: jawaban choice id (mis. 'A') → cari score, normalisasi score/maxScore * 100
export function scoreLoveStyles(levelAnswers) {
  // levelAnswers: { [levelId]: { [itemId]: 'agree'|'disagree'|choiceId } }
  const scores = {}
  MODULES[0].levels.forEach(level => {
    let agree = 0, total = 0
    let weightedPctSum = 0, weightedCount = 0
    level.items.forEach(item => {
      const ans = levelAnswers[level.id]?.[item.id]
      if (ans) {
        total++
        if (item.choices) {
          const choice = item.choices.find(c => c.id === ans)
          if (choice) {
            const maxScore = Math.max(...item.choices.map(c => c.score))
            weightedPctSum += (choice.score / maxScore) * 100
            weightedCount++
          }
        } else {
          if (ans === 'agree') agree++
        }
      }
    })
    // jika level punya item choices, hitung dari weighted; jika pure text, pakai agree/total
    let percent
    if (weightedCount > 0) {
      percent = Math.round(weightedPctSum / weightedCount)
    } else {
      percent = total > 0 ? Math.round((agree / total) * 100) : 0
    }
    scores[level.id] = {
      levelId: level.id,
      name: level.name,
      agree,
      total,
      percent,
      answered: total === level.items.length
    }
  })
  const ranking = Object.values(scores).sort((a, b) => b.percent - a.percent)
  const top = ranking.filter(s => s.answered).slice(0, 5)
  return { scores, ranking, top }
}

// Modul B: Arus Bawah Laut — persentase Setuju per dimensi
// Mendukung 2 format item:
//  - healthy/unhealthy: jawaban 'agree'|'disagree' → agree/total * 100
//  - choices: jawaban choice id (mis. 'A') → cari score, normalisasi score/maxScore * 100
export function scoreParentingStyles(levelAnswers) {
  const scores = {}
  MODULES[1].levels.forEach(level => {
    let agree = 0, total = 0
    let weightedPctSum = 0, weightedCount = 0
    level.items.forEach(item => {
      const ans = levelAnswers[level.id]?.[item.id]
      if (ans) {
        total++
        if (item.choices) {
          const choice = item.choices.find(c => c.id === ans)
          if (choice) {
            const maxScore = Math.max(...item.choices.map(c => c.score))
            weightedPctSum += (choice.score / maxScore) * 100
            weightedCount++
          }
        } else {
          if (ans === 'agree') agree++
        }
      }
    })
    let percent
    if (weightedCount > 0) {
      percent = Math.round(weightedPctSum / weightedCount)
    } else {
      percent = total > 0 ? Math.round((agree / total) * 100) : 0
    }
    scores[level.id] = {
      levelId: level.id,
      name: level.name,
      agree,
      total,
      percent,
      answered: total === level.items.length
    }
  })
  const ranking = Object.values(scores).sort((a, b) => b.percent - a.percent)
  const top = ranking.filter(s => s.answered).slice(0, 3)
  return { scores, ranking, top }
}

// Modul C: Ekspedisi Pondasi Bahtera — skor per dimensi & total (Likert 5 poin: 1-5, UF di-reverse)
export function scoreMarriageReadiness(levelAnswers) {
  const LIKERT = { 1: 'Sangat Tidak Setuju', 2: 'Tidak Setuju', 3: 'Netral', 4: 'Setuju', 5: 'Sangat Setuju' }
  const dims = {}
  let totalRaw = 0, totalMax = 0

  MODULES[2].levels.forEach(level => {
    let dimScore = 0, dimMax = 0, answered = 0
    level.items.forEach(item => {
      const ans = levelAnswers[level.id]?.[item.id]
      if (ans && typeof ans === 'number') {
        const raw = ans // 1-5
        const val = item.polarity === 'UF' ? (6 - raw) : raw
        dimScore += val
        dimMax += 5
        answered++
        totalRaw += val
        totalMax += 5
      }
    })
    dims[level.id] = {
      levelId: level.id,
      name: level.name,
      score: dimScore,
      max: dimMax,
      percent: dimMax > 0 ? Math.round((dimScore / dimMax) * 100) : 0,
      answered: answered === level.items.length
    }
  })

  const allAnswered = Object.values(dims).every(d => d.answered)
  return {
    dims,
    totalScore: totalRaw,
    totalMax,
    totalPercent: totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0,
    allAnswered,
    LIKERT
  }
}

// interpretasi reflektif-edukatif (bukan vonis klinis)
// Teks spesifik per level per kategori (bukan generik)
export const LEVEL_INTERPRETATIONS = {
  // === Modul A: Peta Samudra Rasa ===
  A1: {
    80: 'Cinta kamu komplit banget! Kamu sukses menyatukan gairah, rasa nyaman, dan komitmen jadi satu paket utuh yang siap bertahan lama.',
    60: 'Udah lumayan seimbang antara gairah dan komitmen, tinggal poles dikit lagi biar chemistry dan keintimannya makin konsisten.',
    40: 'Hubungan kamu mulai punya pondasi, tapi masih sering naik turun antara cuma sekadar suka atau beneran mau komitmen.',
    0: 'Masih bingung menentukan arah hubungan, gairah dan komitmen belum ketemu titik temu yang pas.',
  },
  A2: {
    80: 'Super aman dan nyaman! Kamu dan pasangan udah kayak home base yang bikin tenang tanpa ada rasa cemas berlebih.',
    60: 'Udah merasa lumayan dekat dan nyaman, tapi kadang masih ada momen canggung atau ragu buat bersandar sepenuhnya.',
    40: 'Rasa nyaman mulai terbangun, tapi kamu masih sering ragu apakah dia bener-bener tempat yang aman buat berbagi.',
    0: 'Masih merasa jarak emosional yang lumayan jauh dan susah buat merasa aman saat di dekat pasangan.',
  },
  A3: {
    80: 'Ikatan kalian dalam banget! Gak cuma fisik, tapi udah berasa sampai ke jiwa dan punya tujuan hidup yang sejalan.',
    60: 'Udah mulai merasakan ikatan batin yang dalam, tinggal diperkuat lagi lewat nilai-nilai hidup yang sevisi.',
    40: 'Hubungan masih dominan di permukaan, baru mulai belajar buat memahami makna ikatan spiritual yang lebih dalam.',
    0: 'Hubungan masih sebatas hal-hal kasat mata atau fisik, belum tersentuh ikatan makna yang lebih mendalam.',
  },
  A4: {
    80: 'Kamu jago mengelola rasa "bucin" dan gairah meletup-letup jadi rasa sayang yang lebih dewasa dan terkendali.',
    60: 'Perasaan deg-degan masih kuat, tapi kamu udah mulai bisa mikir jernih dan gak gampang terbawa emosi obsesif.',
    40: 'Masih sering terombang-ambing sama perasaan obsesif atau "bucin" berlebihan yang bikin emosi naik turun.',
    0: 'Sulit membedakan antara rasa suka yang sehat dengan obsesi sesaat yang bikin capek sendiri.',
  },
  A5: {
    80: 'Cerdas memilah! Kamu gak gampang silau sama pesona awal dan sukses mengenal karakter aslinya secara rasional.',
    60: 'Rasa kagumnya ada, tapi kamu udah mulai membuka mata buat melihat sisi asli dan kekurangan pasangan.',
    40: 'Masih sering "kebutaan" sama ekspektasi manis, jadi kadang kaget pas ngelihat realita karakter pasangan.',
    0: 'Gampang terbuai sama impresi luar atau keindahan awal tanpa mau tahu karakter aslinya seperti apa.',
  },
  A6: {
    80: 'Spark-nya terjaga banget! Daya tarik fisik dan rasa tertarik satu sama lain selalu menyala setiap hari.',
    60: 'Daya tariknya masih lumayan berasa, tinggal ditambah variasi kegiatan bareng biar gak gampang bosen.',
    40: 'Percikan ketertarikan mulai agak redup, butuh effort lebih buat menghidupkan lagi kehangatannya.',
    0: 'Lagi kehilangan spark atau rasa tertarik, berasa datar dan kayak temen biasa aja.',
  },
  A7: {
    80: 'Tulus tanpa batas! Kamu rela berkorban dan mengutamakan kebahagiaan pasangan tanpa nuntut balasan.',
    60: 'Udah mau peduli dan mengalah, tapi sesekali masih ada rasa pengen diperhitungkan kebaikannya.',
    40: 'Masih berjuang menyeimbangkan antara ego pribadi dengan kepedulian tulus ke pasangan.',
    0: 'Masih fokus ke diri sendiri dan hitung-hitungan dalam memberi kasih sayang ke pasangan.',
  },
  A8: {
    80: 'Realistis! Kamu pinter mempertimbangkan kecocokan latar belakang dan logika demi masa depan.',
    60: 'Udah mulai mikirin hal-hal realistis kayak latar belakang dan tujuan, walau kadang masih kemakan perasaan.',
    40: 'Pertimbangan logika mulai kepikir, tapi masih sering kalah sama perasaan impulsif sesaat.',
    0: 'Cenderung cuek sama hal-hal realistis, asal cocok di awal langsung jalan tanpa mikir kesesuaian ke depan.',
  },
  A9: {
    80: 'Paham tempo! Kamu gak buru-buru ambil keputusan besar sebelum bener-bener kenal dalam pasanganmu.',
    60: 'Udah lumayan paham pentingnya proses, walau kadang suka kebelet buat langsung bikin komitmen cepat.',
    40: 'Masih sering kepancing buat bikin janji atau komitmen besar padahal belum terlalu kenal luar-dalam.',
    0: 'Sangat terburu-buru! Gampang ngomong komitmen panjang cuma berdasar gairah sesaat tanpa pondasi kuat.',
  },
  A10: {
    80: 'Setia dan kokoh! Niat kamu buat bertahan di saat suka maupun duka udah gak perlu diragukan lagi.',
    60: 'Komitmen kamu udah lumayan oke, tinggal diuji pas nanti nemu ombak konflik yang agak gede.',
    40: 'Masih ada rasa ragu buat janji setia jangka panjang, gampang ragu kalau ada masalah datang.',
    0: 'Takut atau menghindar dari komitmen, gampang kabur pas hubungan mulai dapet masalah.',
  },
  A11: {
    80: 'Emosi kamu super stabil! Gak ada drama cemburu buta atau rasa takut kehilangan yang berlebihan.',
    60: 'Udah cukup tenang, walau sesekali rasa cemburu atau insecure masih suka mampir dikit-dikit.',
    40: 'Masih sering posesif dan cemas berlebih, gampang kepikiran kalau pasangan lagi gak ada kabar.',
    0: 'Sering terjebak drama emosi, cemburu berlebihan, dan rasa takut ditinggal yang bikin hubungan toxic.',
  },
  // === Modul B: Arus Bawah Laut ===
  B1: {
    80: 'Tangki emosimu penuh! Didikan orang tua yang hangat bikin kamu tumbuh jadi pribadi yang peka dan percaya diri.',
    60: 'Lumayan sering dapet kehangatan, walau kadang ada momen orang tua agak dingin atau kurang ekspresif.',
    40: 'Kurang terbiasa dengan ekspresi kasih sayang terbuka, bikin kamu agak canggung kalau harus bersikap hangat.',
    0: 'Terbiasa dengan suasana rumah yang dingin atau cuek, jadi harus belajar ekstra buat ngerasain rasa aman emosional.',
  },
  B2: {
    80: 'Logika kamu jalan banget! Kebiasaan diajak diskusi sama orang tua bikin kamu paham alasan di balik tiap aturan.',
    60: 'Sering diajak ngobrol sebab-akibat, walau kadang ada aturan orang tua yang main tetapkan gitu aja.',
    40: 'Jarang dapet penjelasan dari aturan orang tua, jadi kamu masih belajar memahami alasan di balik suatu keputusan.',
    0: 'Terbiasa disuruh nurut tanpa alasan jelas, bikin kamu kurang terlatih buat mikir kritis tentang sebab-akibat.',
  },
  B3: {
    80: 'Mandiri maksimal! Orang tua ngasih kepercayaan penuh buat kamu ambil keputusan dan paham tanggung jawabnya.',
    60: 'Udah diberi kebebasan memilih, tapi orang tua masih sering ikut campur di beberapa keputusan penting.',
    40: 'Kebebasanmu masih terbatas, bikin kamu kadang ragu dan butuh validasi orang lain pas mau ambil keputusan.',
    0: 'Sangat diatur atau dikontrol, bikin kamu takut ambil keputusan sendiri dan gampang ragu-ragu.',
  },
  B4: {
    80: 'Bebas dari kekerasan! Rumahmu aman dan amanah, gak ada jejak hukuman fisik yang membekas.',
    60: 'Pernah kena hukuman fisik sesekali saat kecil, tapi gak sampai bikin kamu merasa terancam banget.',
    40: 'Hukuman fisik lumayan sering terjadi sewaktu kecil, bikin ada rasa takut tersisa pas situasi memanas.',
    0: 'Sering menerima kekerasan fisik pas kecil, bikin kamu punya respons trauma atau jadi ekstra defensif.',
  },
  B5: {
    80: 'Komunikasi sehat! Orang tua bicaranya adem, gak ada kebiasaan membentak atau main kata-kata kasar.',
    60: 'Pernah denger nada tinggi atau omelan pedas, tapi secara umum kata-kata di rumah masih terjaga.',
    40: 'Sering terpapar kata-kata pedas atau kritikan tajam, bikin kamu agak sensitif kalau dikritik orang lain.',
    0: 'Terbiasa denger bentakan dan kata kasar di rumah, bikin kamu gampang merasa terserang atau ikut-ikutan bicaranya pedas.',
  },
  B6: {
    80: 'Minim hukuman sepihak! Kalau ada salah, selesainya lewat komunikasi, bukan asal hukum tanpa sebab.',
    60: 'Kadang masih dapet hukuman tanpa alasan jelas, tapi gak bikin kamu takut secara berlebihan.',
    40: 'Sering diancam atau dihukum tanpa dijelaskan salahnya di mana, bikin kamu sering merasa cemas buat melangkah.',
    0: 'Dominan hukuman buta, bikin kamu tumbuh jadi pribadi yang selalu takut bikin salah atau gampang panik.',
  },
  B7: {
    80: 'Seimbang! Orang tua tahu batas kapan menuruti dan kapan harus bilang "tidak", bikin kamu tahan banting.',
    60: 'Lumayan dituruti mau-nya, tapi masih ada batasan-batasan tertentu yang bikin kamu gak terlalu manja.',
    40: 'Sering dimanja dan dituruti kemauannya, bikin kamu agak kaget kalau ketemu realita yang gak sesuai harapan.',
    0: 'Terlalu dituruti dari kecil tanpa batas, bikin kamu sulit terima penolakan dan gampang frustrasi pas gagal.',
  },
  // === Modul C: Ekspedisi Pondasi Bahtera ===
  C1: {
    80: 'Emosi super dewasa! Kamu siap mengontrol ego, paham cara ngadepin konflik, dan tulus nerima kekurangannya.',
    60: 'Udah lumayan siap dan dewasa, tinggal diasah lagi biar makin stabil pas ngadepin ujian yang lebih rumit.',
    40: 'Masih sering kalah sama ego atau ngambek berlarut-larut pas ada beda pendapat sama pasangan.',
    0: 'Masih kekanak-kanakan, gampang meledak-ledak, dan belum siap nerima pasangan apa adanya.',
  },
  C2: {
    80: 'Asik dan fleksibel! Kamu pinter menempatkan diri, gampang ngelebur ke keluarga besar dan lingkungan baru.',
    60: 'Komunikasi ke keluarga besar udah lumayan aman, tinggal melatih keluwesan pas nemu beda kultur keluarga.',
    40: 'Masih agak canggung atau segan pas harus berbaur dan beradaptasi sama keluarga/lingkungan pasangan.',
    0: 'Menutup diri dan susah banget buat beradaptasi sama pola interaksi keluarga besar pasangan.',
  },
  C3: {
    80: 'Paham tugas! Kamu udah kebayang dan siap banget ngejalani peran sebagai suami/istri di kehidupan nyata.',
    60: 'Paham konsep peran dan tanggung jawab harian, tinggal eksekusi prakteknya aja nanti pas nikah.',
    40: 'Masih belum kebayang riil-nya pembagian peran rumah tangga, kadang merasa berat membayangkan tugasnya.',
    0: 'Belum ada gambaran sama sekali dan belum siap memikul tanggung jawab domestik atau peran pernikahan.',
  },
  C4: {
    80: 'Keuangan aman! Mandiri secara ekonomi, pinter atur cashflow, dan punya plan finansial rumah tangga yang matang.',
    60: 'Penghasilan dan tabungan udah ada, tinggal diperbaiki strategi budgeting dan investasi masa depannya.',
    40: 'Udah ada pemasukan, tapi gaya hidup dan pola atur uang masih sering bocor halus di sana-sini.',
    0: 'Belum mandiri secara finansial atau masih bingung banget cara mengelola uang buat kebutuhan jangka panjang.',
  },
  C5: {
    80: 'Visi jelas! Mental kamu udah kuat buat setia selamanya dan bareng-bareng melangkah nyapai goal masa depan.',
    60: 'Tujuan masa depan udah ada gambaran kasar, tinggal dimatangkan lagi biar makin sevisi sama pasangan.',
    40: 'Masih sering cemas mikirin masa depan dan ragu apakah sanggup bertahan pas badai rumah tangga datang.',
    0: 'Belum punya gambaran visi masa depan dan gampang goyah kalau membayangkan komitmen jangka panjang.',
  },
  C6: {
    80: 'On track banget! Pemahaman agama dan niat ibadahmu dalam pernikahan udah jadi pondasi yang kokoh.',
    60: 'Dasar agama udah paham, tinggal konsistensi dalam menerapkan nilai-nilainya di kehidupan sehari-hari.',
    40: 'Tahu aturan agama dalam nikah, tapi masih belajar buat bener-bener mempraktikkannya secara bertahap.',
    0: 'Pemahaman norma agama masih minim banget, belum siap menjadikan nilai agama sebagai pedoman utama.',
  },
  C7: {
    80: 'Siap bermasyarakat! Paham etika lokal, aturan sosial, dan siap ambil peran positif di lingkungan tempat tinggal.',
    60: 'Udah paham etika umum bermasyarakat, tinggal membiasakan diri aktif dalam kegiatan lingkungan warga.',
    40: 'Masih agak cuek sama norma atau aturan masyarakat sekitar, lebih fokus ke urusan internal sendiri.',
    0: 'Belum siap atau enggan mematuhi etika dan tanggung jawab sosial sebagai bagian dari warga masyarakat.',
  },
}

export function interpret(percent, levelId) {
  let label, defaultNote
  if (percent >= 80) { label = 'Area Bintang ✨' }
  else if (percent >= 60) { label = 'Area Cukup Mantap 💪' }
  else if (percent >= 40) { label = 'Area Pertumbuhan 🌱' }
  else { label = 'Area Belum Terbiasa 🤍' }

  // Teks spesifik per level
  if (levelId && LEVEL_INTERPRETATIONS[levelId]) {
    const notes = LEVEL_INTERPRETATIONS[levelId]
    const note = percent >= 80 ? notes[80]
      : percent >= 60 ? notes[60]
      : percent >= 40 ? notes[40]
      : notes[0]
    return { label, note }
  }

  // Fallback generik
  if (percent >= 80) return { label, note: 'Aspek ini udah jadi kekuatan kamu. Pertahankan dan jadiin pondasi!' }
  if (percent >= 60) return { label, note: 'Udah lumayan siap, tinggal diasah lagi biar makin stabil.' }
  if (percent >= 40) return { label, note: 'Masih ada ruang buat belajar dan ngebangun kebiasaan di aspek ini.' }
  return { label, note: 'Belum terlalu kelihatan siap — nggak apa-apa, ini bisa dipersiapkan pelan-pelan.' }
}

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Sangat Tidak Setuju', emoji: '😤' },
  { value: 2, label: 'Tidak Setuju', emoji: '🙅' },
  { value: 3, label: 'Netral', emoji: '😐' },
  { value: 4, label: 'Setuju', emoji: '🙆' },
  { value: 5, label: 'Sangat Setuju', emoji: '😍' }
]

// Mekanik game unik per level + flavor (emoji, tagline, greeting, accent)
// Tidak ada 2 level berurutan dengan mekanik identik.
// Modul A pakai: tap2, swipe, quicktap, dragdrop, story
// Modul B pakai 3 varian likert: slider, emoji, dial
export const GAME_MECHANICS = {
  // === Modul A: Cinta Romantis ===
  A1: {
    type: 'pull-line', emoji: '👑', accent: '#b8a4d9',
    tagline: 'Cinta Sempurna', greeting: 'Tarik garis dari hati',
    hint: 'Tarik jari dari ikon tengah ke salah satu pilihan di penjuru.'
  },
  A2: {
    type: 'swipe', emoji: '⚓', accent: '#c8a8d4',
    tagline: 'Rasa Nyaman', greeting: 'Geser kartunya ya',
    leftLabel: 'Nggak Setuju', rightLabel: 'Setuju',
    hint: 'Swipe kiri = nggak, kanan = setuju.'
  },
  A3: {
    type: 'quicktap', emoji: '🌌', accent: '#d0b9e7',
    tagline: 'Kekuatan Cinta', greeting: 'Cepat jawab!',
    leftLabel: 'Salah', rightLabel: 'Benar',
    hint: 'Tap Benar kalau setuju, Salah kalau nggak. Jangan overthinking.'
  },
  A4: {
    type: 'dragdrop', emoji: '🌀', accent: '#b8a4d9',
    tagline: 'Pikiran Terus ke Sana', greeting: 'Masukkan ke zona yang cocok',
    leftLabel: 'Bukan Aku', rightLabel: 'Aku Banget',
    hint: 'Drag kartu ke kiri (bukan aku) atau kanan (aku banget).'
  },
  A5: {
    type: 'story', emoji: '🕯️', accent: '#c8a8d4',
    tagline: 'Jatuh Cinta Tiba-tiba', greeting: 'Bayangin skenarionya…',
    options: ['Setuju', 'Nggak Setuju'],
    hint: 'Pilih jawaban yang representatif dengan kondisi'
  },
  A6: {
    type: 'swipe', emoji: '⛵', accent: '#d0b9e7',
    tagline: 'Cinta yang Tumbuh', greeting: 'Geser ya',
    leftLabel: 'Bukan aku', rightLabel: 'Aku banget',
    hint: 'Pilih jawaban yang representatif dengan perasaanmu',
    cardHint: '← swipe kiri: bukan aku · swipe kanan: aku banget →'
  },
  A7: {
    type: 'dragdrop', emoji: '🕊️', accent: '#c8a8d4',
    tagline: 'Cinta Tanpa Syarat', greeting: 'Masukkan ke zona yang cocok',
    leftLabel: 'Bukan Aku', rightLabel: 'Aku Banget',
    hint: 'Drag kartu ke kiri atau kanan.'
  },
  A8: {
    type: 'story', emoji: '🕊️', accent: '#d0b9e7',
    tagline: 'Membangun Bersama', greeting: 'Bayangin skenarionya…',
    options: ['Setuju', 'Nggak Setuju'],
    hint: 'Pilih jawaban yang representatif dengan kondisi'
  },
  A9: {
    type: 'tap2', emoji: '⚡', accent: '#b8a4d9',
    tagline: 'Cinta yang Buta', greeting: 'Apa cinta versi kamu?',
    leftLabel: 'Setuju', rightLabel: 'Nggak',
    hint: 'Pilih jawaban yang representatif dengan perasaanmu'
  },
  A10: {
    type: 'story', emoji: '📜', accent: '#c8a8d4',
    tagline: 'Rela Berkorban', greeting: 'Bayangin skenarionya…',
    options: ['Setuju', 'Nggak Setuju'],
    hint: 'Pilih jawaban yang representatif dengan kondisi'
  },
  A11: {
    type: 'quicktap', emoji: '🌪️', accent: '#d0b9e7',
    tagline: 'Cinta Segalanya', greeting: 'Cepat jawab!',
    leftLabel: 'Salah', rightLabel: 'Benar',
    hint: 'Tap Benar kalau setuju, Salah kalau nggak.'
  },
  // === Modul B: Arus Bawah Laut (pilihan kartu sehat/tidak sehat) ===
  B1: {
    type: 'pull-line', emoji: '🌊', accent: '#c8a8d4',
    tagline: 'Palung Hangat Pelindung', greeting: 'Setiap kapten memiliki cara berbeda dalam menghadapi awak kapalnya.',
    hint: 'Pilih kejadian yang paling mengingatkanmu pada pengalamanmu.',
    centerIcon: '⚓',
    instruction: 'Tarik garis dari kemudi di tengah ke pilihan yang paling mengingatkanmu pada pengalaman 👆'
  },
  B2: {
    type: 'pull-line', emoji: '🗼', accent: '#d0b9e7',
    tagline: 'Mercusuar Utama', greeting: 'Tidak ada jawaban benar atau salah.',
    hint: 'Pilih kejadian yang paling sering atau paling mirip dengan apa yang kamu alami.',
    centerIcon: '🗼',
    instruction: 'Tarik garis dari mercusuar di tengah ke pilihan yang paling mirip dengan pengalamanmu 👆'
  },
  B3: {
    type: 'pull-line', emoji: '🧭', accent: '#c8a8d4',
    tagline: 'Samudra Bebas', greeting: 'Tidak ada pilihan benar atau salah.',
    hint: 'Pilih kejadian yang paling sering atau paling mirip dengan pengalamanmu.',
    centerIcon: '🧭',
    instruction: 'Tarik garis dari kompas di tengah ke pilihan yang paling mirip dengan pengalamanmu 👆'
  },
  B4: {
    type: 'pull-line', emoji: '⚓', accent: '#d0b9e7',
    tagline: 'Kedalaman Ekstrem', greeting: 'Tidak ada pilihan benar atau salah.',
    hint: 'Pilih kejadian yang paling sering atau paling mirip dengan pengalamanmu.',
    centerIcon: '⛵',
    instruction: 'Tarik garis dari kapal di tengah ke pilihan yang paling mirip dengan pengalamanmu 👆'
  },
  B5: {
    type: 'pull-line', emoji: '⛈️', accent: '#c8a8d4',
    tagline: 'Badai Bertubi', greeting: 'Tidak ada pilihan benar atau salah.',
    hint: 'Pilih kejadian yang paling sering atau paling mirip dengan pengalamanmu.',
    centerIcon: '☁️',
    instruction: 'Tarik garis dari awan di tengah ke pilihan yang paling mirip dengan pengalamanmu 👆'
  },
  B6: {
    type: 'pull-line', emoji: '🪸', accent: '#d0b9e7',
    tagline: 'Pemblokiran Karang Misterius', greeting: 'Tidak ada pilihan benar atau salah.',
    hint: 'Pilih kejadian yang paling sering atau paling mirip dengan pengalamanmu.',
    centerIcon: '🪸',
    instruction: 'Tarik garis dari karang di tengah ke pilihan yang paling mirip dengan pengalamanmu 👆'
  },
  B7: {
    type: 'pull-line', emoji: '🚨', accent: '#c8a8d4',
    tagline: 'Terumbu Tanpa Jangkar', greeting: 'Tidak ada pilihan benar atau salah.',
    hint: 'Pilih kejadian yang paling sering atau paling mirip dengan pengalamanmu.',
    centerIcon: '🚨',
    instruction: 'Tarik garis dari sirine di tengah ke pilihan yang paling mirip dengan pengalamanmu 👆'
  },
  // === Modul C: Ekspedisi Pondasi Bahtera (Likert 5 poin, 3 varian interaksi) ===
  C1: {
    type: 'likert-slider', emoji: '🛡️', accent: '#b8a4d9',
    tagline: 'Perisai Jiwa', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  },
  C2: {
    type: 'likert-emoji', emoji: '🕸️', accent: '#c8a8d4',
    tagline: 'Jaringan Aliansi', greeting: 'Pilih emoji yang cocok',
    hint: 'Tap emoji yang ngewakiliin perasaan kamu.'
  },
  C3: {
    type: 'likert-slider', emoji: '👑', accent: '#d0b9e7',
    tagline: 'Pembagian Singgasana', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  },
  C4: {
    type: 'likert-slider', emoji: '🌾', accent: '#b8a4d9',
    tagline: 'Lumbung Perbekalan', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  },
  C5: {
    type: 'likert-emoji', emoji: '🪨', accent: '#c8a8d4',
    tagline: 'Pondasi Karang', greeting: 'Pilih emoji yang cocok',
    hint: 'Tap emoji yang ngewakiliin perasaan kamu.'
  },
  C6: {
    type: 'likert-slider', emoji: '🧿', accent: '#d0b9e7',
    tagline: 'Kompas Spiritual', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  },
  C7: {
    type: 'likert-slider', emoji: '🏛️', accent: '#b8a4d9',
    tagline: 'Pijakan Tradisi', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  }
}

// === Data visual bersama (dipakai peta & hasil) ===
export const LEVEL_EMOJI = {
  // Modul A: Peta Samudra Rasa
  A1: '👑', A2: '⚓', A3: '🌌', A4: '🌀', A5: '🕯️', A6: '⛵', A7: '🕊️',
  A8: '🧭', A9: '⚡', A10: '📜', A11: '🌪️',
  // Modul B: Arus Bawah Laut
  B1: '🌊', B2: '🗼', B3: '🧭', B4: '⚓', B5: '⛈️', B6: '🪸', B7: '🚨',
  // Modul C: Ekspedisi Pondasi Bahtera
  C1: '🛡️', C2: '🕸️', C3: '👑', C4: '🌾', C5: '🪨', C6: '🧿', C7: '🏛️'
}

export const LEVEL_GRADIENT = {
  A1: 'linear-gradient(135deg,#f9c5d1,#b8a4d9)', A2: 'linear-gradient(135deg,#c8a8d4,#9b82c4)',
  A3: 'linear-gradient(135deg,#d0b9e7,#b8a4d9)', A4: 'linear-gradient(135deg,#b8a4d9,#7f5fa8)',
  A5: 'linear-gradient(135deg,#f0d1ef,#b8a4d9)',
  A6: 'linear-gradient(135deg,#c4e8c4,#9b82c4)', A7: 'linear-gradient(135deg,#f0f0f5,#b8a4d9)',
  A8: 'linear-gradient(135deg,#b8a4d9,#d0b9e7)', A9: 'linear-gradient(135deg,#e8c8d4,#b8a4d9)',
  A10: 'linear-gradient(135deg,#d8b8c0,#9b82c4)', A11: 'linear-gradient(135deg,#f0a0a0,#c45050)',
  B1: 'linear-gradient(135deg,#a8d0e8,#9b82c4)', B2: 'linear-gradient(135deg,#f0e8c8,#9b82c4)',
  B3: 'linear-gradient(135deg,#c8e8d4,#9b82c4)', B4: 'linear-gradient(135deg,#d0d8e8,#9b82c4)',
  B5: 'linear-gradient(135deg,#e8d0d0,#9b82c4)', B6: 'linear-gradient(135deg,#d8e8c8,#9b82c4)',
  B7: 'linear-gradient(135deg,#e8c8d8,#9b82c4)',
  C1: 'linear-gradient(135deg,#a8d0e8,#9b82c4)', C2: 'linear-gradient(135deg,#c8e8d4,#9b82c4)',
  C3: 'linear-gradient(135deg,#e8e0a8,#9b82c4)', C4: 'linear-gradient(135deg,#f0d8a0,#9b82c4)',
  C5: 'linear-gradient(135deg,#e8c8d0,#9b82c4)', C6: 'linear-gradient(135deg,#d0d8c4,#9b82c4)',
  C7: 'linear-gradient(135deg,#c8d0e8,#9b82c4)'
}
