import { json, err, getUserFromRequest } from '../../_lib.js'

// GET /api/result -> hasil terakhir user
export async function onRequestGet({ request, env }) {
  const user = await getUserFromRequest(request, env)
  if (!user) return err('Unauthorized', 401)

  const row = await env.DB.prepare(
    'SELECT love_styles_json, readiness_json, total_percent, completed_at FROM results WHERE user_id = ? ORDER BY id DESC LIMIT 1'
  ).bind(user.id).first()
  if (!row) return json({ ok: true, result: null })
  return json({
    ok: true,
    result: {
      loveStyles: JSON.parse(row.love_styles_json || '{}'),
      readiness: JSON.parse(row.readiness_json || '{}'),
      totalPercent: row.total_percent,
      completedAt: row.completed_at
    }
  })
}

// POST /api/result -> simpan hasil akhir (hanya jika seluruh level selesai)
// body: { loveStyles, readiness, totalPercent }
export async function onRequestPost({ request, env }) {
  const user = await getUserFromRequest(request, env)
  if (!user) return err('Unauthorized', 401)

  const body = await request.json().catch(() => ({}))
  const { loveStyles, readiness, totalPercent } = body
  if (!loveStyles || !readiness) return err('Data hasil tidak lengkap')

  await env.DB.prepare(
    'INSERT INTO results (user_id, love_styles_json, readiness_json, total_percent) VALUES (?,?,?,?)'
  ).bind(
    user.id,
    JSON.stringify(loveStyles),
    JSON.stringify(readiness),
    Number(totalPercent) || 0
  ).run()

  return json({ ok: true })
}
