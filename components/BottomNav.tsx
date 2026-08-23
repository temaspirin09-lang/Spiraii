'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/app', label: 'Главная', icon: '🏠' },
  { href: '/app/subjects', label: 'Учёба', icon: '📚' },
  { href: '/app/task', label: '', icon: '📸', fab: true },
  { href: '/app/progress', label: 'Прогресс', icon: '📈' },
  { href: '/app/profile', label: 'Профиль', icon: '👤' }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-end justify-between px-4 pb-[max(8px,env(safe-area-inset-bottom))] pt-2">
        {items.map((item) =>
          item.fab ? (
            <Link
              key={item.href}
              href={item.href}
              className="btn btn-accent -mt-6 h-16 w-16 rounded-full !p-0 text-2xl shadow-lg"
              aria-label="Решить задание"
            >
              {item.icon}
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[44px] flex-col items-center gap-1 px-2 py-1 text-xs ${
                pathname === item.href ? 'text-accent' : 'text-secondaryText'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
