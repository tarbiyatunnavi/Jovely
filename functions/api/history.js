import { json, err, getUserFromRequest } from '../_lib.js'

// GET /api/history -> semua riwayat hasil user
export async function onRequestGet({ request, env }) {
  const user = await getUserFromRequest(request, env)
  if (!user) return err('Unauthorized', 401)

  const rows = await env.DB.prepare(
    'SELECT id, total_percent, completed_at FROM results WHERE user_id = ? ORDER BY id DESC'
  ).bind(user.id).all()
  return json({ ok: true, history: rows.results || [] })
}
