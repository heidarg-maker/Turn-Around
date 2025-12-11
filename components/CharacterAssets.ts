
export const CHARACTER_SVGS: Record<string, string> = {
  char_1: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="copBlue_c1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1e3a8a" />
                <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
            <linearGradient id="skin_c1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#fca5a5" />
                <stop offset="100%" stop-color="#f87171" />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="#e0f2fe" opacity="0.2" />
        <path d="M 20 100 L 20 70 Q 50 60 80 70 L 80 100" fill="url(#copBlue_c1)" />
        <path d="M 40 70 L 50 100 L 60 70" fill="#cbd5e1" opacity="0.3" />
        <path d="M 25 75 L 35 75 L 30 85 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1" />
        <rect x="35" y="40" width="30" height="35" rx="10" fill="url(#skin_c1)" />
        <circle cx="35" cy="45" r="5" fill="#3f2c22" />
        <circle cx="65" cy="45" r="5" fill="#3f2c22" />
        <circle cx="33" cy="52" r="4" fill="#3f2c22" />
        <circle cx="67" cy="52" r="4" fill="#3f2c22" />
        <path d="M 25 35 Q 50 20 75 35 L 75 45 Q 50 35 25 45 Z" fill="#172554" />
        <path d="M 25 45 Q 50 55 75 45" fill="#000" opacity="0.4" />
        <rect x="46" y="28" width="8" height="8" fill="#fbbf24" rx="2" />
        <path d="M 38 52 Q 45 52 52 52 L 52 58 Q 45 62 38 58 Z" fill="#111" />
        <path d="M 62 52 Q 55 52 48 52 L 48 58 Q 55 62 62 58 Z" fill="#111" />
        <line x1="48" y1="54" x2="52" y2="54" stroke="#111" stroke-width="2" />
        <path d="M 45 68 Q 50 72 55 68" stroke="#7f1d1d" stroke-width="2" fill="none" />
    </svg>`,
  char_2: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="wood_c2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#a16207" />
                <stop offset="100%" stop-color="#713f12" />
            </linearGradient>
            <linearGradient id="metal_c2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e5e7eb" />
                <stop offset="50%" stop-color="#9ca3af" />
                <stop offset="100%" stop-color="#4b5563" />
            </linearGradient>
        </defs>
        <rect x="42" y="40" width="16" height="60" rx="4" fill="url(#wood_c2)" stroke="#451a03" stroke-width="1" />
        <path d="M 46 50 L 46 80" stroke="#78350f" stroke-width="1" opacity="0.5" />
        <path d="M 54 60 L 54 90" stroke="#78350f" stroke-width="1" opacity="0.5" />
        <path d="M 42 15 L 42 45 L 85 45 Q 95 30 85 15 Z" fill="url(#metal_c2)" stroke="#374151" stroke-width="2" />
        <path d="M 42 15 L 42 45 L 15 45 Q 5 30 15 15 Z" fill="url(#metal_c2)" stroke="#374151" stroke-width="2" />
        <path d="M 42 15 L 50 5 L 58 15 Z" fill="#6b7280" />
        <circle cx="30" cy="30" r="5" fill="#fff" stroke="#000" stroke-width="1" />
        <circle cx="30" cy="30" r="2" fill="#000" />
        <circle cx="70" cy="30" r="5" fill="#fff" stroke="#000" stroke-width="1" />
        <circle cx="70" cy="30" r="2" fill="#000" />
        <line x1="22" y1="24" x2="38" y2="28" stroke="#000" stroke-width="2" />
        <line x1="78" y1="24" x2="62" y2="28" stroke="#000" stroke-width="2" />
        <rect x="45" y="35" width="10" height="4" rx="2" fill="#000" />
    </svg>`,
  char_3: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
         <defs>
            <radialGradient id="elSkin_c3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fecaca" />
                <stop offset="100%" stop-color="#f87171" />
            </radialGradient>
        </defs>
        <path d="M 15 100 L 15 75 Q 50 85 85 75 L 85 100" fill="#dc2626" />
        <path d="M 35 78 Q 50 90 65 78" stroke="#b91c1c" stroke-width="2" fill="none" />
        <ellipse cx="50" cy="50" rx="28" ry="32" fill="url(#elSkin_c3)" />
        <path d="M 22 40 Q 50 10 78 40" fill="#573a2e" opacity="0.8" />
        <path d="M 22 40 Q 50 10 78 40" fill="none" stroke="#3e2418" stroke-width="2" stroke-dasharray="3 3" />
        <path d="M 35 48 Q 40 45 45 48" stroke="#374151" stroke-width="1" fill="none" />
        <circle cx="40" cy="52" r="3" fill="#1f2937" />
        <path d="M 55 48 Q 60 45 65 48" stroke="#374151" stroke-width="1" fill="none" />
        <circle cx="60" cy="52" r="3" fill="#1f2937" />
        <path d="M 52 58 L 54 58 L 53 60 Z" fill="#ef4444" />
        <path d="M 53 60 Q 54 65 52 70" stroke="#b91c1c" stroke-width="2" fill="none" />
        <circle cx="52" cy="72" r="1.5" fill="#b91c1c" />
        <path d="M 45 70 Q 50 72 55 70" stroke="#7f1d1d" stroke-width="1" fill="none" />
    </svg>`,
  char_4: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
         <defs>
            <linearGradient id="goldHelm_c4" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fcd34d" />
                <stop offset="50%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
        </defs>
        <path d="M 20 45 Q 50 -10 80 45" fill="url(#goldHelm_c4)" stroke="#78350f" stroke-width="1" />
        <path d="M 15 45 L 85 45 L 90 70 L 10 70 Z" fill="url(#goldHelm_c4)" stroke="#78350f" stroke-width="1" />
        <path d="M 25 45 L 75 45 L 70 90 L 30 90 Z" fill="#171717" />
        <path d="M 30 55 L 45 60 L 35 65 Z" fill="#404040" />
        <path d="M 70 55 L 55 60 L 65 65 Z" fill="#404040" />
        <path d="M 40 75 L 60 75 L 58 90 L 42 90 Z" fill="#262626" stroke="#525252" stroke-width="1" />
        <line x1="45" y1="75" x2="45" y2="90" stroke="#525252" stroke-width="1" />
        <line x1="50" y1="75" x2="50" y2="90" stroke="#525252" stroke-width="1" />
        <line x1="55" y1="75" x2="55" y2="90" stroke="#525252" stroke-width="1" />
        <ellipse cx="35" cy="25" rx="5" ry="10" fill="#fff" opacity="0.3" transform="rotate(-30 35 25)" />
    </svg>`,
  char_5: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
         <defs>
            <linearGradient id="hat_c5" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#a16207" />
                <stop offset="100%" stop-color="#713f12" />
            </linearGradient>
        </defs>
        <ellipse cx="50" cy="35" rx="42" ry="10" fill="#78350f" />
        <path d="M 28 35 L 32 15 Q 50 5 68 15 L 72 35 Z" fill="url(#hat_c5)" />
        <path d="M 30 30 Q 50 25 70 30" stroke="#451a03" stroke-width="2" fill="none" opacity="0.5" />
        <rect x="30" y="35" width="40" height="40" rx="15" fill="#fecaca" />
        <path d="M 30 60 Q 30 85 50 85 Q 70 85 70 60 L 70 55 L 30 55 Z" fill="#78350f" />
        <path d="M 35 60 Q 50 50 65 60" fill="none" stroke="#451a03" stroke-width="5" stroke-linecap="round" />
        <circle cx="40" cy="50" r="3" fill="#000" />
        <circle cx="60" cy="50" r="3" fill="#000" />
        <line x1="55" y1="65" x2="65" y2="68" stroke="#fff" stroke-width="2" />
    </svg>`,
  char_6: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
         <rect width="100" height="100" fill="#0f172a" />
         <path d="M 0 50 L 100 50 M 50 0 L 50 100" stroke="#10b981" stroke-width="0.5" opacity="0.2" />
         <text x="25" y="70" font-size="60" font-weight="900" fill="#34d399" font-family="monospace" stroke="#064e3b" stroke-width="2">6</text>
         <text x="55" y="70" font-size="60" font-weight="900" fill="#10b981" font-family="monospace" stroke="#064e3b" stroke-width="2">7</text>
         <path d="M 40 40 L 60 40" stroke="#ecfdf5" stroke-width="2" stroke-dasharray="4 2" />
         <circle cx="40" cy="40" r="3" fill="#fff" />
         <circle cx="60" cy="40" r="3" fill="#fff" />
    </svg>`,
  char_7: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
         <defs>
             <radialGradient id="ghostGlow_c7" cx="50%" cy="50%" r="50%">
                 <stop offset="0%" stop-color="#e2e8f0" stop-opacity="1" />
                 <stop offset="80%" stop-color="#94a3b8" stop-opacity="0.8" />
                 <stop offset="100%" stop-color="#64748b" stop-opacity="0" />
             </radialGradient>
         </defs>
        <path d="M 20 90 L 20 50 Q 50 0 80 50 L 80 90 Q 70 80 60 90 Q 50 80 40 90 Q 30 80 20 90" fill="url(#ghostGlow_c7)" />
        <ellipse cx="35" cy="45" rx="6" ry="8" fill="#0f172a" />
        <ellipse cx="65" cy="45" rx="6" ry="8" fill="#0f172a" />
        <circle cx="35" cy="45" r="2" fill="#38bdf8" opacity="0.8" />
        <circle cx="65" cy="45" r="2" fill="#38bdf8" opacity="0.8" />
        <ellipse cx="50" cy="65" rx="8" ry="12" fill="#0f172a" />
        <circle cx="30" cy="80" r="3" fill="#e2e8f0" opacity="0.6" />
        <circle cx="70" cy="75" r="2" fill="#e2e8f0" opacity="0.6" />
    </svg>`,
  char_8: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
            <linearGradient id="pigSkin_c8" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#fbcfe8" />
                <stop offset="100%" stop-color="#f472b6" />
            </linearGradient>
        </defs>
        <circle cx="50" cy="55" r="30" fill="url(#pigSkin_c8)" />
        <path d="M 25 30 L 35 45 L 20 50 Z" fill="#f472b6" />
        <path d="M 75 30 L 65 45 L 80 50 Z" fill="#f472b6" />
        <path d="M 20 35 Q 50 25 80 35 L 80 45 Q 50 35 20 45 Z" fill="#14532d" />
        <circle cx="50" cy="38" r="4" fill="#ef4444" />
        <ellipse cx="50" cy="65" rx="12" ry="9" fill="#f9a8d4" stroke="#db2777" stroke-width="1" />
        <circle cx="46" cy="65" r="3" fill="#831843" />
        <circle cx="54" cy="65" r="3" fill="#831843" />
        <circle cx="40" cy="50" r="4" fill="#000" />
        <circle cx="60" cy="50" r="4" fill="#000" />
        <path d="M 35 45 L 45 48" stroke="#000" stroke-width="2" />
        <path d="M 65 45 L 55 48" stroke="#000" stroke-width="2" />
        <rect x="70" y="55" width="30" height="15" fill="#374151" transform="rotate(-15 70 55)" />
        <rect x="90" y="50" width="5" height="25" fill="#1f2937" transform="rotate(-15 90 50)" />
    </svg>`,
  char_9: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M 15 100 L 15 70 Q 50 60 85 70 L 85 100" fill="#15803d" />
        <rect x="45" y="70" width="10" height="30" fill="#b91c1c" />
        <path d="M 40 70 L 60 70" stroke="#fff" stroke-width="1" />
        <rect x="40" y="55" width="20" height="15" fill="#fca5a5" />
        <ellipse cx="50" cy="45" rx="25" ry="30" fill="#fca5a5" />
        <circle cx="50" cy="15" r="10" fill="#fcd34d" />
        <circle cx="35" cy="20" r="10" fill="#fcd34d" />
        <circle cx="65" cy="20" r="10" fill="#fcd34d" />
        <circle cx="25" cy="35" r="8" fill="#fcd34d" />
        <circle cx="75" cy="35" r="8" fill="#fcd34d" />
        <circle cx="25" cy="50" r="6" fill="#fcd34d" />
        <circle cx="75" cy="50" r="6" fill="#fcd34d" />
        <circle cx="40" cy="45" r="3" fill="#1f2937" />
        <circle cx="60" cy="45" r="3" fill="#1f2937" />
        <path d="M 40 60 Q 50 65 60 60" stroke="#be123c" stroke-width="2" fill="none" />
        <circle cx="80" cy="80" r="12" fill="#fff" stroke="#000" stroke-width="1" />
        <path d="M 80 80 L 80 72 M 80 80 L 87 84 M 80 80 L 73 84" stroke="#000" stroke-width="1" />
        <path d="M 73 84 L 75 90 L 85 90 L 87 84" fill="none" stroke="#000" stroke-width="1" />
    </svg>`,
  char_10: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
         <defs>
             <linearGradient id="chrome_c10" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stop-color="#e2e8f0" />
                 <stop offset="50%" stop-color="#94a3b8" />
                 <stop offset="100%" stop-color="#475569" />
             </linearGradient>
         </defs>
         <path d="M 20 60 L 80 60 L 90 80 L 10 80 Z" fill="#334155" />
         <rect x="30" y="60" width="40" height="20" fill="#1e293b" />
         <circle cx="20" cy="80" r="12" fill="#0f172a" stroke="url(#chrome_c10)" stroke-width="4" />
         <circle cx="80" cy="80" r="12" fill="#0f172a" stroke="url(#chrome_c10)" stroke-width="4" />
         <circle cx="20" cy="80" r="4" fill="#94a3b8" />
         <circle cx="80" cy="80" r="4" fill="#94a3b8" />
         <path d="M 35 60 L 65 60 L 60 30 L 40 30 Z" fill="#475569" />
         <rect x="40" y="35" width="20" height="25" fill="#0f172a" rx="5" />
         <circle cx="50" cy="25" r="14" fill="#fca5a5" />
         <path d="M 35 15 Q 50 5 65 15 L 65 30 Q 50 35 35 30 Z" fill="#0284c7" />
         <path d="M 38 18 L 62 18 L 60 26 L 40 26 Z" fill="#38bdf8" />
         <path d="M 25 45 L 40 40" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
         <path d="M 75 45 L 60 40" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
    </svg>`,
  generic: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="30" r="20" fill="#cbd5e1" />
        <path d="M 20 100 L 20 60 Q 50 40 80 60 L 80 100" fill="#64748b" />
        <circle cx="50" cy="30" r="15" fill="#fff" opacity="0.1" />
    </svg>`
};
