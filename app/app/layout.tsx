import { BottomNav } from '@/components/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black pb-24 text-white">
      <div className="mx-auto max-w-md px-5 pt-6">{children}</div>
      <BottomNav />
    </div>
  );
}
