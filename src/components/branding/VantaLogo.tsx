import type { SVGProps } from "react";
import { useId } from "react";

type VantaLogoProps = SVGProps<SVGSVGElement> & {
  size?: number;
  /** `command` = electric cyan on dark UI (default). `ink` = dark fill for light backgrounds. */
  variant?: "command" | "ink";
};

export function VantaLogo({ size = 32, className, variant = "command", ...props }: VantaLogoProps) {
  const uid = useId().replace(/:/g, "");
  const id = `vanta-logo-grad-${uid}`;

  if (variant === "ink") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
        {...props}
      >
        <defs>
          <linearGradient id={id} x1="6" y1="28" x2="26" y2="4" gradientUnits="userSpaceOnUse">
            <stop stopColor="#334155" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
        </defs>
        <path d="M16 3L29 27H3L16 3Z" stroke="#0f172a" strokeWidth={1.75} strokeLinejoin="round" />
        <path d="M16 11.5L23.2 25H8.8L16 11.5Z" fill={`url(#${id})`} />
        <path d="M11 26.5H21" stroke="#0f172a" strokeWidth={1.5} strokeLinecap="round" opacity={0.85} />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id={`${id}-c`} x1="6" y1="28" x2="26" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path
        d="M16 3L29 27H3L16 3Z"
        stroke="#38bdf8"
        strokeWidth={1.75}
        strokeLinejoin="round"
        opacity={0.9}
      />
      <path d="M16 11.5L23.2 25H8.8L16 11.5Z" fill={`url(#${id}-c)`} />
      <path d="M11 26.5H21" stroke="#bae6fd" strokeWidth={1.5} strokeLinecap="round" opacity={0.85} />
    </svg>
  );
}
