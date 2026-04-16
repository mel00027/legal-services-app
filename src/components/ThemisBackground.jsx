import React from 'react';
import { m } from 'framer-motion';

const MATERIALS = {
  marble: {
    light: '#E8EAF0',
    mid: '#9BA3B5',
    dark: '#4A5568',
    accent: '#F5F7FA',
    metal: '#BFA374',
    metalDark: '#7A6240',
    metalLight: '#E8D4A6',
    blade: '#CDD5DE',
    bladeDark: '#6F7A88',
  },
  bronze: {
    light: '#D4A574',
    mid: '#8B6F47',
    dark: '#3A2A1A',
    accent: '#E8C896',
    metal: '#B8925A',
    metalDark: '#5C4426',
    metalLight: '#EAD0A0',
    blade: '#BFA374',
    bladeDark: '#6B5030',
  },
};

const ThemisBackgroundImpl = ({
  opacity = 0.35,
  side = 'left',
  material = 'marble',
  swaySpeed = 14,
  offsetX = -60,
  width = 440,
  className = '',
}) => {
  const c = MATERIALS[material] || MATERIALS.marble;
  const uid = material;

  const positionStyle =
    side === 'right'
      ? { right: `${offsetX}px` }
      : { left: `${offsetX}px` };

  return (
    <div
      aria-hidden="true"
      className={`absolute top-0 bottom-0 pointer-events-none overflow-hidden select-none hidden md:block ${className}`}
      style={{
        ...positionStyle,
        width: `${width}px`,
        opacity,
        zIndex: 1,
      }}
    >
      <svg
        viewBox="0 0 300 760"
        className="h-full w-auto"
        preserveAspectRatio="xMidYMax meet"
        style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.55))' }}
      >
        <defs>
          <linearGradient id={`stone-${uid}`} x1="25%" y1="0%" x2="75%" y2="100%">
            <stop offset="0%" stopColor={c.accent} />
            <stop offset="30%" stopColor={c.light} />
            <stop offset="70%" stopColor={c.mid} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>
          <linearGradient id={`stone-v-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={c.light} />
            <stop offset="55%" stopColor={c.mid} />
            <stop offset="100%" stopColor={c.dark} />
          </linearGradient>
          <linearGradient id={`stone-h-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={c.light} />
            <stop offset="50%" stopColor={c.accent} />
            <stop offset="100%" stopColor={c.mid} />
          </linearGradient>
          <linearGradient id={`metal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.metalLight} />
            <stop offset="50%" stopColor={c.metal} />
            <stop offset="100%" stopColor={c.metalDark} />
          </linearGradient>
          <linearGradient id={`blade-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c.bladeDark} />
            <stop offset="50%" stopColor={c.blade} />
            <stop offset="100%" stopColor={c.bladeDark} />
          </linearGradient>
          <radialGradient id={`halo-${uid}`} cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor={c.accent} stopOpacity="0.18" />
            <stop offset="60%" stopColor={c.accent} stopOpacity="0.05" />
            <stop offset="100%" stopColor={c.dark} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`vignette-${uid}`} cx="50%" cy="45%" r="70%">
            <stop offset="65%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* Soft halo behind figure */}
        <ellipse cx="150" cy="260" rx="140" ry="280" fill={`url(#halo-${uid})`} />

        {/* ========== PEDESTAL ========== */}
        <g>
          <rect x="52" y="688" width="196" height="60" fill={`url(#stone-v-${uid})`} />
          <rect x="45" y="676" width="210" height="14" fill={`url(#stone-h-${uid})`} />
          <rect x="72" y="652" width="156" height="24" fill={`url(#stone-v-${uid})`} />
          <rect x="68" y="644" width="164" height="10" fill={`url(#stone-h-${uid})`} />
          <rect x="52" y="748" width="196" height="4" fill={c.dark} opacity="0.4" />
        </g>

        {/* ========== LOWER ROBES (long flowing column) ========== */}
        <path
          d="M 108 358
             Q 96 405 90 490
             Q 84 580 78 648
             L 222 648
             Q 216 580 210 490
             Q 204 405 192 358
             Q 182 347 150 347
             Q 118 347 108 358 Z"
          fill={`url(#stone-v-${uid})`}
        />
        {/* Drapery folds */}
        <g stroke={c.dark} strokeWidth="0.9" fill="none" opacity="0.38" strokeLinecap="round">
          <path d="M 112 380 Q 104 495 92 645" />
          <path d="M 128 378 Q 123 495 115 645" />
          <path d="M 142 375 Q 141 495 138 645" />
          <path d="M 158 375 Q 159 495 162 645" />
          <path d="M 172 378 Q 177 495 185 645" />
          <path d="M 188 380 Q 196 495 208 645" />
        </g>
        {/* Highlights on folds */}
        <g stroke={c.light} strokeWidth="0.5" fill="none" opacity="0.35" strokeLinecap="round">
          <path d="M 120 390 Q 115 500 105 640" />
          <path d="M 150 388 Q 150 500 150 640" />
          <path d="M 180 390 Q 185 500 195 640" />
        </g>
        {/* Hem */}
        <rect x="80" y="640" width="140" height="5" fill={c.dark} opacity="0.35" />
        <rect x="80" y="640" width="140" height="1.5" fill={c.accent} opacity="0.5" />

        {/* ========== TORSO ========== */}
        <path
          d="M 112 186
             Q 101 215 111 260
             L 121 348
             L 179 348
             L 189 260
             Q 199 215 188 186
             Q 170 173 150 173
             Q 130 173 112 186 Z"
          fill={`url(#stone-${uid})`}
        />
        {/* Chest fold */}
        <path
          d="M 128 200 Q 150 215 172 200 L 170 225 Q 150 235 130 225 Z"
          fill={c.dark}
          opacity="0.18"
        />
        {/* Belt / sash */}
        <rect x="118" y="282" width="64" height="7" fill={c.dark} opacity="0.45" />
        <rect x="118" y="282" width="64" height="1.5" fill={c.metalLight} opacity="0.7" />
        <rect x="118" y="287" width="64" height="1" fill={c.dark} opacity="0.4" />

        {/* ========== RIGHT ARM (sword arm, hangs down) ========== */}
        <path
          d="M 186 188
             Q 200 208 204 282
             Q 208 362 210 430
             Q 204 438 196 432
             Q 192 364 188 284
             Q 182 212 180 194 Z"
          fill={`url(#stone-v-${uid})`}
        />
        {/* Hand on hilt */}
        <ellipse cx="202" cy="437" rx="7" ry="5" fill={`url(#stone-${uid})`} />

        {/* ========== SWORD (slight imperceptible breathing) ========== */}
        <m.g
          animate={{ y: [0, -0.6, 0.4, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '202px 437px' }}
        >
          {/* Pommel */}
          <circle cx="202" cy="429" r="4" fill={`url(#metal-${uid})`} stroke={c.metalDark} strokeWidth="0.4" />
          {/* Grip */}
          <rect x="199" y="432" width="6" height="12" fill={c.metalDark} rx="1" />
          <line x1="199.5" y1="433" x2="199.5" y2="443" stroke={c.metalLight} strokeWidth="0.3" opacity="0.5" />
          <line x1="204.5" y1="433" x2="204.5" y2="443" stroke={c.metalLight} strokeWidth="0.3" opacity="0.5" />
          {/* Cross-guard */}
          <rect x="184" y="443" width="36" height="5" fill={`url(#metal-${uid})`} rx="1.5" />
          <rect x="182" y="441" width="4" height="9" fill={c.metalLight} rx="1" />
          <rect x="218" y="441" width="4" height="9" fill={c.metalLight} rx="1" />
          {/* Blade */}
          <path
            d="M 198 448 L 206 448 L 205 618 L 202 628 L 199 618 Z"
            fill={`url(#blade-${uid})`}
            stroke={c.bladeDark}
            strokeWidth="0.3"
          />
          {/* Fuller (blade highlight) */}
          <line x1="202" y1="452" x2="202" y2="618" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.55" />
        </m.g>

        {/* ========== NECK ========== */}
        <path d="M 137 158 Q 150 166 163 158 L 164 186 L 136 186 Z" fill={`url(#stone-${uid})`} />
        {/* Neck shadow */}
        <path d="M 137 172 Q 150 178 163 172 L 164 186 L 136 186 Z" fill={c.dark} opacity="0.25" />

        {/* ========== HEAD ========== */}
        <ellipse cx="150" cy="126" rx="27" ry="34" fill={`url(#stone-${uid})`} />
        {/* Cheek highlights */}
        <ellipse cx="138" cy="130" rx="5" ry="8" fill={c.accent} opacity="0.35" />
        {/* Hair edges */}
        <path d="M 122 112 Q 118 160 130 178 L 138 172 L 132 128 Z" fill={c.dark} opacity="0.3" />
        <path d="M 178 112 Q 182 160 170 178 L 162 172 L 168 128 Z" fill={c.dark} opacity="0.3" />
        {/* Crown/wreath hint */}
        <path
          d="M 126 100 Q 150 90 174 100 Q 170 105 150 102 Q 130 105 126 100 Z"
          fill={`url(#metal-${uid})`}
          opacity="0.7"
        />

        {/* ========== BLINDFOLD ========== */}
        <g>
          <rect x="119" y="120" width="62" height="13" fill={c.dark} opacity="0.72" />
          <rect x="119" y="120" width="62" height="13" fill={`url(#stone-${uid})`} opacity="0.25" />
          <rect x="119" y="120" width="62" height="1" fill={c.accent} opacity="0.6" />
          <rect x="119" y="132" width="62" height="1" fill="#000000" opacity="0.3" />
          {/* Fabric fold line */}
          <line x1="128" y1="120" x2="128" y2="133" stroke={c.dark} strokeWidth="0.4" opacity="0.5" />
          <line x1="150" y1="120" x2="150" y2="133" stroke={c.dark} strokeWidth="0.4" opacity="0.5" />
          <line x1="172" y1="120" x2="172" y2="133" stroke={c.dark} strokeWidth="0.4" opacity="0.5" />

          {/* Left ribbon (animated — sway in wind) */}
          <m.g
            animate={{ rotate: [-3, 2, -1.5, 2.5, -3] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '122px 133px', transformBox: 'fill-box' }}
          >
            <path
              d="M 120 132 Q 108 152 104 184 Q 102 208 106 226"
              stroke={c.dark}
              strokeWidth="3.5"
              fill="none"
              opacity="0.55"
              strokeLinecap="round"
            />
            <path
              d="M 120 132 Q 108 152 104 184 Q 102 208 106 226"
              stroke={c.accent}
              strokeWidth="1"
              fill="none"
              opacity="0.4"
              strokeLinecap="round"
            />
          </m.g>
          {/* Right ribbon */}
          <m.g
            animate={{ rotate: [2, -2.5, 1.5, -2, 2] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            style={{ transformOrigin: '178px 133px', transformBox: 'fill-box' }}
          >
            <path
              d="M 180 132 Q 192 152 196 184 Q 198 208 194 226"
              stroke={c.dark}
              strokeWidth="3.5"
              fill="none"
              opacity="0.55"
              strokeLinecap="round"
            />
            <path
              d="M 180 132 Q 192 152 196 184 Q 198 208 194 226"
              stroke={c.accent}
              strokeWidth="1"
              fill="none"
              opacity="0.4"
              strokeLinecap="round"
            />
          </m.g>
        </g>

        {/* ========== LEFT ARM (extended — holds scales) ========== */}
        <path
          d="M 114 188
             Q 96 181 74 176
             Q 54 173 42 174
             Q 34 177 36 182
             Q 40 187 56 190
             Q 78 195 108 200
             Q 116 198 119 193 Z"
          fill={`url(#stone-${uid})`}
        />
        {/* Hand */}
        <ellipse cx="40" cy="180" rx="6" ry="5" fill={`url(#stone-${uid})`} />
        <ellipse cx="38" cy="179" rx="3" ry="2" fill={c.accent} opacity="0.4" />

        {/* ========== SCALES (the living element) ========== */}
        <m.g
          animate={{ rotate: [-1.4, 1.5, -0.9, 1.8, -1.4] }}
          transition={{
            duration: swaySpeed,
            repeat: Infinity,
            ease: [0.45, 0, 0.55, 1],
          }}
          style={{ transformOrigin: '40px 180px', transformBox: 'fill-box' }}
        >
          {/* Vertical suspension from hand */}
          <line x1="40" y1="184" x2="40" y2="220" stroke={c.metalDark} strokeWidth="1.4" />
          <line x1="40" y1="184" x2="40" y2="220" stroke={c.metalLight} strokeWidth="0.5" opacity="0.7" />

          {/* Central knot */}
          <circle cx="40" cy="221" r="2.2" fill={`url(#metal-${uid})`} stroke={c.metalDark} strokeWidth="0.3" />

          {/* Beam */}
          <rect x="-8" y="220" width="96" height="2.8" fill={`url(#metal-${uid})`} rx="1.4" />
          <rect x="-8" y="220" width="96" height="0.9" fill={c.metalLight} opacity="0.8" />
          {/* Beam end decorations */}
          <circle cx="-6" cy="221.4" r="3" fill={c.metal} stroke={c.metalDark} strokeWidth="0.3" />
          <circle cx="86" cy="221.4" r="3" fill={c.metal} stroke={c.metalDark} strokeWidth="0.3" />

          {/* Left suspension chains */}
          <line x1="-4" y1="224" x2="-4" y2="260" stroke={c.metalDark} strokeWidth="0.7" />
          <line x1="4" y1="224" x2="4" y2="260" stroke={c.metalDark} strokeWidth="0.7" />
          <line x1="0" y1="224" x2="0" y2="260" stroke={c.metalLight} strokeWidth="0.3" opacity="0.6" />

          {/* Right suspension chains */}
          <line x1="76" y1="224" x2="76" y2="260" stroke={c.metalDark} strokeWidth="0.7" />
          <line x1="84" y1="224" x2="84" y2="260" stroke={c.metalDark} strokeWidth="0.7" />
          <line x1="80" y1="224" x2="80" y2="260" stroke={c.metalLight} strokeWidth="0.3" opacity="0.6" />

          {/* Left cup (subtle counter-sway) */}
          <m.g
            animate={{ rotate: [0.7, -0.7, 0.9, -0.5, 0.7] }}
            transition={{
              duration: swaySpeed * 0.75,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
            style={{ transformOrigin: '0px 260px', transformBox: 'fill-box' }}
          >
            <ellipse cx="0" cy="260" rx="16" ry="3.2" fill={c.metalDark} />
            <path
              d="M -15 260 Q 0 278 15 260 L 13 262 Q 0 276 -13 262 Z"
              fill={`url(#metal-${uid})`}
              stroke={c.metalDark}
              strokeWidth="0.3"
            />
            <ellipse cx="0" cy="260" rx="14" ry="1.6" fill={c.metalLight} opacity="0.7" />
            <ellipse cx="-4" cy="260" rx="3" ry="1" fill={c.accent} opacity="0.6" />
          </m.g>

          {/* Right cup */}
          <m.g
            animate={{ rotate: [-0.7, 0.7, -0.9, 0.5, -0.7] }}
            transition={{
              duration: swaySpeed * 0.75,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.4,
            }}
            style={{ transformOrigin: '80px 260px', transformBox: 'fill-box' }}
          >
            <ellipse cx="80" cy="260" rx="16" ry="3.2" fill={c.metalDark} />
            <path
              d="M 65 260 Q 80 278 95 260 L 93 262 Q 80 276 67 262 Z"
              fill={`url(#metal-${uid})`}
              stroke={c.metalDark}
              strokeWidth="0.3"
            />
            <ellipse cx="80" cy="260" rx="14" ry="1.6" fill={c.metalLight} opacity="0.7" />
            <ellipse cx="76" cy="260" rx="3" ry="1" fill={c.accent} opacity="0.6" />
          </m.g>
        </m.g>

        {/* Soft vignette over whole figure (depth) */}
        <rect x="0" y="0" width="300" height="760" fill={`url(#vignette-${uid})`} pointerEvents="none" />
      </svg>
    </div>
  );
};

export const ThemisBackground = React.memo(ThemisBackgroundImpl);
ThemisBackground.displayName = 'ThemisBackground';
