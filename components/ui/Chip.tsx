'use client';

export function Chip({
  label,
  active,
  onClick
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="chip" data-active={active ? 'true' : 'false'} onClick={onClick}>
      {label}
    </button>
  );
}
