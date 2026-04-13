import React from "react";

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl focus-blue disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      "btn-shine bg-sky-500/20 hover:bg-sky-400/30 text-slate-900 border border-sky-400/50 shadow-sm shadow-black/40 hover:shadow-glow",
    secondary:
      "btn-shine btn-shine-outline bg-transparent border border-vanta-border hover:border-vanta-blue/60 text-vanta-text hover:text-vanta-blue hover:bg-vanta-blue-muted/40",
    ghost:
      "btn-shine btn-shine-outline bg-transparent hover:bg-vanta-blue-muted/50 text-vanta-muted hover:text-vanta-blue",
    danger:
      "bg-vanta-error/10 hover:bg-vanta-error/20 text-vanta-error border border-vanta-error/30 transition-all duration-200 hover:shadow-md hover:shadow-red-950/20 active:scale-[0.98]",
  };

  const sizes = {
    sm: "text-base px-4 py-2.5 gap-2 min-h-[2.75rem]",
    md: "text-base px-5 py-3 gap-2 min-h-[3rem]",
    lg: "text-lg px-7 py-3.5 gap-2.5 min-h-[3.25rem]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-vanta-surface border border-vanta-border rounded-2xl shadow-card
        ${hover ? "hover:shadow-card-hover hover:border-vanta-blue/35 transition-all duration-300 cursor-pointer hover:-translate-y-0.5 active:translate-y-0" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}

// --- Badge ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "red" | "gray";
  className?: string;
}

export function Badge({ children, variant = "blue", className = "" }: BadgeProps) {
  const variants = {
    blue: "bg-vanta-blue/15 text-vanta-blue border border-vanta-blue/30",
    green: "bg-vanta-success/15 text-vanta-success border border-vanta-success/30",
    red: "bg-vanta-error/15 text-vanta-error border border-vanta-error/30",
    gray: "bg-vanta-border/50 text-vanta-muted border border-vanta-border",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// --- ProgressBar ---
interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  showLabel?: boolean;
  color?: "blue" | "green";
}

export function ProgressBar({ value, className = "", showLabel, color = "blue" }: ProgressBarProps) {
  const fill = color === "green" ? "bg-vanta-success" : "bg-vanta-blue";
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-3 bg-vanta-border rounded-full overflow-hidden">
        <div
          className={`h-full ${fill} rounded-full fill-bar transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-vanta-muted w-12 text-right tabular-nums">{Math.round(value)}%</span>
      )}
    </div>
  );
}

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-base text-vanta-muted font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/60 rounded-xl px-4 py-3 text-base min-h-[3rem]
          border border-vanta-border focus:border-vanta-blue focus:outline-none transition-colors
          ${error ? "border-vanta-error" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-vanta-error">{error}</p>}
    </div>
  );
}

// --- Spinner ---
export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "w-5 h-5", md: "w-7 h-7", lg: "w-11 h-11" };
  return (
    <div className={`${sizes[size]} border-2 border-vanta-border border-t-vanta-blue rounded-full animate-spin ${className}`} />
  );
}

// --- Textarea ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-base text-vanta-muted font-medium">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full bg-vanta-surface-elevated text-vanta-text placeholder-vanta-muted/60 rounded-xl px-4 py-3 text-base
          border border-vanta-border focus:border-vanta-blue focus:outline-none transition-colors resize-none
          ${error ? "border-vanta-error" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-vanta-error">{error}</p>}
    </div>
  );
}
