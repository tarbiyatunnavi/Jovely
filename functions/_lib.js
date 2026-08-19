// Helpers bersama untuk Cloudflare Pages Functions
// Hashing: PBKDF2 via Web Crypto (tanpa dependency eksternal)
// Token: random base64url via Web Crypto

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  })

export const err = (message, status = 400) => json({ ok: false, error: message }, status)

export async function hashPassword(password) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']
  )
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  )
  const combined = new Uint8Array(salt.length + bits.byteLength)
  combined.set(salt, 0)
  combined.set(new Uint8Array(bits), salt.length)
  return btoa(String.fromCharCode(...combined))
}

export async function verifyPassword(password, stored) {
  try {
    const combined = Uint8Array.from(atob(stored), c => c.charCodeAt(0))
    const salt = combined.slice(0, 16)
    const keyMaterial = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']
    )
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial, 256
    )
    const storedHash = combined.slice(16)
    const inputHash = new Uint8Array(bits)
    if (storedHash.length !== inputHash.length) return false
    let diff = 0
    for (let i = 0; i < storedHash.length; i++) diff |= storedHash[i] ^ inputHash[i]
    return diff === 0
  } catch {
    return false
  }
}

export function randomToken(bytes = 24) {
  const arr = crypto.getRandomValues(new Uint8Array(bytes))
  return btoa(String.fromCharCode(...arr)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Session token sederhana: base64url(JSON{uid, exp})
const SESSION_SECRET = 'jovely-session-secret-2026'

export function makeSession(userId) {
  const payload = { uid: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 } // 30 hari
  const body = btoa(JSON.stringify(payload))
  const sig = btoa(String.fromCharCode(...new Uint8Array(
    Array.from(new TextEncoder().encode(body + SESSION_SECRET)).slice(0, 24)
  ))).replace(/=/g, '')
  return `${body}.${sig}`
}

export function parseSession(token) {
  if (!token) return null
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  try {
    const payload = JSON.parse(atob(body))
    if (!payload.exp || payload.exp < Date.now()) return null
    const expected = btoa(String.fromCharCode(...new Uint8Array(
      Array.from(new TextEncoder().encode(body + SESSION_SECRET)).slice(0, 24)
    ))).replace(/=/g, '')
    if (sig !== expected) return null
    return payload
  } catch {
    return null
  }
}

export async function getUserFromRequest(request, env) {
  const auth = request.headers.get('Authorization') || ''
  const m = auth.match(/^Bearer (.+)$/)
  if (!m) return null
  const session = parseSession(m[1])
  if (!session) return null
  const user = await env.DB.prepare('SELECT id, name, age, gender, phone FROM users WHERE id = ?')
    .bind(session.uid).first()
  return user
}

export function normalizePhone(phone) {
  // ke format 62xxx (tanpa + atau 0 di depan)
  let p = (phone || '').replace(/[^0-9]/g, '')
  if (p.startsWith('0')) p = '62' + p.slice(1)
  else if (p.startsWith('62')) p = p
  else if (p.startsWith('8')) p = '62' + p
  return p
}

export function validateRegister({ name, age, gender, phone, password }) {
  if (!name || String(name).trim().length < 2) return 'Nama minimal 2 karakter'
  const a = Number(age)
  if (!a || a < 18 || a > 120) return 'Usia harus 18-120'
  if (!['L', 'P'].includes(gender)) return 'Jenis kelamin tidak valid'
  const p = normalizePhone(phone)
  if (!/^62[0-9]{8,13}$/.test(p)) return 'Nomor HP tidak valid'
  if (!password || password.length < 6) return 'Password minimal 6 karakter'
  return null
}
