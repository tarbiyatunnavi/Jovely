import { json, err, getUserFromRequest } from '../../_lib.js'

// POST /api/progress/reset -> hapus semua progress user
export async function onRequestPost({ request, env }) {
  const user = await getUserFromRequest(request, env)
  if (!user) return err('Unauthorized', 401)

  await env.DB.prepare('DELETE FROM progress WHERE user_id = ?').bind(user.id).run()
  return json({ ok: true })
}
