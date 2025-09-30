"use client"

import { useNavigate } from "react-router-dom";

export default function IndianRailwayLanding() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#0b0f16] dark:text-white flex flex-col relative overflow-hidden">
      {/* Tricolor Hyperspeed Background - CSS Version */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Moving light streaks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const colors = ['#FF9933', '#ffffff', '#138808'];
          const color = colors[i % 3];
          const delay = Math.random() * 3;
          const duration = Math.random() * 1 + 0.5;
          const width = Math.random() * 3 + 1;
          const opacity = Math.random() * 0.7 + 0.3;
          const yPos = Math.random() * 100;
          
          return (
            <div
              key={i}
              className="absolute h-px animate-hyperspeed"
              style={{
                backgroundColor: color,
                width: `${width}px`,
                opacity: opacity,
                top: `${yPos}%`,
                left: '-100px',
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                boxShadow: `0 0 ${width * 2}px ${color}`,
              }}
            />
          );
        })}
        
        {/* Faster accent streaks */}
        {Array.from({ length: 20 }).map((_, i) => {
          const colors = ['#FF9933', '#ffffff', '#138808'];
          const color = colors[i % 3];
          const delay = Math.random() * 2;
          const duration = Math.random() * 0.8 + 0.3;
          const width = Math.random() * 6 + 2;
          const opacity = Math.random() * 0.9 + 0.1;
          const yPos = Math.random() * 100;
          
          return (
            <div
              key={`accent-${i}`}
              className="absolute h-0.5 animate-hyperspeed-fast"
              style={{
                backgroundColor: color,
                width: `${width}px`,
                opacity: opacity,
                top: `${yPos}%`,
                left: '-100px',
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                boxShadow: `0 0 ${width * 3}px ${color}`,
              }}
            />
          );
        })}
        
        {/* Overlay for text readability */}
  <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-[#0b0f16] dark:to-[#0b0f16]" />
  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 dark:from-[#0b0f16]/20 dark:to-[#0b0f16]/60" />
      </div>

      {/* Main */}
  <main className="flex-1 flex items-center px-6 sm:px-10 relative z-10">
  <div className="w-full max-w-6xl mx-auto">
          {/* Eyebrow */}
          <div className="text-sm tracking-[0.3em] text-neutral-500 dark:text-[#cbd5e1]/70 uppercase">Indian Railways</div>

          {/* Hero */}
          <h1 className="mt-4 font-bold leading-tight text-left text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-black dark:via-white to-[#138808]"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}>
            Bharat Rail Control
          </h1>
          <p className="mt-4 max-w-2xl text-left text-neutral-700 dark:text-[#d1d5db]"
             style={{ fontSize: "clamp(1rem, 2.2vw, 1.25rem)" }}>
            A modern command view for stations, corridors, and yards—designed for speed, clarity, and precision.
          </p>

          {/* CTA */}
          <div className="mt-10 flex items-center gap-6">
            <button
              onClick={() => navigate('/login')}
              className="relative inline-flex items-center rounded-full"
            >
              <span className="absolute inset-0 rounded-full bg-[#FF9933] blur-md opacity-60" aria-hidden />
              <span className="relative inline-flex items-center gap-3 rounded-full border border-[#ffb067] bg-[#ff9933] px-8 py-3 text-base font-semibold text-white dark:text-white shadow-[0_8px_30px_rgb(255,153,51,0.35)] transition-transform duration-300 hover:scale-[1.03]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-neutral-500 dark:text-[#9aa8bf] hover:text-black dark:hover:text-white transition-colors text-sm"
            >
              Continue as demo →
            </button>
          </div>

          {/* Tricolor progress bars */}
          <div className="mt-12 flex items-center gap-3">
            <span className="inline-block h-1.5 w-24 rounded-full bg-[#FF9933]" />
            <span className="inline-block h-1.5 w-24 rounded-full bg-neutral-200 dark:bg-white/90" />
            <span className="inline-block h-1.5 w-24 rounded-full bg-[#138808]" />
          </div>

          {/* Feature bullets */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-6">
              <div className="text-3xl font-bold text-[#FF9933]">24/7</div>
              <div className="mt-1 text-sm text-neutral-500 dark:text-[#9aa8bf]">Real-time monitoring</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-6">
              <div className="text-3xl font-bold">AI</div>
              <div className="mt-1 text-sm text-neutral-500 dark:text-[#9aa8bf]">Predictive analytics</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-6">
              <div className="text-3xl font-bold text-[#138808]">99.9%</div>
              <div className="mt-1 text-sm text-neutral-500 dark:text-[#9aa8bf]">System uptime</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0b0f16]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-[#9aa8bf]">
            <span>© {new Date().getFullYear()} Bharat Rail Control</span>
            <span className="hidden md:inline">•</span>
            <span>All rights reserved</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-1.5 w-10 rounded-full bg-[#FF9933]" />
            <span className="h-1.5 w-10 rounded-full bg-neutral-200 dark:bg-white/90" />
            <span className="h-1.5 w-10 rounded-full bg-[#138808]" />
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-[#9aa8bf]">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
