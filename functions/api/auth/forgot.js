import { json, err, normalizePhone, randomToken } from '../../_lib.js'

// Lupa password: generate reset token, "kirim" via response (MVP: tampilkan token langsung)
// Pada produksi: kirim via WhatsApp/SMS gateway. Untuk MVP free, user lihat token di layar.
export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}))
  const { phone } = body
  if (!phone) return err('Nomor HP wajib diisi')

  const normPhone = normalizePhone(phone)
  const row = await env.DB.prepare('SELECT id, name FROM users WHERE phone = ?').bind(normPhone).first()
  if (!row) return err('Nomor HP tidak ditemukan')

  const token = randomToken(6).replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()
  const expires = new Date(Date.now() + 1000 * 60 * 15).toISOString() // 15 menit
  await env.DB.prepare(
    'INSERT INTO reset_tokens (token, user_id, expires_at) VALUES (?,?,?)'
  ).bind(token, row.id, expires).run()

  // MVP: return token agar bisa diuji tanpa gateway SMS/WA
  return json({ ok: true, token, expiresIn: 15, message: 'Kode reset dibuat. (MVP: tampilkan langsung.)' })
}
