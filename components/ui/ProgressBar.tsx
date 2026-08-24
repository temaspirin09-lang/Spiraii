export function ProgressBar({ percent, success }: { percent: number; success?: boolean }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className="progress-track">
      <div className="progress-fill" data-success={success ? 'true' : 'false'} style={{ width: `${clamped}%` }} />
    </div>
  );
}
