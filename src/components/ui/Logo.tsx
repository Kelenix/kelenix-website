interface LogoProps {
  size?: string;
  className?: string;
}

export default function Logo({ size = "text-xl", className = "" }: LogoProps) {
  return (
    <span className={`font-heading font-extrabold tracking-tight leading-none ${size} ${className}`}>
      <span style={{ color: "#2FA8FF" }}>Kel</span>
      <span style={{ color: "#FFC107" }}>enix</span>
    </span>
  );
}
