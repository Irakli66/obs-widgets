"use client";
import { useEffect, useState } from "react";

export default function AceAnimationWidget() {
  const [show, setShow] = useState(false);

  // Function to trigger the animation
  const triggerAnimation = () => {
    setShow(true);
    setTimeout(() => setShow(false), 3000); // Hide after 3 seconds
  };

  // Trigger from URL param (e.g. ?ace=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("ace") === "true") {
      triggerAnimation();
    }
  }, []);

  // Trigger from keyboard shortcut (Ctrl + A)
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        triggerAnimation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Manual trigger button (for testing)
  const handleClick = () => {
    triggerAnimation();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-[fadeInScale_3s_ease-out_forwards]">
        {/* Main container */}
        <div className="relative">
          {/* Crosshair SVG */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-[spin_2s_ease-in-out]">
            <svg
              width="60"
              height="60"
              viewBox="0 0 60 60"
              className="text-red-500"
            >
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                opacity="0.8"
              />
              <line
                x1="30"
                y1="5"
                x2="30"
                y2="15"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="45"
                x2="30"
                y2="55"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="5"
                y1="30"
                x2="15"
                y2="30"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="45"
                y1="30"
                x2="55"
                y2="30"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle cx="30" cy="30" r="3" fill="currentColor" />
            </svg>
          </div>

          {/* ACE Text */}
          <div className="text-center">
            <h1 className="text-9xl font-black text-white tracking-wider animate-[bounce_1s_ease-out_0.5s_both] drop-shadow-lg">
              ACE
            </h1>
            <div className="mt-4 animate-[slideUp_1s_ease-out_1s_both] opacity-0">
              <p className="text-2xl font-bold text-yellow-400 tracking-widest">
                5 ELIMINATIONS
              </p>
            </div>
          </div>

          {/* Stars SVG */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg
                key={i}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="text-yellow-400 animate-[twinkle_2s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                <path
                  fill="currentColor"
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
