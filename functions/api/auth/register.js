import { json, err, hashPassword, verifyPassword, makeSession, getUserFromRequest, normalizePhone, validateRegister, randomToken } from '../../_lib.js'

export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}))
  const { name, age, gender, phone, password } = body

  const v = validateRegister({ name, age, gender, phone, password })
  if (v) return err(v)

  const normPhone = normalizePhone(phone)
  const exists = await env.DB.prepare('SELECT id FROM users WHERE phone = ?').bind(normPhone).first()
  if (exists) return err('Nomor HP sudah terdaftar')

  const hash = await hashPassword(password)
  try {
    const res = await env.DB.prepare(
      'INSERT INTO users (name, age, gender, phone, password_hash) VALUES (?,?,?,?,?)'
    ).bind(String(name).trim(), Number(age), gender, normPhone, hash).run()
    const user = await env.DB.prepare('SELECT id, name, age, gender, phone FROM users WHERE id = ?')
      .bind(res.meta.last_row_id).first()
    const token = makeSession(user.id)
    return json({ ok: true, token, user })
  } catch (e) {
    return err('Gagal mendaftar: ' + e.message, 500)
  }
}
