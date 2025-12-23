'use client';

export function CisnetHeroAnimated() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes orbitRings {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes swanGlow {
          0%, 100% {
            opacity: 0.8;
            filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.3));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.5));
          }
        }

        @keyframes eyeGlow {
          0%, 100% {
            opacity: 0.4;
            r: 6px;
          }
          50% {
            opacity: 1;
            r: 8px;
          }
        }

        @keyframes floatSwan {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .cisnet-orbit-rings {
          animation: orbitRings 25s linear infinite;
          transform-origin: center;
        }

        .cisnet-swan {
          animation: swanGlow 4s ease-in-out infinite, floatSwan 6s ease-in-out infinite;
        }

        .cisnet-eye-glow {
          animation: eyeGlow 3s ease-in-out infinite;
        }
      `}</style>

      {/* SVG Container */}
      <svg
        viewBox="0 0 400 400"
        className="w-72 h-72 md:w-96 md:h-96"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Defining gradients and filters */}
        <defs>
          {/* Gradient para el cisne - cuerpo */}
          <linearGradient id="swanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.95 }} />
            <stop offset="50%" style={{ stopColor: '#f8fafc', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f1f5f9', stopOpacity: 1 }} />
          </linearGradient>

          {/* Gradient para el cuello */}
          <linearGradient id="neckGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#f3f4f6', stopOpacity: 1 }} />
          </linearGradient>

          {/* Gradient para el ojo */}
          <radialGradient id="eyeGlowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#06b6d4', stopOpacity: 0.6 }} />
            <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 0.2 }} />
          </radialGradient>

          {/* Filter para suavidad */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Shadow filter */}
          <filter id="subtleShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.15" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="offsetblur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background subtle vignette */}
        <defs>
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
            <stop offset="100%" style={{ stopColor: '#000000', stopOpacity: 0.05 }} />
          </radialGradient>
        </defs>
        <rect width="400" height="400" fill="url(#vignette)" opacity="0.3" />

        {/* Orbital energy rings - animated */}
        <g className="cisnet-orbit-rings" opacity="0.65">
          {/* Ring 1 - Inner - Cyan */}
          <circle
            cx="200"
            cy="200"
            r="95"
            fill="none"
            stroke="rgba(34, 211, 238, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="10 5"
          />
          {/* Ring 2 - Medium - Cyan darker */}
          <circle
            cx="200"
            cy="200"
            r="135"
            fill="none"
            stroke="rgba(6, 182, 212, 0.25)"
            strokeWidth="1"
            strokeDasharray="15 8"
          />
          {/* Ring 3 - Outer - Cyan subtle */}
          <circle
            cx="200"
            cy="200"
            r="170"
            fill="none"
            stroke="rgba(34, 211, 238, 0.15)"
            strokeWidth="0.8"
            strokeDasharray="12 10"
          />
        </g>

        {/* Main swan group - with glow animation */}
        <g className="cisnet-swan">
          {/* Swan body - main ellipse */}
          <ellipse
            cx="200"
            cy="240"
            rx="72"
            ry="82"
            fill="url(#swanGradient)"
            stroke="#d1d5db"
            strokeWidth="1.2"
            filter="url(#subtleShadow)"
          />

          {/* Body highlight - subtle shine */}
          <ellipse
            cx="180"
            cy="210"
            rx="45"
            ry="50"
            fill="#ffffff"
            opacity="0.4"
          />

          {/* Swan neck - elegant S-curve */}
          <path
            d="M 200 158 Q 195 145, 195 120 Q 195 100, 200 80"
            stroke="url(#neckGradient)"
            strokeWidth="32"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#subtleShadow)"
          />

          {/* Neck right side shading */}
          <path
            d="M 200 158 Q 205 145, 205 120 Q 205 100, 200 80"
            stroke="#e5e7eb"
            strokeWidth="28"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />

          {/* Swan head - elegant circle */}
          <circle
            cx="200"
            cy="50"
            r="25"
            fill="url(#swanGradient)"
            stroke="#d1d5db"
            strokeWidth="1.2"
            filter="url(#subtleShadow)"
          />

          {/* Head highlight */}
          <circle
            cx="190"
            cy="42"
            r="10"
            fill="#ffffff"
            opacity="0.5"
          />

          {/* Beak - elegant and tapered */}
          <path
            d="M 220 48 L 248 45 L 222 55 Z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="0.8"
            strokeLinejoin="round"
            filter="url(#subtleShadow)"
          />

          {/* Eye base - dark pupil */}
          <circle
            cx="212"
            cy="46"
            r="3.5"
            fill="#1f2937"
            opacity="0.9"
          />

          {/* Eye glow - blue soft pulse */}
          <circle
            cx="212"
            cy="46"
            r="6"
            fill="url(#eyeGlowGradient)"
            className="cisnet-eye-glow"
            opacity="0.6"
          />

          {/* Eye shine */}
          <circle
            cx="213.5"
            cy="44.5"
            r="1.5"
            fill="#ffffff"
            opacity="0.8"
          />

          {/* Wing - right side - larger and elegant */}
          <path
            d="M 268 230 Q 305 215, 310 250 Q 305 275, 280 268 Q 270 265, 268 255 Z"
            fill="#f9fafb"
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity="0.95"
            filter="url(#subtleShadow)"
          />

          {/* Wing - right feather lines */}
          <path
            d="M 280 240 Q 295 232, 305 250"
            stroke="#e5e7eb"
            strokeWidth="0.8"
            fill="none"
            opacity="0.5"
          />

          {/* Wing - left side */}
          <path
            d="M 132 230 Q 95 215, 90 250 Q 95 275, 120 268 Q 130 265, 132 255 Z"
            fill="#f9fafb"
            stroke="#e5e7eb"
            strokeWidth="1"
            opacity="0.95"
            filter="url(#subtleShadow)"
          />

          {/* Wing - left feather lines */}
          <path
            d="M 120 240 Q 105 232, 95 250"
            stroke="#e5e7eb"
            strokeWidth="0.8"
            fill="none"
            opacity="0.5"
          />

          {/* Tail feathers - graceful and flowing */}
          <path
            d="M 175 315 Q 160 345, 155 375"
            stroke="#ffffff"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#subtleShadow)"
          />
          <path
            d="M 200 320 Q 200 355, 200 385"
            stroke="#ffffff"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
            filter="url(#subtleShadow)"
          />
          <path
            d="M 225 315 Q 240 345, 245 375"
            stroke="#ffffff"
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
            filter="url(#subtleShadow)"
          />

          {/* Tail shading - subtle depth */}
          <path
            d="M 200 320 L 200 380"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>

        {/* Additional rotating light elements */}
        <g className="cisnet-orbit-rings" opacity="0.4">
          {/* Light accent 1 */}
          <circle
            cx="200"
            cy="200"
            r="110"
            fill="none"
            stroke="rgba(34, 211, 238, 0.25)"
            strokeWidth="0.5"
          />
          {/* Light accent 2 */}
          <circle
            cx="200"
            cy="200"
            r="155"
            fill="none"
            stroke="rgba(6, 182, 212, 0.15)"
            strokeWidth="0.5"
          />
        </g>

        {/* Subtle particle effects - energy points */}
        <g opacity="0.3" className="cisnet-orbit-rings">
          <circle cx="320" cy="200" r="2" fill="rgba(34, 211, 238, 0.6)" />
          <circle cx="80" cy="200" r="2" fill="rgba(34, 211, 238, 0.6)" />
          <circle cx="200" cy="320" r="2" fill="rgba(34, 211, 238, 0.6)" />
          <circle cx="200" cy="80" r="2" fill="rgba(34, 211, 238, 0.6)" />
        </g>
      </svg>
    </div>
  );
}
