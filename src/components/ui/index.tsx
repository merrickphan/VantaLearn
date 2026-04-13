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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-blue disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-vanta-blue hover:bg-vanta-blue-hover text-white",
    secondary: "bg-transparent border border-vanta-border hover:border-vanta-blue text-vanta-text hover:text-vanta-blue",
    ghost: "bg-transparent hover:bg-vanta-blue-muted text-vanta-muted hover:text-vanta-blue",
    danger: "bg-vanta-error/10 hover:bg-vanta-error/20 text-vanta-error border border-vanta-error/30",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-6 py-3 gap-2",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
      className={`bg-vanta-surface border border-vanta-border rounded-card shadow-card
        ${hover ? "hover:shadow-card-hover hover:border-vanta-blue/30 transition-all duration-200 cursor-pointer" : ""}
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
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
      <div className="flex-1 h-2 bg-vanta-border rounded-full overflow-hidden">
        <div
          className={`h-full ${fill} rounded-full fill-bar transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-vanta-muted w-10 text-right">{Math.round(value)}%</span>
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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm text-vanta-muted font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-vanta-border/60 text-vanta-text placeholder-vanta-muted/60 rounded-lg px-4 py-2.5 text-sm
          border border-transparent focus:border-vanta-blue focus:outline-none transition-colors
          ${error ? "border-vanta-error" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-vanta-error">{error}</p>}
    </div>
  );
}

// --- Spinner ---
export function Spinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm text-vanta-muted font-medium">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full bg-vanta-border/60 text-vanta-text placeholder-vanta-muted/60 rounded-lg px-4 py-2.5 text-sm
          border border-transparent focus:border-vanta-blue focus:outline-none transition-colors resize-none
          ${error ? "border-vanta-error" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-vanta-error">{error}</p>}
    </div>
  );
}
