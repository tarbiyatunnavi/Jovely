import { json, err, verifyPassword, makeSession, normalizePhone } from '../../_lib.js'

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}))
  const { phone, password } = body
  if (!phone || !password) return err('Nomor HP & password wajib diisi')

  const normPhone = normalizePhone(phone)
  const row = await env.DB.prepare(
    'SELECT id, name, age, gender, phone, password_hash FROM users WHERE phone = ?'
  ).bind(normPhone).first()
  if (!row) return err('Nomor HP atau password salah', 401)

  const ok = await verifyPassword(password, row.password_hash)
  if (!ok) return err('Nomor HP atau password salah', 401)

  const { password_hash, ...user } = row
  const token = makeSession(user.id)
  return json({ ok: true, token, user })
}
