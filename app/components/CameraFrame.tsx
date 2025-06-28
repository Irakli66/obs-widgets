const CameraFrame = () => {
  return (
    <div className="w-full h-screen bg-transparent flex items-center justify-center">
      <div className="relative w-[417px] h-[288px] ">
        {/* SVG Frame - Works perfectly in OBS */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 384 256"
          className="absolute inset-0"
        >
          <defs>
            {/* Animated gradient for glow effect */}
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff">
                <animate
                  attributeName="stop-color"
                  values="#00ffff;#0080ff;#00ccff;#00ffff"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#0080ff">
                <animate
                  attributeName="stop-color"
                  values="#0080ff;#00ccff;#00ffff;#0080ff"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#00ccff">
                <animate
                  attributeName="stop-color"
                  values="#00ccff;#00ffff;#0080ff;#00ccff"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Filter for glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer glow layers */}
          <rect
            x="2"
            y="2"
            width="380"
            height="252"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="6"
            rx="8"
            opacity="0.3"
            filter="url(#glow)"
          />

          <rect
            x="4"
            y="4"
            width="376"
            height="248"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="4"
            rx="6"
            opacity="0.6"
          />

          {/* Main frame */}
          <rect
            x="6"
            y="6"
            width="372"
            height="244"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="6"
            rx="5"
          />

          {/* Inner frame */}
          <rect
            x="12"
            y="12"
            width="360"
            height="232"
            fill="none"
            stroke="url(#neonGradient)"
            strokeWidth="1"
            rx="3"
            opacity="0.7"
          />

          {/* Corner indicators */}
          <g stroke="url(#neonGradient)" strokeWidth="2" fill="none">
            {/* Top-left */}
            <path d="M 20 6 L 6 6 L 6 20">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>

            {/* Top-right */}
            <path d="M 364 6 L 378 6 L 378 20">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="1s"
                begin="0.25s"
                repeatCount="indefinite"
              />
            </path>

            {/* Bottom-left */}
            <path d="M 6 236 L 6 250 L 20 250">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="1s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </path>

            {/* Bottom-right */}
            <path d="M 378 236 L 378 250 L 364 250">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur="1s"
                begin="0.75s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Scanning line */}

          {/* Status indicators */}
        </svg>
      </div>
    </div>
  );
};

export default CameraFrame;
