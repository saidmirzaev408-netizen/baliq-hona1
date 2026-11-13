// FISH HOUSE Premium Aquarium & Fish Restaurant Logo Component
// Supports Vite /@fs/ direct image loading, relative public path, AND a masterfully crafted 1:1 SVG twin
import React, { useState } from 'react';

// Vite fs-direct path to user's uploaded banner image
const VITE_FS_IMG_URL = '/@fs/C:/Users/user/.gemini/antigravity/brain/c97d2a39-bdd2-4a24-8696-ddf8f879511f/.user_uploaded/media_1794562002082_fb897521.png';
const PUBLIC_IMG_URL = '/fishhouse-logo.png';

export function FishHouseLogo({
  className = "h-12",
  textSize = "text-xl",
  showSubtitle = true,
  iconOnly = false,
  forceSvg = false
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const imageSources = [VITE_FS_IMG_URL, PUBLIC_IMG_URL];
  const currentSrc = imageSources[imageIndex];

  const handleImgError = () => {
    if (imageIndex < imageSources.length - 1) {
      setImageIndex(imageIndex + 1);
    } else {
      setImageIndex(-1); // Switch to master SVG
    }
  };

  // If real image source is still available and not forced to SVG
  if (!forceSvg && imageIndex >= 0 && currentSrc) {
    if (iconOnly) {
      // Aquarium cube only (cropped left part of banner)
      return (
        <div
          className={`relative flex-shrink-0 overflow-hidden rounded-2xl border border-cyan-400/40 shadow-[0_0_25px_rgba(6,182,212,0.45)] ${className}`}
          style={{ aspectRatio: '1 / 1' }}
        >
          <img
            src={currentSrc}
            alt="FISH HOUSE Icon"
            className="h-full w-auto object-cover object-left"
            style={{ maxWidth: 'none', transform: 'scale(1.15)', transformOrigin: 'left center' }}
            onError={handleImgError}
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-cyan-300/30 pointer-events-none"></div>
        </div>
      );
    }

    // Full banner image (with sleek rounded corners, subtle neon border, and compact size)
    return (
      <div className={`relative flex items-center ${className}`}>
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/40 shadow-[0_0_18px_rgba(6,182,212,0.35)] bg-black/50 p-1 flex items-center justify-center group transition-transform hover:scale-[1.02]">
          {/* Subtle Ambient Glow behind */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>

          <img
            src={currentSrc}
            alt="FISH HOUSE – Aquarium & Fish Restaurant"
            className="h-auto w-auto object-contain rounded-xl"
            style={{
              maxHeight: '42px',
              maxWidth: '215px',
              filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.45))'
            }}
            onError={handleImgError}
          />
        </div>
      </div>
    );
  }

  // ── MASTER 1:1 RECREATION OF USER'S GLOWING AQUARIUM BANNER ───────────────────
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      
      {/* 3D Glowing Glass Aquarium Cube (Rounded & Compact) */}
      <div className="relative flex-shrink-0 group">
        {/* Exterior Neon Glow Aura */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/40 via-blue-500/40 to-teal-400/30 blur-sm opacity-80 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Main Aquarium Container */}
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-b from-[#061527] via-[#04101e] to-[#02070e] border-2 border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.5),inset_0_0_10px_rgba(6,182,212,0.3)] overflow-hidden flex items-center justify-center">
          
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            <defs>
              {/* Water Gradient */}
              <linearGradient id="fhAquaWater" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#082b4c" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#0a3d66" stopOpacity="0.8" />
                <stop offset="85%" stopColor="#041b30" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#020d18" stopOpacity="1" />
              </linearGradient>

              {/* Top Water Caustic Light */}
              <linearGradient id="fhTopLight" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="30%" stopColor="#67e8f9" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="70%" stopColor="#67e8f9" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>

              {/* Fish Body Gradient (Cyan to Vibrant Blue) */}
              <linearGradient id="fhFishBody" x1="20" y1="35" x2="75" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="30%" stopColor="#38bdf8" />
                <stop offset="70%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>

              {/* Fish Belly Highlight */}
              <linearGradient id="fhFishBelly" x1="30" y1="58" x2="60" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#7dd3fc" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>

              {/* Fish Fin Glow */}
              <linearGradient id="fhFishFin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.5" />
              </linearGradient>

              {/* Sea Plant Gradient */}
              <linearGradient id="fhPlantGrad" x1="0" y1="100" x2="0" y2="60" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0f766e" />
                <stop offset="50%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>

              {/* Pebbles Gradient */}
              <linearGradient id="fhPebbles" x1="0" y1="85" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#090d16" />
              </linearGradient>
            </defs>

            {/* Aquarium Water Background */}
            <rect width="100" height="100" fill="url(#fhAquaWater)" />

            {/* Top Surface Light Waves */}
            <path d="M0,8 Q25,14 50,8 T100,8 L100,0 L0,0 Z" fill="url(#fhTopLight)" />
            <path d="M5,12 Q30,17 55,12 T95,12" stroke="#67e8f9" strokeWidth="1" strokeOpacity="0.6" fill="none" />

            {/* Aquarium Bottom Rocks / Pebbles */}
            <ellipse cx="25" cy="94" rx="18" ry="8" fill="url(#fhPebbles)" stroke="#0ea5e9" strokeWidth="0.75" strokeOpacity="0.5" />
            <ellipse cx="60" cy="96" rx="26" ry="7" fill="url(#fhPebbles)" stroke="#0ea5e9" strokeWidth="0.75" strokeOpacity="0.5" />
            <ellipse cx="82" cy="93" rx="14" ry="6" fill="url(#fhPebbles)" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" />

            {/* Left Aquatic Plants */}
            <path d="M12,95 Q8,75 14,60 Q20,74 16,95 Z" fill="url(#fhPlantGrad)" opacity="0.85" />
            <path d="M18,95 Q14,70 20,52 Q26,72 21,95 Z" fill="url(#fhPlantGrad)" opacity="0.95" />

            {/* Right Aquatic Plants */}
            <path d="M84,95 Q88,72 82,56 Q78,74 81,95 Z" fill="url(#fhPlantGrad)" opacity="0.85" />
            <path d="M78,95 Q72,76 77,64 Q82,78 80,95 Z" fill="url(#fhPlantGrad)" opacity="0.9" />

            {/* Glowing Fish Fins (Dorsal & Tail) */}
            {/* Tail Fin */}
            <path d="M26,51 L10,38 Q16,51 10,64 L26,53 Z" fill="url(#fhFishFin)" stroke="#67e8f9" strokeWidth="0.75" />
            {/* Top Dorsal Fin */}
            <path d="M42,36 Q52,24 64,33 Q54,36 46,38 Z" fill="url(#fhFishFin)" stroke="#67e8f9" strokeWidth="0.75" />
            {/* Bottom Pelvic Fin */}
            <path d="M45,63 Q48,74 54,67 Q51,62 48,61 Z" fill="url(#fhFishFin)" />

            {/* Main Fish Body (Curved, Modern, Sleek) */}
            <path
              d="M24,52 C28,42 42,34 60,37 C73,39 82,47 84,52 C82,58 71,67 56,67 C38,67 27,61 24,52 Z"
              fill="url(#fhFishBody)"
              stroke="#67e8f9"
              strokeWidth="1"
            />

            {/* Fish Belly Highlight */}
            <path
              d="M32,54 C38,62 52,65 62,64 C52,62 42,56 36,53 Z"
              fill="url(#fhFishBelly)"
            />

            {/* Side Pectoral Fin */}
            <path d="M44,52 Q37,58 40,63 Q48,58 46,51 Z" fill="#7dd3fc" stroke="#bae6fd" strokeWidth="0.75" />

            {/* Fish Eye (Cute, Glowing, Detailed) */}
            <circle cx="70" cy="48" r="4.2" fill="#ffffff" />
            <circle cx="70.5" cy="48" r="3" fill="#082f49" />
            <circle cx="71.2" cy="47.2" r="1.3" fill="#ffffff" />
            <circle cx="69.2" cy="49" r="0.6" fill="#38bdf8" />

            {/* Rising Air Bubbles with specular highlights */}
            <g className="animate-pulse">
              <circle cx="75" cy="32" r="2.8" fill="none" stroke="#67e8f9" strokeWidth="1" />
              <circle cx="75.8" cy="31.2" r="0.8" fill="#ffffff" />

              <circle cx="81" cy="22" r="3.6" fill="none" stroke="#67e8f9" strokeWidth="1.2" />
              <circle cx="82" cy="20.8" r="1" fill="#ffffff" />

              <circle cx="77" cy="14" r="2" fill="none" stroke="#bae6fd" strokeWidth="0.8" />
              <circle cx="77.5" cy="13.5" r="0.6" fill="#ffffff" />
            </g>

            {/* 3D Glass Surface Reflections (Diagonal Sheen) */}
            <path d="M8,8 L40,8 L15,80 L8,80 Z" fill="#ffffff" fillOpacity="0.08" />
            <circle cx="20" cy="20" r="12" fill="#ffffff" fillOpacity="0.05" filter="blur(2px)" />
          </svg>

          {/* Glass Inner Border */}
          <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
        </div>
      </div>

      {/* Brand Text Section (Exact Font, 3D Neon Gradients & Wave) */}
      {!iconOnly && (
        <div className="flex flex-col justify-center leading-none">
          {/* Main Title: FISH HOUSE with wave inside the 'O' */}
          <div className="flex items-center tracking-tight font-black">
            <span
              className={`font-black tracking-wider ${textSize}`}
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                background: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 60%, #94A3B8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.04em',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))'
              }}
            >
              FISH&nbsp;
            </span>

            <span
              className={`font-black tracking-wider relative inline-flex items-center ${textSize}`}
              style={{
                fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
                background: 'linear-gradient(180deg, #67E8F9 0%, #06B6D4 45%, #0284C7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.04em',
                filter: 'drop-shadow(0 0 12px rgba(6,182,212,0.6))'
              }}
            >
              H
              {/* Custom 'O' with central wave */}
              <span className="relative inline-flex items-center justify-center mx-[0.5px]">
                <span>O</span>
                <span className="absolute inset-x-0 h-[2px] bg-cyan-200 rounded-full shadow-[0_0_6px_#22d3ee] pointer-events-none"></span>
              </span>
              USE
            </span>
          </div>

          {/* Subtitle & Cyan Accent Underline */}
          {showSubtitle && (
            <div className="mt-1 flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.22em] uppercase text-cyan-400 flex items-center gap-1.5 opacity-95">
                <span className="w-3 h-[1.5px] bg-cyan-400/80 inline-block"></span>
                <span>AQUARIUM & FISH RESTAURANT</span>
                <span className="w-3 h-[1.5px] bg-cyan-400/80 inline-block"></span>
              </span>

              {/* Dynamic Bottom Neon Wave Line */}
              <svg className="w-full h-1.5 mt-0.5" viewBox="0 0 200 6" fill="none">
                <path
                  d="M0,3 Q50,0 100,3 T200,3"
                  stroke="url(#fhBannerWave)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="fhBannerWave" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
                    <stop offset="40%" stopColor="#06b6d4" stopOpacity="1" />
                    <stop offset="60%" stopColor="#38bdf8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default FishHouseLogo;
