import Link from 'next/link';
import { LogoWordmark } from '@/components/SpiralLogo';

const navLinks = [
  { href: '#how', label: 'Как это работает' },
  { href: '#subjects', label: 'Предметы' },
  { href: '/app/pricing', label: 'Тарифы' }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white md:h-screen md:overflow-hidden">
      <header className="entrance mx-auto flex max-w-6xl items-center justify-between px-6 py-6" style={{ ['--d' as any]: '0.08s' }}>
        <LogoWordmark />
        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-2 backdrop-blur md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="btn btn-ghost btn-compact">Войти</Link>
          <Link href="/login" className="btn btn-solid btn-compact">Начать бесплатно</Link>
        </div>
      </header>

      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-10 text-center md:pt-16">
        <div className="entrance mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70" style={{ ['--d' as any]: '0.16s' }}>
          AI-репетитор нового поколения · 11 предметов
        </div>

        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          <span className="mask-line block">
            <span style={{ ['--d' as any]: '0.24s' }}>SPIRAI учит понимать,</span>
          </span>
          <span className="mask-line block">
            <span className="accent-word" style={{ ['--d' as any]: '0.34s' }}>
              а не просто решает
            </span>
          </span>
        </h1>

        <p className="entrance mt-6 max-w-xl text-base text-mutedText md:text-lg" style={{ ['--d' as any]: '0.5s' }}>
          Сфотографируй задание — SPIRAI объяснит ход мысли, задаст наводящие вопросы и подстроится под твой уровень.
          Математика, физика, русский, английский и ещё 7 предметов — в одном AI-репетиторе.
        </p>

        <div className="entrance mt-8 flex flex-col gap-3 sm:flex-row" style={{ ['--d' as any]: '0.66s' }}>
          <Link href="/login" className="btn btn-solid w-full sm:w-auto">Начать бесплатно</Link>
          <Link href="/login" className="btn btn-ghost w-full sm:w-auto">Продолжить без регистрации</Link>
        </div>

        <div className="entrance mt-14 grid grid-cols-3 gap-8 border-t border-white/10 pt-8 text-left" style={{ ['--d' as any]: '0.9s' }}>
          <Stat value="11" label="предметов школьной программы" />
          <Stat value="7" label="режимов обучения — от подсказки до разбора" />
          <Stat value="0₽" label="чтобы попробовать первое задание" />
        </div>
      </section>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(91,91,255,0.18),transparent_60%)]" />
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-xs text-mutedText">{label}</div>
    </div>
  );
}
