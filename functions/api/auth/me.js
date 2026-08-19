import { json, getUserFromRequest } from '../../_lib.js'

export async function onRequestGet({ request, env }) {
  const user = await getUserFromRequest(request, env)
  if (!user) return json({ ok: false }, 401)
  return json({ ok: true, user })
}
