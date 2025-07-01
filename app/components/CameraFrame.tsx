const CameraFrame = () => {
  return (
    <div className="w-full h-screen bg-transparent flex items-center justify-center">
      <div className="relative w-[417px] h-[288px]">
        {/* SVG Frame - Professional styling to match TopBar */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 384 256"
          className="absolute inset-0"
        >
          <defs>
            {/* Professional gradient matching TopBar theme */}
            <linearGradient
              id="professionalGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#8b5cf6">
                <animate
                  attributeName="stop-color"
                  values="#8b5cf6;#3b82f6;#06b6d4;#8b5cf6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#3b82f6">
                <animate
                  attributeName="stop-color"
                  values="#3b82f6;#06b6d4;#8b5cf6;#3b82f6"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#06b6d4">
                <animate
                  attributeName="stop-color"
                  values="#06b6d4;#8b5cf6;#3b82f6;#06b6d4"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id="subtleGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Drop shadow filter */}
            <filter id="dropShadow">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="4"
                floodColor="#8b5cf6"
                floodOpacity="0.3"
              />
            </filter>
          </defs>

          {/* Main frame with professional styling */}
          <rect
            x="8"
            y="8"
            width="368"
            height="240"
            fill="none"
            stroke="url(#professionalGradient)"
            strokeWidth="2"
            rx="8"
            opacity="0.9"
            filter="url(#subtleGlow)"
          />

          {/* Inner accent frame */}
          <rect
            x="12"
            y="12"
            width="360"
            height="232"
            fill="none"
            stroke="url(#professionalGradient)"
            strokeWidth="1"
            rx="6"
            opacity="0.5"
          />

          {/* Corner brackets - sleek and minimal */}
          <g
            stroke="url(#professionalGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          >
            {/* Top-left */}
            <path d="M 24 8 L 8 8 L 8 24">
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>

            {/* Top-right */}
            <path d="M 360 8 L 376 8 L 376 24">
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </path>

            {/* Bottom-left */}
            <path d="M 8 232 L 8 248 L 24 248">
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="2s"
                begin="1s"
                repeatCount="indefinite"
              />
            </path>

            {/* Bottom-right */}
            <path d="M 376 232 L 376 248 L 360 248">
              <animate
                attributeName="opacity"
                values="0.4;0.8;0.4"
                dur="2s"
                begin="1.5s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Subtle scanning line */}
          <line
            x1="8"
            y1="128"
            x2="376"
            y2="128"
            stroke="url(#professionalGradient)"
            strokeWidth="0.5"
            opacity="0.3"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,-240;0,240;0,-240"
              dur="8s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.3;0"
              dur="8s"
              repeatCount="indefinite"
            />
          </line>

          {/* Professional frame border enhancement */}
          <rect
            x="6"
            y="6"
            width="372"
            height="244"
            fill="none"
            stroke="rgba(139, 92, 246, 0.2)"
            strokeWidth="1"
            rx="10"
            filter="url(#dropShadow)"
          />
        </svg>
      </div>
    </div>
  );
};

export default CameraFrame;
