import { useNavigate } from 'react-router-dom'
import { Topbar } from '../components/Layout'

export default function Contact() {
  const nav = useNavigate()
  return (
    <div className="app-wrap">
      <Topbar title="Hubungi Admin/CS" onBack={() => nav('/profile')} />
      <div className="page fade-in">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48 }}>💬</div>
          <h3 className="h-title" style={{ fontSize: 18, marginTop: 8 }}>Butuh Bantuan?</h3>
          <p className="muted" style={{ margin: '8px 0 16px', fontSize: 14 }}>
            Hubungi admin/CS Jovely via channel berikut. Kami siap bantu!
          </p>
        </div>

        <a href="mailto:jovelycenter@gmail.com" className="btn lk-submit">
          ✉️ Email
        </a>

        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Jam Operasional</h3>
          <div className="col" style={{ gap: 6, fontSize: 14 }}>
            <div className="between"><span className="muted">Senin - Jumat</span><strong>09.00 - 17.00 WIB</strong></div>
            <div className="between"><span className="muted">Sabtu</span><strong>09.00 - 13.00 WIB</strong></div>
            <div className="between"><span className="muted">Minggu & Libur</span><strong>Tutup</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
