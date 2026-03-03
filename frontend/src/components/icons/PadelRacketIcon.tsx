interface Props {
  className?: string;
}

export default function PadelRacketIcon({ className = "w-16 h-16" }: Props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Handle */}
      <rect
        x="28"
        y="42"
        width="8"
        height="18"
        rx="3"
        fill="currentColor"
        opacity="0.7"
      />
      {/* Handle grip lines */}
      <line x1="30" y1="48" x2="34" y2="48" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="30" y1="51" x2="34" y2="51" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="30" y1="54" x2="34" y2="54" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      {/* Racket head outline */}
      <ellipse
        cx="32"
        cy="22"
        rx="18"
        ry="20"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {/* Holes pattern */}
      <circle cx="24" cy="14" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="32" cy="14" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="40" cy="14" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="24" cy="22" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="32" cy="22" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="40" cy="22" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="28" cy="30" r="2" fill="currentColor" fillOpacity="0.25" />
      <circle cx="36" cy="30" r="2" fill="currentColor" fillOpacity="0.25" />
    </svg>
  );
}
