// Data lengkap 20 level & 49 item Jovely (makna dipertahankan persis dari Jovely.md)
// Modul A: Cinta Romantis (12 level, 31 item) - jawaban Setuju/Tidak Setuju
// Modul B: Kesiapan Menikah (8 level, 18 item) - skala Likert 5 poin, F/UF reverse-score

export const MODULES = [
  {
    id: 'A',
    name: 'Cinta Romantis',
    subtitle: 'Eksplorasi pandangan cinta kamu',
    order: 1,
    levels: [
      {
        id: 'A1', order: 1, name: 'Consummate Love', icon: 'complete',
        items: [
          { id: 'A1.1', text: 'Cinta itu gabungan dari perhatian, komitmen, saling paham, tanggung jawab, penghargaan, dan kepercayaan ke pasangan.' }
        ]
      },
      {
        id: 'A2', order: 2, name: 'Attachment', icon: 'attach',
        items: [
          { id: 'A2.1', text: 'Mencintai seseorang apa adanya — baik dulu, sekarang, maupun nanti.' },
          { id: 'A2.2', text: '"Rumah" itu di mana pun berada bareng orang yang dicintai, meski sering pindah-pindah.' },
          { id: 'A2.3', text: 'Cinta bukan soal nemuin orang buat hidup bareng, tapi nemuin orang yang bikin kamu ngerasa nggak bisa hidup tanpanya.' }
        ]
      },
      {
        id: 'A3', order: 3, name: 'Transcendence', icon: 'sparkle',
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
        id: 'A4', order: 4, name: 'Limerence', icon: 'obsessed',
        items: [
          { id: 'A4.1', text: 'Pas lagi jatuh cinta, pikiran terus-terusan ke orang itu.' },
          { id: 'A4.2', text: 'Kamu nggak akan tahu seberapa dalam seseorang bisa mencintai.' },
          { id: 'A4.3', text: 'Jatuh cinta kadang bikin orang jadi nggak masuk akal/bodoh.' },
          { id: 'A4.4', text: 'Cinta itu kondisi di mana kebahagiaan pasangan ikut nentuin kebahagiaan diri sendiri.' }
        ]
      },
      {
        id: 'A5', order: 5, name: 'Infatuated Love', icon: 'spark',
        items: [
          { id: 'A5.1', text: 'Orang bisa jatuh cinta tanpa alasan jelas, bahkan tanpa direncanain — cinta emang nggak bisa diatur.' }
        ]
      },
      {
        id: 'A6', order: 6, name: 'Companionate Love', icon: 'companion',
        items: [
          { id: 'A6.1', text: 'Cinta yang tulus itu nggak pernah benar-benar berakhir.' },
          { id: 'A6.2', text: 'Cinta itu terbentuk dari semua hal yang udah dilalui bareng seseorang.' },
          { id: 'A6.3', text: 'Cinta itu nggak tunduk sama waktu — dia melampaui waktu.' }
        ]
      },
      {
        id: 'A7', order: 7, name: 'Attraction', icon: 'magnet',
        items: [
          { id: 'A7.1', text: 'Cinta itu kayak satu jiwa yang menyatu di dua orang.' },
          { id: 'A7.2', text: 'Cinta sering muncul justru dari ketemunya dua sisi rapuh/lemah dua orang.' },
          { id: 'A7.3', text: 'Sebelum jatuh cinta sama seseorang, rasanya banyak hal belum terasa bermakna.' }
        ]
      },
      {
        id: 'A8', order: 8, name: 'Agape', icon: 'halo',
        items: [
          { id: 'A8.1', text: 'Cinta yang paling kuat itu justru yang berani nunjukin sisi rapuhnya.' },
          { id: 'A8.2', text: 'Mencintai seseorang apa adanya, tanpa syarat.' },
          { id: 'A8.3', text: 'Cinta yang dikasih dengan tulus/ikhlas justru yang bakal bertahan lama.' },
          { id: 'A8.4', text: 'Cinta itu bisa ngalahin apa pun.' }
        ]
      },
      {
        id: 'A9', order: 9, name: 'Pragma', icon: 'handshake',
        items: [
          { id: 'A9.1', text: 'Daripada capek nyari pasangan yang sempurna, mending fokus bangun hubungan yang sempurna bareng-bareng.' }
        ]
      },
      {
        id: 'A10', order: 10, name: 'Fatuous Love', icon: 'blindfold',
        items: [
          { id: 'A10.1', text: 'Cinta itu buta — kadang bikin nggak lihat kekurangan orang yang dicintai.' }
        ]
      },
      {
        id: 'A11', order: 11, name: 'Commitment', icon: 'flag',
        items: [
          { id: 'A11.1', text: 'Rela ngelakuin apa aja demi orang yang dicintai.' }
        ]
      },
      {
        id: 'A12', order: 12, name: 'Mania', icon: 'fire',
        items: [
          { id: 'A12.1', text: 'Yang dibutuhkan cuma cinta — cinta itu segalanya.' }
        ]
      }
    ]
  },
  {
    id: 'B',
    name: 'Kesiapan Menikah',
    subtitle: 'Ukur kesiapan kamu',
    order: 2,
    levels: [
      {
        id: 'B1', order: 13, name: 'Kesiapan Emosi', icon: 'emotion',
        items: [
          { id: 'B1.1', polarity: 'UF', text: 'Pengalaman menyakitkan di masa lalu bikin ragu untuk berkomitmen menikah.' },
          { id: 'B1.2', polarity: 'UF', text: 'Takut kalau masalah/trauma masa lalu akan mengganggu kebahagiaan pernikahan di masa depan.' }
        ]
      },
      {
        id: 'B2', order: 14, name: 'Kesiapan Sosial', icon: 'social',
        items: [
          { id: 'B2.1', polarity: 'F', text: 'Nyaman menghabiskan waktu senggang bareng orang lain.' },
          { id: 'B2.2', polarity: 'F', text: 'Senang kenalan dan bertemu orang baru.' },
          { id: 'B2.3', polarity: 'UF', text: 'Lebih milih di rumah aja daripada ngobrol/bersosialisasi dengan tetangga.' }
        ]
      },
      {
        id: 'B3', order: 15, name: 'Kesiapan Peran', icon: 'role',
        items: [
          { id: 'B3.1', polarity: 'UF', text: 'Merasa keterbukaan dengan pasangan nggak membantu dalam berbagi peran rumah tangga.' },
          { id: 'B3.2', polarity: 'F', text: 'Nggak keberatan kalau suami-istri berbagi peran dan tugas pekerjaan rumah tangga.' },
          { id: 'B3.3', polarity: 'UF', text: 'Merasa keberatan kalau harus berbagi tugas pekerjaan rumah dengan pasangan.' }
        ]
      },
      {
        id: 'B4', order: 16, name: 'Kesiapan Finansial', icon: 'finance',
        items: [
          { id: 'B4.1', polarity: 'F', text: 'Sebelum menikah, harus sudah punya pekerjaan atau penghasilan.' },
          { id: 'B4.2', polarity: 'UF', text: 'Menurutku pekerjaan dan penghasilan nggak berpengaruh terhadap pernikahan.' },
          { id: 'B4.3', polarity: 'UF', text: 'Nggak punya penghasilan/pekerjaan sebelum atau sesudah menikah itu hal yang wajar.' }
        ]
      },
      {
        id: 'B5', order: 17, name: 'Kesiapan Agama', icon: 'religion',
        items: [
          { id: 'B5.1', polarity: 'F', text: 'Harus menikah dengan pasangan yang agamanya sama.' },
          { id: 'B5.2', polarity: 'F', text: 'Mempelajari dan menyiapkan ilmu agama itu penting sebagai bekal berumah tangga.' }
        ]
      },
      {
        id: 'B6', order: 18, name: 'Kesiapan Norma Masyarakat', icon: 'norms',
        items: [
          { id: 'B6.1', polarity: 'F', text: 'Sadar bahwa pacaran itu sesuatu yang nggak sesuai dengan norma masyarakat.' },
          { id: 'B6.2', polarity: 'UF', text: 'Merasa pacaran dan kontak fisik itu hal yang wajar menurut norma masyarakat.' }
        ]
      },
      {
        id: 'B7', order: 19, name: 'Kesiapan Mental', icon: 'mental',
        items: [
          { id: 'B7.1', polarity: 'UF', text: 'Belum punya rencana untuk membangun kehidupan berumah tangga.' }
        ]
      },
      {
        id: 'B8', order: 20, name: 'Kesiapan Menerima Satu Sama Lain', icon: 'acceptance',
        items: [
          { id: 'B8.1', polarity: 'F', text: 'Siap mengutamakan kebutuhan pasangan di atas kebutuhan pribadi.' },
          { id: 'B8.2', polarity: 'F', text: 'Akan tetap menghargai pekerjaan pasangan meskipun penghasilannya kecil.' }
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

// daftar mekanik game per level (dipilih sesuai jumlah item & nuansa dimensi)
export const GAME_MECHANICS = {
  A1: { type: 'tap-card', label: 'Tap Kartu' },
  A2: { type: 'swipe', label: 'Swipe' },
  A3: { type: 'quick-tap', label: 'Tap Cepat' },
  A4: { type: 'swipe', label: 'Swipe' },
  A5: { type: 'tap-card', label: 'Tap Kartu' },
  A6: { type: 'quick-tap', label: 'Tap Cepat' },
  A7: { type: 'swipe', label: 'Swipe' },
  A8: { type: 'tap-card', label: 'Tap Kartu' },
  A9: { type: 'tap-card', label: 'Tap Kartu' },
  A10: { type: 'tap-card', label: 'Tap Kartu' },
  A11: { type: 'tap-card', label: 'Tap Kartu' },
  A12: { type: 'tap-card', label: 'Tap Kartu' },
  B1: { type: 'likert', label: 'Likert' },
  B2: { type: 'likert', label: 'Likert' },
  B3: { type: 'likert', label: 'Likert' },
  B4: { type: 'likert', label: 'Likert' },
  B5: { type: 'likert', label: 'Likert' },
  B6: { type: 'likert', label: 'Likert' },
  B7: { type: 'likert', label: 'Likert' },
  B8: { type: 'likert', label: 'Likert' }
}
