export function ThinkingIndicator({ label = 'SPIRAI думает' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-secondaryText text-sm">
      <span className="thinking-pulse" />
      {label}
    </div>
  );
}
