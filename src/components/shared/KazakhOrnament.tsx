export function KazakhOrnamentThin({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 32" className="w-full h-8 text-[rgb(var(--accent))]"
           preserveAspectRatio="none" fill="none" stroke="currentColor">
        <defs>
          <pattern id="kz-thin" x="0" y="0" width="60" height="32" patternUnits="userSpaceOnUse">
            <line x1="0" y1="2" x2="60" y2="2" strokeWidth="1"/>
            <line x1="0" y1="30" x2="60" y2="30" strokeWidth="1"/>
            <path d="M0,16 C2,6 10,4 16,10 C22,16 18,24 10,20 C6,18 8,16 12,16 L60,16"
                  strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M0,16 C2,26 10,28 16,22 C22,16 18,8 10,12 C6,14 8,16 12,16 L60,16"
                  strokeWidth="1.4" strokeLinecap="round"/>
          </pattern>
        </defs>
        <rect width="1200" height="32" fill="url(#kz-thin)"/>
      </svg>
    </div>
  )
}

export function KazakhOrnament({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1200 64" className="w-full h-16 text-[rgb(var(--accent))]"
           preserveAspectRatio="none" fill="none" stroke="currentColor">
        <defs>
          <pattern id="kz-main" x="0" y="0" width="240" height="64" patternUnits="userSpaceOnUse">
            <line x1="0" y1="5" x2="240" y2="5" strokeWidth="1.5"/>
            <line x1="0" y1="59" x2="240" y2="59" strokeWidth="1.5"/>
            <path d="M0,32 C50,8 90,8 120,32 C150,56 190,56 240,32"
                  strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M0,32 C-5,14 10,4 22,14 C30,22 24,36 12,30 C6,26 6,32 0,32"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M120,32 C115,14 130,4 142,14 C150,22 144,36 132,30 C126,26 126,32 120,32"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M60,18 C55,8 68,2 76,10 C82,16 78,26 68,22 C62,20 62,18 60,18"
                  strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M180,46 C175,36 188,30 196,38 C202,44 198,54 188,50 C182,48 182,46 180,46"
                  strokeWidth="1.5" strokeLinecap="round"/>
          </pattern>
        </defs>
        <rect width="1200" height="64" fill="url(#kz-main)"/>
      </svg>
    </div>
  )
}

export function KazakhOrnamentFilmReel({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 960 88" className="w-full h-[88px] text-[rgb(var(--accent))]" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor">
        <defs>
          <pattern id="kazakh-filmreel" x="0" y="0" width="96" height="88" patternUnits="userSpaceOnUse">
            <animateTransform attributeName="patternTransform" type="translate" from="0,0" to="96,0" dur="6s" repeatCount="indefinite" />

            {/* Top strip background */}
            <rect x="0" y="0" width="96" height="18" fill="currentColor" fillOpacity="0.12" strokeWidth="0" />
            {/* Bottom strip background */}
            <rect x="0" y="70" width="96" height="18" fill="currentColor" fillOpacity="0.12" strokeWidth="0" />

            {/* Top strip border lines */}
            <line x1="0" y1="0" x2="96" y2="0" strokeWidth="1" />
            <line x1="0" y1="18" x2="96" y2="18" strokeWidth="1" />
            {/* Bottom strip border lines */}
            <line x1="0" y1="70" x2="96" y2="70" strokeWidth="1" />
            <line x1="0" y1="88" x2="96" y2="88" strokeWidth="1" />

            {/* Sprocket holes — top row */}
            <rect x="4"  y="3" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />
            <rect x="28" y="3" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />
            <rect x="52" y="3" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />
            <rect x="76" y="3" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />

            {/* Sprocket holes — bottom row */}
            <rect x="4"  y="73" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />
            <rect x="28" y="73" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />
            <rect x="52" y="73" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />
            <rect x="76" y="73" width="13" height="12" rx="2" fill="rgb(var(--background))" stroke="currentColor" strokeWidth="0.8" />

            {/* Central ornament — large diamond with 8-point star motif */}
            <polygon points="48,22 60,44 48,66 36,44" fill="currentColor" fillOpacity="0.15" strokeWidth="1.5" />
            <polygon points="48,28 58,44 48,60 38,44" strokeWidth="1" />
            {/* Inner rotated square */}
            <rect x="41" y="37" width="14" height="14" transform="rotate(45 48 44)" strokeWidth="0.8" />
            <circle cx="48" cy="44" r="3" fill="currentColor" strokeWidth="0" />

            {/* Star rays */}
            <line x1="48" y1="22" x2="48" y2="18" strokeWidth="1.2" />
            <line x1="48" y1="66" x2="48" y2="70" strokeWidth="1.2" />
            <line x1="60" y1="44" x2="68" y2="44" strokeWidth="1.2" />
            <line x1="36" y1="44" x2="28" y2="44" strokeWidth="1.2" />

            {/* Small accent diamonds on rays */}
            <polygon points="48,18 50,22 48,26 46,22" fill="currentColor" fillOpacity="0.6" strokeWidth="0" />
            <polygon points="48,62 50,66 48,70 46,66" fill="currentColor" fillOpacity="0.6" strokeWidth="0" />
            <polygon points="60,42 64,44 60,46 56,44" fill="currentColor" fillOpacity="0.6" strokeWidth="0" />
            <polygon points="36,42 40,44 36,46 32,44" fill="currentColor" fillOpacity="0.6" strokeWidth="0" />

            {/* Side mini-diamonds */}
            <polygon points="12,38 16,44 12,50 8,44"  strokeWidth="1" />
            <polygon points="84,38 88,44 84,50 80,44" strokeWidth="1" />
            <circle cx="12" cy="44" r="2" fill="currentColor" strokeWidth="0" />
            <circle cx="84" cy="44" r="2" fill="currentColor" strokeWidth="0" />
          </pattern>
        </defs>
        <rect width="960" height="88" fill="url(#kazakh-filmreel)" />
      </svg>
    </div>
  )
}

export function KazakhOrnamentBg({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 192 192" className="w-full h-full text-[rgb(var(--accent))] opacity-[0.04]" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="kazakh-bg" x="0" y="0" width="96" height="96" patternUnits="userSpaceOnUse">
            <polygon points="48,8 88,48 48,88 8,48" fill="none" stroke="currentColor" strokeWidth="2" />
            <polygon points="48,20 76,48 48,76 20,48" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="48" cy="48" r="5" fill="currentColor" />
            <line x1="48" y1="8" x2="48" y2="0" stroke="currentColor" strokeWidth="1.5" />
            <line x1="48" y1="88" x2="48" y2="96" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="48" x2="0" y2="48" stroke="currentColor" strokeWidth="1.5" />
            <line x1="88" y1="48" x2="96" y2="48" stroke="currentColor" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="192" height="192" fill="url(#kazakh-bg)" />
      </svg>
    </div>
  )
}
