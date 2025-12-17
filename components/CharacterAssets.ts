
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
        
        <!-- Curly Hair Addition -->
        <g fill="none" stroke="#271c19" stroke-width="3" stroke-linecap="round">
            <path d="M 40 15 Q 35 5 45 8" /> 
            <path d="M 45 8 Q 50 0 55 8" />
            <path d="M 55 8 Q 65 5 60 15" />
            <path d="M 42 12 Q 40 5 48 2" />
            <path d="M 52 2 Q 60 5 58 12" />
            <path d="M 30 18 Q 25 10 35 12" stroke-width="2" />
            <path d="M 70 18 Q 75 10 65 12" stroke-width="2" />
        </g>

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
        <path d="M 35 48 Q 40 45 45 48" stroke="#7f1d1d" stroke-width="2" fill="none" />
        <path d="M 55 48 Q 60 45 65 48" stroke="#7f1d1d" stroke-width="2" fill="none" />
        <circle cx="40" cy="55" r="3" fill="#000" />
        <circle cx="60" cy="55" r="3" fill="#000" />
        <path d="M 45 65 Q 50 70 55 65" stroke="#000" stroke-width="1.5" fill="none" />
        <!-- Floating Objects -->
        <circle cx="20" cy="30" r="5" fill="#ef4444" opacity="0.6">
            <animate attributeName="cy" values="30;25;30" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x="75" y="25" width="8" height="8" fill="#ef4444" opacity="0.6" transform="rotate(15)">
             <animate attributeName="y" values="25;20;25" dur="2.5s" repeatCount="indefinite" />
        </rect>
    </svg>`,
  char_4: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M 20 100 L 25 30 Q 50 10 75 30 L 80 100" fill="#000" />
        <path d="M 25 30 Q 50 10 75 30" fill="none" stroke="#f59e0b" stroke-width="2" />
        <!-- Hood Shadow -->
        <path d="M 30 35 Q 50 25 70 35 L 70 60 Q 50 50 30 60 Z" fill="#111" />
        <!-- Eyes -->
        <circle cx="40" cy="45" r="3" fill="#fbbf24" />
        <circle cx="60" cy="45" r="3" fill="#fbbf24" />
        <!-- Lightsaber/Staff -->
        <line x1="80" y1="40" x2="95" y2="90" stroke="#78350f" stroke-width="3" />
        <line x1="80" y1="40" x2="70" y2="10" stroke="#f59e0b" stroke-width="4" stroke-linecap="round" filter="drop-shadow(0 0 5px #f59e0b)" />
    </svg>`,
  char_5: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect x="30" y="50" width="40" height="50" fill="#78350f" />
        <!-- Hat -->
        <path d="M 20 40 L 80 40 L 70 20 L 30 20 Z" fill="#5c2b0b" />
        <rect x="20" y="38" width="60" height="4" fill="#3f1d0b" />
        <!-- Badge -->
        <path d="M 50 55 L 55 60 L 50 65 L 45 60 Z" fill="#fbbf24" />
        <!-- Face -->
        <rect x="35" y="40" width="30" height="20" fill="#d6bcfa" />
        <circle cx="42" cy="48" r="2" fill="#000" />
        <circle cx="58" cy="48" r="2" fill="#000" />
        <path d="M 45 55 Q 50 58 55 55" stroke="#000" fill="none" />
    </svg>`,
  char_6: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <text x="50" y="80" font-family="monospace" font-weight="bold" font-size="60" text-anchor="middle" fill="#10b981">6</text>
        <text x="65" y="60" font-family="monospace" font-weight="bold" font-size="40" text-anchor="middle" fill="#34d399" opacity="0.8">7</text>
        <circle cx="50" cy="50" r="40" stroke="#059669" stroke-width="2" fill="none" stroke-dasharray="5 5">
            <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="10s" repeatCount="indefinite" />
        </circle>
    </svg>`,
  char_7: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M 20 100 L 20 50 Q 50 10 80 50 L 80 100 L 70 90 L 60 100 L 50 90 L 40 100 L 30 90 Z" fill="#64748b" opacity="0.8" />
        <circle cx="35" cy="45" r="5" fill="#fff" />
        <circle cx="65" cy="45" r="5" fill="#fff" />
        <path d="M 45 60 Q 50 50 55 60" stroke="#000" fill="none" />
        <circle cx="50" cy="50" r="45" fill="url(#ghostGrad)" opacity="0.3" />
        <defs>
            <radialGradient id="ghostGrad">
                <stop offset="0%" stop-color="#fff" />
                <stop offset="100%" stop-color="transparent" />
            </radialGradient>
        </defs>
    </svg>`,
  char_8: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <!-- Body -->
        <ellipse cx="50" cy="60" rx="35" ry="30" fill="#fbcfe8" />
        <!-- Snout -->
        <ellipse cx="50" cy="60" rx="10" ry="8" fill="#f472b6" />
        <circle cx="47" cy="60" r="2" fill="#be185d" />
        <circle cx="53" cy="60" r="2" fill="#be185d" />
        <!-- Eyes -->
        <circle cx="35" cy="50" r="3" fill="#000" />
        <circle cx="65" cy="50" r="3" fill="#000" />
        <!-- Ears -->
        <path d="M 25 45 L 15 25 L 35 35 Z" fill="#fbcfe8" />
        <path d="M 75 45 L 85 25 L 65 35 Z" fill="#fbcfe8" />
        <!-- Bazooka -->
        <rect x="55" y="65" width="40" height="15" fill="#374151" transform="rotate(-15 55 65)" />
        <rect x="50" y="60" width="10" height="20" fill="#1f2937" transform="rotate(-15 55 65)" />
    </svg>`,
  char_9: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <!-- Jersey -->
        <path d="M 20 100 L 25 40 L 75 40 L 80 100" fill="#166534" />
        <path d="M 45 40 L 45 100" stroke="#fff" stroke-width="2" />
        <path d="M 55 40 L 55 100" stroke="#fff" stroke-width="2" />
        <!-- Head -->
        <circle cx="50" cy="30" r="15" fill="#f5d0b0" />
        <!-- Hair -->
        <path d="M 35 25 Q 50 10 65 25" fill="#000" />
        <!-- Ball -->
        <circle cx="70" cy="85" r="12" fill="#fff" stroke="#000" stroke-width="1" />
        <path d="M 70 85 L 75 80" stroke="#000" />
        <path d="M 70 85 L 65 90" stroke="#000" />
    </svg>`,
  char_10: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <!-- Wheel -->
        <circle cx="50" cy="75" r="20" fill="none" stroke="#334155" stroke-width="5" />
        <line x1="50" y1="75" x2="50" y2="55" stroke="#94a3b8" stroke-width="2" />
        <line x1="50" y1="75" x2="67" y2="85" stroke="#94a3b8" stroke-width="2" />
        <line x1="50" y1="75" x2="33" y2="85" stroke="#94a3b8" stroke-width="2" />
        <!-- Body -->
        <rect x="35" y="20" width="30" height="40" fill="#475569" rx="5" />
        <circle cx="50" cy="20" r="12" fill="#cbd5e1" />
        <!-- Visor -->
        <rect x="42" y="15" width="16" height="6" fill="#38bdf8" />
    </svg>`,
  char_16: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <!-- Coat -->
        <path d="M 20 100 L 25 40 L 75 40 L 80 100" fill="#0ea5e9" />
        <line x1="50" y1="40" x2="50" y2="100" stroke="#0369a1" stroke-width="1" />
        <!-- Head -->
        <rect x="38" y="25" width="24" height="20" fill="#fde68a" rx="5" />
        <!-- Fedora -->
        <rect x="30" y="22" width="40" height="5" fill="#334155" />
        <rect x="35" y="10" width="30" height="15" fill="#334155" />
        <rect x="35" y="20" width="30" height="2" fill="#000" />
        <!-- Mustache -->
        <path d="M 42 38 Q 50 35 58 38 Q 62 42 58 40 Q 50 38 42 40 Q 38 42 42 38" fill="#3f2c22" />
        <!-- Glasses -->
        <circle cx="44" cy="32" r="4" fill="#000" opacity="0.8" />
        <circle cx="56" cy="32" r="4" fill="#000" opacity="0.8" />
        <line x1="48" y1="32" x2="52" y2="32" stroke="#000" stroke-width="1" />
    </svg>`,
  generic: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <circle cx="50" cy="30" r="15" fill="#fff" opacity="0.9" />
        <path d="M 25 100 L 30 50 L 70 50 L 75 100" fill="#fff" opacity="0.7" />
        <rect x="20" y="50" width="10" height="30" fill="#fff" opacity="0.5" />
        <rect x="70" y="50" width="10" height="30" fill="#fff" opacity="0.5" />
    </svg>
  `
};
