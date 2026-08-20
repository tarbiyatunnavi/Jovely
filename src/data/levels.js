// Data lengkap 20 level & 49 item Jovely (makna dipertahankan persis dari Jovely.md)
// Modul A: Cinta Romantis (12 level, 31 item) - jawaban Setuju/Tidak Setuju
// Modul B: Kesiapan Menikah (8 level, 18 item) - skala Likert 5 poin, F/UF reverse-score

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
          { id: 'A1.1', text: 'Cinta itu gabungan dari perhatian, komitmen, saling paham, tanggung jawab, penghargaan, dan kepercayaan ke pasangan.' }
        ]
      },
      {
        id: 'A2', order: 2, name: 'Jangkar Pelabuhan Utama', icon: 'attach',
        items: [
          { id: 'A2.1', text: 'Mencintai seseorang apa adanya — baik dulu, sekarang, maupun nanti.' },
          { id: 'A2.2', text: '"Rumah" itu di mana pun berada bareng orang yang dicintai, meski sering pindah-pindah.' },
          { id: 'A2.3', text: 'Cinta bukan soal nemuin orang buat hidup bareng, tapi nemuin orang yang bikin kamu ngerasa nggak bisa hidup tanpanya.' }
        ]
      },
      {
        id: 'A3', order: 3, name: 'Lembah Ketenangan Jiwa', icon: 'sparkle',
        items: [
          { id: 'A3.1', text: 'Dicintai dengan tulus sama seseorang bikin ngerasa lebih kuat.' },
          { id: 'A3.2', text: 'Cinta bisa bikin pasangan jadi versi yang lebih kuat dan lebih baik.' },
          { id: 'A3.3', text: 'Kalau lagi cinta, rasanya bisa ngelakuin apa aja.' },
          { id: 'A3.4', text: 'Hidup itu kayak permainan buat semua orang, dan cinta adalah hadiahnya.' },
          { id: 'A3.5', text: 'Pelajaran paling berharga dalam hidup adalah belajar mencintai dan dicintai balik.' },
          { id: 'A3.6', text: 'Jatuh cinta rasanya kayak lagi di surga.' },
          { id: 'A3.7', text: 'Cinta itu yang bikin segala sesuatu jadi punya makna.' },
          { id: 'A3.8', text: 'Cinta romantis adalah bentuk kebahagiaan tertinggi dalam hidup.' }
        ]
      },
      {
        id: 'A4', order: 4, name: 'Badai Magnetik', icon: 'obsessed',
        items: [
          { id: 'A4.1', text: 'Pas lagi jatuh cinta, pikiran terus-terusan ke orang itu.' },
          { id: 'A4.2', text: 'Kamu nggak akan tahu seberapa dalam seseorang bisa mencintai.' },
          { id: 'A4.3', text: 'Jatuh cinta kadang bikin orang jadi nggak masuk akal/bodoh.' },
          { id: 'A4.4', text: 'Cinta itu kondisi di mana kebahagiaan pasangan ikut nentuin kebahagiaan diri sendiri.' }
        ]
      },
      {
        id: 'A5', order: 5, name: 'Lentera Percik Api', icon: 'spark',
        items: [
          { id: 'A5.1', text: 'Orang bisa jatuh cinta tanpa alasan jelas, bahkan tanpa direncanakan – cinta memang nggak bisa diatur.' },
          { id: 'A5.2', text: 'Cinta yang tulus itu nggak pernah benar-benar berakhir.' },
          { id: 'A5.3', text: 'Cinta itu terbentuk dari semua hal yang udah dilalui bareng seseorang.' },
          { id: 'A5.4', text: 'Cinta itu nggak tunduk sama waktu - dia melampaui waktu.' }
        ]
      },
      {
        id: 'A6', order: 6, name: 'Bahtera Sahabat Sejati', icon: 'companion',
        items: [
          { id: 'A6.1', text: 'Cinta itu kayak satu jiwa yang menyatu di dua orang.' },
          { id: 'A6.2', text: 'Cinta sering muncul justru dari ketemunya dua sisi rapuh/lemah dua orang.' },
          { id: 'A6.3', text: 'Sebelum jatuh cinta sama seseorang, rasanya banyak hal belum terasa bermakna.' }
        ]
      },
      {
        id: 'A7', order: 7, name: 'Mata Air Ketulusan', icon: 'halo',
        items: [
          { id: 'A7.1', text: 'Cinta yang paling kuat itu justru yang berani nunjukin sisi rapuhnya.' },
          { id: 'A7.2', text: 'Mencintai seseorang apa adanya, tanpa syarat.' },
          { id: 'A7.3', text: 'Cinta yang dikasih dengan tulus/ikhlas justru yang bakal bertahan lama.' },
          { id: 'A7.4', text: 'Cinta itu bisa ngalahin apa pun.' }
        ]
      },
      {
        id: 'A8', order: 8, name: 'Kompas Logika', icon: 'handshake',
        items: [
          { id: 'A8.1', text: 'Daripada capek nyari pasangan yang sempurna, mending fokus bangun hubungan yang sempurna bareng-bareng.' }
        ]
      },
      {
        id: 'A9', order: 9, name: 'Kilat Tanpa Akar', icon: 'blindfold',
        items: [
          { id: 'A9.1', text: 'Cinta itu buta — kadang bikin nggak lihat kekurangan orang yang dicintai.' }
        ]
      },
      {
        id: 'A10', order: 10, name: 'Sumpah Penjaga Takdir', icon: 'flag',
        items: [
          { id: 'A10.1', text: 'Rela ngelakuin apa aja demi orang yang dicintai.' }
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
    name: 'Ekspedisi Pondasi Bahtera',
    subtitle: 'Ukur kesiapan perjalananmu',
    order: 2,
    levels: [
      {
        id: 'B1', order: 13, name: 'Perisai Jiwa', icon: 'emotion',
        items: [
          { id: 'B1.1', polarity: 'F', text: 'Siap mengutamakan kebutuhan pasangan di atas kebutuhan pribadi.' },
          { id: 'B1.2', polarity: 'UF', text: 'Merasa keterbukaan dengan pasangan nggak membantu dalam berbagi peran rumah tangga.' },
          { id: 'B1.3', polarity: 'UF', text: 'Pengalaman menyakitkan di masa lalu bikin ragu untuk berkomitmen menikah.' },
          { id: 'B1.4', polarity: 'UF', text: 'Takut kalau masalah/trauma masa lalu akan mengganggu kebahagiaan pernikahan di masa depan.' }
        ]
      },
      {
        id: 'B2', order: 14, name: 'Jaringan Aliansi', icon: 'social',
        items: [
          { id: 'B2.1', polarity: 'F', text: 'Nyaman menghabiskan waktu senggang bareng orang lain.' },
          { id: 'B2.2', polarity: 'F', text: 'Senang kenalan dan bertemu orang baru.' },
          { id: 'B2.3', polarity: 'UF', text: 'Lebih milih di rumah aja daripada ngobrol/bersosialisasi dengan tetangga.' }
        ]
      },
      {
        id: 'B3', order: 15, name: 'Pembagian Singgasana', icon: 'role',
        items: [
          { id: 'B3.1', polarity: 'F', text: 'Nggak keberatan kalau suami-istri berbagi peran dan tugas pekerjaan rumah tangga.' },
          { id: 'B3.2', polarity: 'UF', text: 'Merasa keberatan kalau harus berbagi tugas pekerjaan rumah dengan pasangan.' }
        ]
      },
      {
        id: 'B4', order: 16, name: 'Lumbung Perbekalan', icon: 'finance',
        items: [
          { id: 'B4.1', polarity: 'F', text: 'Sebelum menikah, harus sudah punya pekerjaan atau penghasilan.' },
          { id: 'B4.2', polarity: 'F', text: 'Akan tetap menghargai pekerjaan pasangan meskipun penghasilannya kecil.' },
          { id: 'B4.3', polarity: 'UF', text: 'Menurutku pekerjaan dan penghasilan nggak berpengaruh terhadap pernikahan.' },
          { id: 'B4.4', polarity: 'UF', text: 'Nggak punya penghasilan/pekerjaan sebelum atau sesudah menikah itu hal yang wajar.' }
        ]
      },
      {
        id: 'B5', order: 17, name: 'Pondasi Karang', icon: 'mental',
        items: [
          { id: 'B5.1', polarity: 'UF', text: 'Belum punya rencana untuk membangun kehidupan berumah tangga.' }
        ]
      },
      {
        id: 'B6', order: 18, name: 'Kompas Spiritual', icon: 'religion',
        items: [
          { id: 'B6.1', polarity: 'F', text: 'Harus menikah dengan pasangan yang agamanya sama.' },
          { id: 'B6.2', polarity: 'F', text: 'Mempelajari dan menyiapkan ilmu agama itu penting sebagai bekal berumah tangga.' }
        ]
      },
      {
        id: 'B7', order: 19, name: 'Pijakan Tradisi', icon: 'norms',
        items: [
          { id: 'B7.1', polarity: 'F', text: 'Sadar bahwa pacaran itu sesuatu yang nggak sesuai dengan norma masyarakat.' },
          { id: 'B7.2', polarity: 'UF', text: 'Merasa pacaran dan kontak fisik itu hal yang wajar menurut norma masyarakat.' }
        ]
      }
    ]
  }
]

