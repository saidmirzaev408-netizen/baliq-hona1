// FISH HOUSE Logo Component
// Uses the actual logo image if available, otherwise renders SVG fallback
import React, { useState } from 'react';

// Try to import the actual logo image
// If the file exists in public/, it will be served at /fishhouse-logo.png
const LOGO_IMG_URL = '/fishhouse-logo.png';

export function FishHouseLogo({ 
  className = "h-10", 
  textSize = "text-2xl", 
  showSubtitle = true,
  useImage = true  // set to true to try the actual PNG logo first
}) {
  const [imgFailed, setImgFailed] = useState(false);

  // If using real image and it hasn't failed
  if (useImage && !imgFailed) {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={LOGO_IMG_URL}
          alt="FISH HOUSE Logo"
          className="h-full w-auto object-contain"
          style={{ maxHeight: '56px', filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.4))' }}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  // SVG Fallback (when image not found)
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Box - glowing blue fish */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0a1628] via-[#0d2a4a] to-[#061020] border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(0,200,255,0.5)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 rounded-2xl border border-cyan-300/20"></div>
          <svg viewBox="0 0 48 48" className="w-9 h-9" fill="none">
            <ellipse cx="24" cy="38" rx="16" ry="5" fill="url(#wgL)" opacity="0.7" />
            <path d="M8 24 Q20 10 36 20 Q42 24 36 28 Q20 38 8 24Z" fill="url(#fgL)" />
            <path d="M6 18 L14 24 L6 30Z" fill="url(#fg2L)" />
            <circle cx="30" cy="22" r="2.5" fill="white" />
            <circle cx="30.8" cy="21.2" r="1.2" fill="#001a33" />
            <circle cx="31.4" cy="20.8" r="0.4" fill="white" />
            <path d="M18 20 Q22 12 28 18" stroke="#67E8F9" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <circle cx="34" cy="12" r="1.5" fill="#06B6D4" opacity="0.8" />
            <circle cx="38" cy="8" r="1" fill="#22D3EE" opacity="0.6" />
            <circle cx="31" cy="9" r="0.8" fill="#67E8F9" opacity="0.5" />
            <defs>
              <linearGradient id="fgL" x1="6" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#06B6D4" /><stop offset="50%" stopColor="#38BDF8" /><stop offset="100%" stopColor="#BAE6FD" />
              </linearGradient>
              <linearGradient id="fg2L" x1="6" y1="18" x2="14" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0EA5E9" /><stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="wgL" x1="8" y1="38" x2="40" y2="38" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0E86D4" stopOpacity="0" /><stop offset="40%" stopColor="#06B6D4" /><stop offset="100%" stopColor="#0E86D4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute -inset-1 rounded-2xl bg-cyan-400/10 blur-sm -z-10"></div>
      </div>

      {/* Text */}
      <div className="flex flex-col leading-none">
        <span className={`font-black tracking-wide ${textSize}`} style={{
          background: 'linear-gradient(90deg, #ffffff 0%, #e0f7ff 40%, #06B6D4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.05em',
        }}>
          FISH <span style={{
            background: 'linear-gradient(90deg, #06B6D4 0%, #22D3EE 60%, #67E8F9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>HOUSE</span>
        </span>
        {showSubtitle && (
          <span className="text-[9px] font-bold tracking-[0.2em] text-cyan-400/80 uppercase mt-0.5">
            — Aquarium & Fish Restaurant —
          </span>
        )}
      </div>
    </div>
  );
}

export default FishHouseLogo;
