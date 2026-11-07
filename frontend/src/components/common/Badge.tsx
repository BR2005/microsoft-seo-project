import React from "react";

export type BadgeVariant = 
  | "live" 
  | "demo" 
  | "configured" 
  | "error" 
  | "critical" 
  | "high" 
  | "medium" 
  | "low" 
  | "improved" 
  | "declined" 
  | "inconclusive" 
  | "pending" 
  | "approved" 
  | "proposed" 
  | "neutral"
  | "cyan"
  | "purple";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  size?: "sm" | "md";
  showDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  size = "md",
  showDot = true,
  className = "",
}) => {
  const styles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    live: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    demo: {
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      border: "border-amber-500/20",
      dot: "bg-amber-400",
    },
    configured: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
      dot: "bg-cyan-400",
    },
    error: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
      dot: "bg-rose-400",
    },
    critical: {
      bg: "bg-rose-500/15",
      text: "text-rose-400",
      border: "border-rose-500/30",
      dot: "bg-rose-500 animate-pulse",
    },
    high: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      dot: "bg-orange-400",
    },
    medium: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      dot: "bg-amber-400",
    },
    low: {
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      border: "border-slate-500/20",
      dot: "bg-slate-400",
    },
    improved: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    declined: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
      dot: "bg-rose-400",
    },
    inconclusive: {
      bg: "bg-zinc-500/10",
      text: "text-zinc-400",
      border: "border-zinc-500/20",
      dot: "bg-zinc-400",
    },
    pending: {
      bg: "bg-sky-500/10",
      text: "text-sky-400",
      border: "border-sky-500/20",
      dot: "bg-sky-400 animate-pulse",
    },
    approved: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    proposed: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      dot: "bg-purple-400",
    },
    neutral: {
      bg: "bg-slate-800/60",
      text: "text-slate-300",
      border: "border-slate-700/50",
      dot: "bg-slate-400",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-300",
      border: "border-cyan-500/30",
      dot: "bg-cyan-400",
    },
    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-300",
      border: "border-purple-500/30",
      dot: "bg-purple-400",
    },
  };

  const current = styles[variant] || styles.neutral;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />}
      {children}
    </span>
  );
};
