import { json, err, hashPassword } from '../../_lib.js'

// Reset password: POST { token, newPassword }
export async function onRequestPost({ request, env }) {
  const body = await request.json().catch(() => ({}))
  const { token, newPassword } = body
  if (!token || !newPassword) return err('Token & password baru wajib diisi')
  if (newPassword.length < 6) return err('Password baru minimal 6 karakter')

  const row = await env.DB.prepare(
    "SELECT user_id, expires_at, used FROM reset_tokens WHERE token = ?"
  ).bind(String(token).toUpperCase()).first()
  if (!row) return err('Token tidak valid')
  if (row.used) return err('Token sudah dipakai')
  if (new Date(row.expires_at).getTime() < Date.now()) return err('Token sudah kedaluwarsa')

  const hash = await hashPassword(newPassword)
  await env.DB.batch([
    env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(hash, row.user_id),
    env.DB.prepare('UPDATE reset_tokens SET used = 1 WHERE token = ?').bind(String(token).toUpperCase())
  ])
  return json({ ok: true, message: 'Password berhasil direset' })
}
