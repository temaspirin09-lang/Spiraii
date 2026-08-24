'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    function onResize() {
      if (window.innerWidth >= 901) setMenuOpen(false);
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />

      <div className="page-lock">
        <header className="site-header">
          <a href="#top" className="logo-link appear appear--scale" style={{ ['--d' as any]: '0.08s' }} aria-label="SPIRAI">
            <SpiralMark />
            <span>SPIRAI</span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <a href="#features" className="nav-pill appear appear--scale" style={{ ['--d' as any]: '0.16s' }}>Возможности</a>
            <a href="#how-it-works" className="nav-pill appear appear--soft" style={{ ['--d' as any]: '0.28s' }}>Как это работает</a>
            <a href="#subjects" className="nav-pill appear appear--scale" style={{ ['--d' as any]: '0.40s' }}>Предметы</a>
            <Link href="/app/pricing" className="nav-pill appear appear--soft" style={{ ['--d' as any]: '0.52s' }}>Тарифы</Link>
          </nav>

          <div className="header-cta-wrap">
            <Link
              href="/login"
              className="btn btn-solid appear appear--scale"
              style={{ ['--d' as any]: '0.34s' }}
            >
              Начать бесплатно
            </Link>
            <button
              className="burger"
              aria-controls="site-nav"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span /><span /><span />
            </button>
          </div>
        </header>

        <main className="hero" id="top">
          <div className="hero-copy">
            <div className="badge appear appear--pop" style={{ ['--d' as any]: '0.22s' }}>
              <SparkleIcon />
              Персональный AI-репетитор
            </div>

            <h1>
              <span className="headline-line appear appear--mask" style={{ ['--d' as any]: '0.42s' }}>
                SPIRAI объясняет,
              </span>
              <span className="headline-line appear appear--mask" style={{ ['--d' as any]: '0.62s' }}>
                а не просто <em>решает</em>.
              </span>
            </h1>

            <p className="lede appear appear--soft" style={{ animationDuration: '1.25s', ['--d' as any]: '0.82s' }}>
              Сфотографируй задание — SPIRAI объяснит ход мысли, задаст наводящие вопросы и подстроится под твой уровень.
            </p>

            <div className="hero-actions">
              <Link href="/login" className="btn btn-solid appear appear--btn" style={{ ['--d' as any]: '0.96s' }}>
                Начать бесплатно
              </Link>
              <a href="#how-it-works" className="btn btn-hero-ghost appear appear--side" style={{ ['--d' as any]: '1.10s' }}>
                Как это работает
              </a>
            </div>
          </div>
        </main>

        <footer className="stats">
          <div className="stat appear appear--stat" style={{ ['--d' as any]: '1.12s' }}>
            <DualPillIcon />
            11 предметов школьной программы
          </div>
          <div className="stat appear appear--stat" style={{ ['--d' as any]: '1.28s' }}>
            <DownloadTileIcon />
            7 режимов обучения
          </div>
          <div className="stat appear appear--stat" style={{ ['--d' as any]: '1.44s' }}>
            <AvatarsIcon />
            0₽ чтобы попробовать первое задание
          </div>
        </footer>
      </div>
    </>
  );
}

function SpiralMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <g transform="rotate(-30 12 12)">
        <circle cx="7.3" cy="3.2" r="1.45" />
        <rect x="5.5" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <rect x="14.9" y="4.7" width="3.6" height="14.6" rx="1.8" />
        <circle cx="16.7" cy="20.8" r="1.45" />
      </g>
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 24 24" fill="white" className="badge-star">
      <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
    </svg>
  );
}

function DualPillIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="dp1" x1="3" y1="2" x2="14" y2="22">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#3a3a3a" stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id="dp2" x1="3" y1="2" x2="14" y2="22">
          <stop offset="0" stopColor="#3a3a3a" stopOpacity="0.38" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.62" />
        </linearGradient>
      </defs>
      <rect x="3.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#dp1)" />
      <rect x="13.4" y="2.6" width="7.2" height="18.8" rx="3.6" fill="url(#dp2)" />
      <rect x="9.2" y="10.9" width="5.6" height="2.2" rx="1.1" fill="#4a4a4a" />
    </svg>
  );
}

function DownloadTileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <rect x="2.4" y="2.4" width="19.2" height="19.2" rx="6.2" fill="#ffffff" />
      <path d="M12 7.1v7.4" stroke="#111" strokeWidth="1.85" strokeLinecap="round" />
      <path d="M8.15 12.35L12 16.2l3.85-3.85" stroke="#111" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function AvatarsIcon() {
  return (
    <svg width="38" height="21" viewBox="0 0 40 22" className="stat-icon-wide">
      <circle cx="10.2" cy="11" r="9.2" fill="#2b2b2b" />
      <ellipse cx="10.2" cy="12.1" rx="4.15" ry="3.7" fill="#f4f4f4" />
      <circle cx="8.6" cy="11.4" r="0.7" fill="#1a1a1a" />
      <circle cx="11.8" cy="11.4" r="0.7" fill="#1a1a1a" />

      <circle cx="20.2" cy="11" r="9.2" fill="#ffffff" />
      <circle cx="18" cy="10" r="1.7" fill="#111" />
      <circle cx="22.4" cy="10" r="1.7" fill="#111" />
      <ellipse cx="20.2" cy="13" rx="1.2" ry="0.8" fill="#111" />
      <path d="M17 15c1.2 1.2 4.8 1.2 6 0" stroke="#111" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      <circle cx="30.2" cy="11" r="9.2" fill="#f26b1d" />
      <text x="30.2" y="15.1" fontSize="12.5" fontWeight="700" fill="white" textAnchor="middle" fontFamily="Inter, sans-serif">e</text>
    </svg>
  );
}

