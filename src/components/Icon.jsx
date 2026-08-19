// Icon SVG sederhana untuk level & UI
export function LevelIcon({ name, size = 40 }) {
  const icons = {
    complete: 'M9 16.17 4 11l1.4-1.4L9 13.34 18.6 3.74 20 5.14z',
    attach: 'M12 5v14M5 12h14',
    sparkle: 'm12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2z',
    obsessed: 'M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 8c4-4 6-6.3 6-9a6 6 0 1 0-12 0c0 2.7 2 5 6 9z',
    spark: 'M13 3 4 14h7l-1 7 9-11h-7z',
    companion: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.7 0-8 1.3-8 4v2h8v-2c0-1 .4-1.9 1-2.6-.3-.2-.7-.4-1-.4zm8 0c-.3 0-.7.2-1 .4.6.7 1 1.6 1 2.6v2h8v-2c0-2.7-5.3-4-8-4z',
    magnet: 'M3 7v6a9 9 0 0 0 18 0V7h-5v6a4 4 0 0 1-8 0V7z',
    halo: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0-5a9 9 0 0 0-8 5h16a9 9 0 0 0-8-5zm0 18a9 9 0 0 0 8-5H4a9 9 0 0 0 8 5z',
    handshake: 'm11 5 2 2 3-3 4 4-3 3-2-2-5 5 2 2-1 1-3-3-3 3-1-1 2-2-5-5 3-3z',
    blindfold: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-4 8a4 4 0 0 1 8 0H8z',
    flag: 'M5 3v18M5 4h12l-2 4 2 4H5',
    fire: 'M12 2s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 1-3s-1 1-1 3a6 6 0 0 0 12 0c0-6-4-8-4-8z',
    emotion: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM8 11l1-1M16 11l-1-1M9 15a3 3 0 0 0 6 0',
    social: 'M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.7 0-8 1.3-8 4v2h8zm8 0c-.3 0-.7.2-1 .4.6.7 1 1.6 1 2.6v2h8v-2c0-2.7-5.3-4-8-4z',
    role: 'M12 2 2 7l10 5 10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
    finance: 'M12 1v22M6 7h9a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h9',
    religion: 'M12 2 2 12l10 10 10-10z',
    norms: 'M12 2 4 6v6c0 4 3 7 8 8 5-1 8-4 8-8V6z',
    mental: 'M12 2a10 10 0 0 0-7 17l-1 4 4-1a10 10 0 1 0 4-20zm0 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z',
    acceptance: 'M9 11V6a3 3 0 0 1 6 0v5m-9 0h12v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8z'
  }
  const d = icons[name] || icons.complete
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export function Icon({ name, size = 24 }) {
  const paths = {
    home: 'M3 12 12 3l9 9M5 10v10h14V10',
    map: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14',
    result: 'M4 19h16M7 16V9m5 7V5m5 11v-7',
    profile: 'M16 11a4 4 0 1 0-8 0 4 4 0 0 0 8 0zM4 20c0-3 3.5-5 8-5s8 2 8 5',
    back: 'M15 18l-6-6 6-6',
    check: 'M5 12l5 5L20 7',
    lock: 'M5 11h14v9H5zM8 11V7a4 4 0 0 1 8 0v4',
    star: 'm12 3 2.5 6.5L21 10l-5 4.5L17.5 21 12 17l-5.5 4L8 14.5 3 10l6.5-.5z',
    heart: 'M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9'
  }
  const d = paths[name] || paths.home
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}
