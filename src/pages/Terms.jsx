import { useNavigate } from 'react-router-dom'
import { Topbar } from '../components/Layout'

export default function Terms() {
  const nav = useNavigate()
  return (
    <div className="app-wrap">
      <Topbar title="Syarat & Ketentuan" onBack={() => nav('/profile')} />
      <div className="page fade-in">
        <div className="card">
          <h3 className="h-title" style={{ fontSize: 18, marginBottom: 12 }}>Syarat & Ketentuan Jovely</h3>
          <p className="muted" style={{ marginBottom: 12 }}>Terakhir diperbarui: 2026</p>
          <div className="col" style={{ gap: 16, fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)' }}>
            <p><strong>1. Penggunaan Aplikasi</strong><br />Jovely adalah aplikasi self recovery reflektif untuk dewasa muda (21-35). Dengan menggunakan aplikasi, kamu setuju untuk menggunakan hasil secara reflektif dan tidak menggantikan konsultasi profesional.</p>
            <p><strong>2. Akun</strong><br />Kamu wajib memberikan data akun yang valid (nama, usia, jenis kelamin, nomor HP, password). Kamu bertanggung jawab menjaga kerahasiaan password.</p>
            <p><strong>3. Data & Privasi</strong><br />Data jawaban disimpan untuk keperluan perhitungan skor & riwayat hasil. Kami tidak membagikan data pribadi ke pihak ketiga.</p>
            <p><strong>4. Sifat Hasil</strong><br />Hasil bersifat reflektif-edukatif, bukan diagnosis klinis atau vonis "siap/tidak siap". Untuk keputusan penting, konsultasi dengan konselor/psikolog.</p>
            <p><strong>5. Perubahan Layanan</strong><br />Kami dapat memperbarui layanan, item, atau kebijakan sewaktu-waktu. Perubahan signifikan akan diumumkan di aplikasi.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
