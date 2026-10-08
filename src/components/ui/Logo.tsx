interface LogoProps {
  size?: string;
  className?: string;
  /** "dark" : sur fond sombre (admin). "light" : sur fond clair, avec le symbole K. */
  tone?: "dark" | "light";
}

// Symbole K : fût bleu, bras or, jambe bleu profond (reprise simplifiée du logo).
function Mark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-[1.15em] w-[1.15em] shrink-0">
      <defs>
        <linearGradient id="kelenix-stem" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2FA8FF" />
          <stop offset="1" stopColor="#0F6FE6" />
        </linearGradient>
      </defs>
      <rect x="4" y="3" width="9" height="26" rx="3.5" fill="url(#kelenix-stem)" />
      <path d="M15.6 15.8 24.4 4.2h4.4L18.4 17.9Z" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16.6 19.4 19.7 16l8.2 11.8h-4.6Z" fill="#0F6FE6" stroke="#0F6FE6" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ size = "text-xl", className = "", tone = "dark" }: LogoProps) {
  if (tone === "light") {
    return (
      <span className={`inline-flex items-center gap-2 font-heading font-bold tracking-tight leading-none text-navy ${size} ${className}`}>
        <Mark />
        <span>
          Kelenix<span className="ml-1 font-medium text-muted">Tech</span>
        </span>
      </span>
    );
  }
  return (
    <span className={`font-heading font-extrabold tracking-tight leading-none ${size} ${className}`}>
      <span style={{ color: "#2FA8FF" }}>Kel</span>
      <span style={{ color: "#FFC107" }}>enix</span>
      <span className="ml-1.5" style={{ color: "#CBD5E1", fontWeight: 600 }}>Tech</span>
    </span>
  );
}
