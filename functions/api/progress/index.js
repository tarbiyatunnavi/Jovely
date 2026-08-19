import { json, err, getUserFromRequest } from '../../_lib.js'

// GET /api/progress -> semua progress user
export async function onRequestGet({ request, env }) {
  const user = await getUserFromRequest(request, env)
  if (!user) return err('Unauthorized', 401)

  const rows = await env.DB.prepare(
    'SELECT level_id, status, answers_json, xp FROM progress WHERE user_id = ?'
  ).bind(user.id).all()
  const progress = {}
  for (const r of (rows.results || [])) {
    progress[r.level_id] = {
      status: r.status,
      answers: JSON.parse(r.answers_json || '{}'),
      xp: r.xp
    }
  }
  return json({ ok: true, progress })
}

// POST /api/progress -> upsert progress satu level
// body: { levelId, status, answers, xp }
export async function onRequestPost({ request, env }) {
  const user = await getUserFromRequest(request, env)
  if (!user) return err('Unauthorized', 401)

  const body = await request.json().catch(() => ({}))
  const { levelId, status, answers, xp } = body
  if (!levelId) return err('levelId wajib diisi')
  if (!['in_progress', 'completed'].includes(status)) return err('status tidak valid')

  const answersJson = JSON.stringify(answers || {})
  await env.DB.prepare(
    `INSERT INTO progress (user_id, level_id, status, answers_json, xp, updated_at)
     VALUES (?,?,?,?,?,datetime('now'))
     ON CONFLICT(user_id, level_id) DO UPDATE SET
       status=excluded.status, answers_json=excluded.answers_json,
       xp=excluded.xp, updated_at=datetime('now')`
  ).bind(user.id, levelId, status, answersJson, Number(xp) || 0).run()

  return json({ ok: true })
}
