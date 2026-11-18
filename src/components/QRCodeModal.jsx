// QR Code Modal - Telefon orqali loyihaga kirish uchun
// Google Chart API orqali QR kod yaratiladi (internet kerak emas - ichki CDN)
import React, { useState, useEffect } from 'react';

export default function QRCodeModal({ onClose, theme = 'dark' }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Joriy sahifaning tarmoq manzilini aniqlash
    const currentUrl = window.location.origin;
    setUrl(currentUrl);
  }, []);

  const qrImageUrl = url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=030712&margin=12&qzone=1&format=png`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className={`relative rounded-3xl shadow-2xl border max-w-sm w-full p-6 flex flex-col items-center gap-5 ${
          theme === 'light'
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#0d1017] border-white/15 text-white'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Neon ambient glow */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/15 to-teal-400/20 blur-sm pointer-events-none"></div>

        {/* Header */}
        <div className="relative w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* QR icon */}
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-black text-sm">Telefonda Ochish</h3>
              <p className={`text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                QR kodni skanerlang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors text-lg font-bold ${
              theme === 'light'
                ? 'hover:bg-slate-100 text-slate-500'
                : 'hover:bg-white/10 text-slate-400'
            }`}
          >
            ×
          </button>
        </div>

        {/* QR Code Box */}
        <div className="relative">
          <div className="w-56 h-56 rounded-2xl overflow-hidden border-4 border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.4)] bg-white flex items-center justify-center">
            {url ? (
              <img
                src={qrImageUrl}
                alt="QR kod"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback: Google Charts API
                  e.target.src = `https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=${encodeURIComponent(url)}&choe=UTF-8`;
                }}
              />
            ) : (
              <div className="animate-pulse flex flex-col items-center gap-2 text-slate-400">
                <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
                <span className="text-xs">Yuklanmoqda...</span>
              </div>
            )}
          </div>
          {/* Corner decorators */}
          <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-cyan-400 rounded-tl-xl"></div>
          <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-cyan-400 rounded-tr-xl"></div>
          <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-cyan-400 rounded-bl-xl"></div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-cyan-400 rounded-br-xl"></div>
        </div>

        {/* URL + Copy */}
        <div className={`w-full rounded-xl border flex items-center gap-2 px-3 py-2 ${
          theme === 'light'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-white/5 border-white/10'
        }`}>
          <svg className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
          <span className={`flex-1 text-xs font-mono truncate ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            {url || 'Aniqlanmoqda...'}
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-400 text-[11px] font-bold transition-colors whitespace-nowrap"
          >
            {copied ? '✓ Nusxalandi' : 'Nusxa'}
          </button>
        </div>

        {/* Instruction */}
        <div className={`w-full text-center text-[11px] leading-relaxed ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
          <p>📱 Telefon kamerasini yoki QR skaner ilovasini oching.</p>
          <p className="mt-1">Telefon va kompyuter <strong>bir xil Wi-Fi</strong>ga ulanganligiga ishonch hosil qiling.</p>
        </div>
      </div>
    </div>
  );
}

