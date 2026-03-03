interface ShapeProps {
  className?: string;
}

export function RoundShape({ className = "w-12 h-16" }: ShapeProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="20" y="44" width="8" height="16" rx="3" fill="currentColor" opacity="0.6" />
      <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="18" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="18" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="18" cy="24" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="24" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="18" cy="30" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="30" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="30" r="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function TeardropShape({ className = "w-12 h-16" }: ShapeProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="20" y="46" width="8" height="14" rx="3" fill="currentColor" opacity="0.6" />
      <ellipse cx="24" cy="24" rx="17" ry="22" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.08" />
      <circle cx="18" cy="16" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="16" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="16" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="18" cy="24" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="24" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="21" cy="32" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="27" cy="32" r="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function DiamondShape({ className = "w-12 h-16" }: ShapeProps) {
  return (
    <svg viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="20" y="48" width="8" height="12" rx="3" fill="currentColor" opacity="0.6" />
      <path
        d="M24 2 C36 8, 42 18, 42 28 C42 38, 36 46, 24 48 C12 46, 6 38, 6 28 C6 18, 12 8, 24 2Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="16" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="18" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="18" cy="26" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="30" cy="26" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="21" cy="34" r="1.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="27" cy="34" r="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}