export const ALL_LEVELS = MODULES.flatMap(m => m.levels)
export const TOTAL_LEVELS = ALL_LEVELS.length // 20
export const TOTAL_ITEMS = ALL_LEVELS.reduce((s, l) => s + l.items.length, 0) // 49

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
export function scoreLoveStyles(levelAnswers) {
  // levelAnswers: { [levelId]: { [itemId]: 'agree'|'disagree' } }
  const scores = {}
  MODULES[0].levels.forEach(level => {
    let agree = 0, total = 0
    level.items.forEach(item => {
      const ans = levelAnswers[level.id]?.[item.id]
      if (ans) {
        total++
        if (ans === 'agree') agree++
      }
    })
    scores[level.id] = {
      levelId: level.id,
      name: level.name,
      agree,
      total,
      percent: total > 0 ? Math.round((agree / total) * 100) : 0,
      answered: total === level.items.length
    }
  })
  const ranking = Object.values(scores).sort((a, b) => b.percent - a.percent)
  const top = ranking.filter(s => s.answered).slice(0, 5)
  return { scores, ranking, top }
}

// Modul B: skor per dimensi & total (Likert 5 poin: 1-5, UF di-reverse)
export function scoreMarriageReadiness(levelAnswers) {
  const LIKERT = { 1: 'Sangat Tidak Setuju', 2: 'Tidak Setuju', 3: 'Netral', 4: 'Setuju', 5: 'Sangat Setuju' }
  const dims = {}
  let totalRaw = 0, totalMax = 0

  MODULES[1].levels.forEach(level => {
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
export function interpret(percent) {
  if (percent >= 80) return { label: 'Area Bintang ✨', note: 'Aspek ini udah jadi kekuatan kamu. Pertahankan dan jadiin pondasi!' }
  if (percent >= 60) return { label: 'Area Cukup Mantap 💪', note: 'Udah lumayan siap, tinggal diasah lagi biar makin stabil.' }
  if (percent >= 40) return { label: 'Area Pertumbuhan 🌱', note: 'Masih ada ruang buat belajar dan ngebangun kebiasaan di aspek ini.' }
  return { label: 'Area Belum Terbiasa 🤍', note: 'Belum terlalu kelihatan siap — nggak apa-apa, ini bisa dipersiapkan pelan-pelan.' }
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
    type: 'pour-love', emoji: '💞', accent: '#b8a4d9',
    tagline: 'Cinta Sempurna', greeting: 'Tuang Cat Cinta',
    hint: 'Tuang cat ke gelas yang rasanya pas. Murni ekspresi diri, bukan menang/kalah.'
  },
  A2: {
    type: 'swipe', emoji: '🏠', accent: '#c8a8d4',
    tagline: 'Rasa Nyaman', greeting: 'Geser kartunya ya',
    leftLabel: 'Nggak Setuju', rightLabel: 'Setuju',
    hint: 'Swipe kiri = nggak, kanan = setuju.'
  },
  A3: {
    type: 'quicktap', emoji: '✨', accent: '#d0b9e7',
    tagline: 'Kekuatan Cinta', greeting: 'Cepat jawab!',
    leftLabel: 'Salah', rightLabel: 'Benar',
    hint: 'Tap Benar kalau setuju, Salah kalau nggak. Jangan overthinking.'
  },
  A4: {
    type: 'dragdrop', emoji: '🧲', accent: '#b8a4d9',
    tagline: 'Pikiran Terus ke Sana', greeting: 'Masukkan ke zona yang cocok',
    leftLabel: 'Bukan Aku', rightLabel: 'Aku Banget',
    hint: 'Drag kartu ke kiri (bukan aku) atau kanan (aku banget).'
  },
  A5: {
    type: 'story', emoji: '⚡', accent: '#c8a8d4',
    tagline: 'Jatuh Cinta Tiba-tiba', greeting: 'Bayangin skenarionya…',
    options: ['Setuju', 'Nggak Setuju'],
    hint: 'Pilih respons yang paling mirip sama kamu.'
  },
  A6: {
    type: 'swipe', emoji: '🌱', accent: '#d0b9e7',
    tagline: 'Cinta yang Tumbuh', greeting: 'Geser ya',
    leftLabel: 'Nggak Setuju', rightLabel: 'Setuju',
    hint: 'Swipe kiri = nggak, kanan = setuju.'
  },
  A7: {
    type: 'dragdrop', emoji: '🤍', accent: '#c8a8d4',
    tagline: 'Cinta Tanpa Syarat', greeting: 'Masukkan ke zona yang cocok',
    leftLabel: 'Bukan Aku', rightLabel: 'Aku Banget',
    hint: 'Drag kartu ke kiri atau kanan.'
  },
  A8: {
    type: 'story', emoji: '🤝', accent: '#d0b9e7',
    tagline: 'Membangun Bersama', greeting: 'Bayangin skenarionya…',
    options: ['Setuju', 'Nggak Setuju'],
    hint: 'Pilih respons yang paling mirip sama kamu.'
  },
  A9: {
    type: 'tap2', emoji: '🙈', accent: '#b8a4d9',
    tagline: 'Cinta yang Buta', greeting: 'Apa cinta versi kamu?',
    leftLabel: 'Setuju', rightLabel: 'Nggak',
    hint: 'Tap kartu yang sesuai perasaan kamu.'
  },
  A10: {
    type: 'story', emoji: '🚩', accent: '#c8a8d4',
    tagline: 'Rela Berkorban', greeting: 'Bayangin skenarionya…',
    options: ['Setuju', 'Nggak Setuju'],
    hint: 'Pilih respons yang paling mirip sama kamu.'
  },
  A11: {
    type: 'quicktap', emoji: '🔥', accent: '#d0b9e7',
    tagline: 'Cinta Segalanya', greeting: 'Cepat jawab!',
    leftLabel: 'Salah', rightLabel: 'Benar',
    hint: 'Tap Benar kalau setuju, Salah kalau nggak.'
  },
  // === Modul B: Kesiapan Menikah (Likert 5 poin, 3 varian interaksi) ===
  B1: {
    type: 'likert-slider', emoji: '💧', accent: '#b8a4d9',
    tagline: 'Perisai Jiwa', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  },
  B2: {
    type: 'likert-emoji', emoji: '👥', accent: '#c8a8d4',
    tagline: 'Jaringan Aliansi', greeting: 'Pilih emoji yang cocok',
    hint: 'Tap emoji yang ngewakiliin perasaan kamu.'
  },
  B3: {
    type: 'likert-dial', emoji: '⚖️', accent: '#d0b9e7',
    tagline: 'Pembagian Singgasana', greeting: 'Puter dial-nya',
    hint: 'Puter dial ke tingkat setuju yang kamu mau.'
  },
  B4: {
    type: 'likert-slider', emoji: '💰', accent: '#b8a4d9',
    tagline: 'Lumbung Perbekalan', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  },
  B5: {
    type: 'likert-emoji', emoji: '🧠', accent: '#c8a8d4',
    tagline: 'Pondasi Karang', greeting: 'Pilih emoji yang cocok',
    hint: 'Tap emoji yang ngewakiliin perasaan kamu.'
  },
  B6: {
    type: 'likert-dial', emoji: '🕌', accent: '#d0b9e7',
    tagline: 'Kompas Spiritual', greeting: 'Puter dial-nya',
    hint: 'Puter dial ke tingkat setuju yang kamu mau.'
  },
  B7: {
    type: 'likert-slider', emoji: '🌐', accent: '#b8a4d9',
    tagline: 'Pijakan Tradisi', greeting: 'Geser slider-nya',
    hint: 'Geser dari Sangat Tidak Setuju sampai Sangat Setuju.'
  }
}

// === Data visual bersama (dipakai peta & hasil) ===
export const LEVEL_EMOJI = {
  A1: '💞', A2: '🏠', A3: '✨', A4: '🧲', A5: '⚡', A6: '🌱', A7: '🤍',
  A8: '🤝', A9: '🙈', A10: '🚩', A11: '🔥',
  B1: '💧', B2: '👥', B3: '⚖️', B4: '💰', B5: '🧠', B6: '🕌', B7: '🌐'
}

export const LEVEL_GRADIENT = {
  A1: 'linear-gradient(135deg,#f9c5d1,#b8a4d9)', A2: 'linear-gradient(135deg,#c8a8d4,#9b82c4)',
  A3: 'linear-gradient(135deg,#d0b9e7,#b8a4d9)', A4: 'linear-gradient(135deg,#b8a4d9,#7f5fa8)',
  A5: 'linear-gradient(135deg,#f0d1ef,#b8a4d9)',
  A6: 'linear-gradient(135deg,#c4e8c4,#9b82c4)', A7: 'linear-gradient(135deg,#f0f0f5,#b8a4d9)',
  A8: 'linear-gradient(135deg,#b8a4d9,#d0b9e7)', A9: 'linear-gradient(135deg,#e8c8d4,#b8a4d9)',
  A10: 'linear-gradient(135deg,#d8b8c0,#9b82c4)', A11: 'linear-gradient(135deg,#f0a0a0,#c45050)',
  B1: 'linear-gradient(135deg,#a8d0e8,#9b82c4)', B2: 'linear-gradient(135deg,#c8e8d4,#9b82c4)',
  B3: 'linear-gradient(135deg,#e8e0a8,#9b82c4)', B4: 'linear-gradient(135deg,#f0d8a0,#9b82c4)',
  B5: 'linear-gradient(135deg,#e8c8d0,#9b82c4)', B6: 'linear-gradient(135deg,#d0d8c4,#9b82c4)',
  B7: 'linear-gradient(135deg,#c8d0e8,#9b82c4)'
}
