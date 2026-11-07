import React from "react";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Badge } from "./Badge";

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    label?: string;
    isPositiveGood?: boolean;
  };
  icon?: React.ReactNode;
  subtitle?: string;
  isDemo?: boolean;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  delta,
  icon,
  subtitle,
  isDemo = false,
  highlight = false,
}) => {
  const isPositive = delta ? delta.value > 0 : false;
  const isNeutral = delta ? delta.value === 0 : true;
  const isGood = delta
    ? delta.isPositiveGood !== undefined
      ? delta.isPositiveGood ? isPositive : !isPositive
      : isPositive
    : true;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-200 ${
        highlight
          ? "bg-slate-900/80 border-cyan-500/30 shadow-lg shadow-cyan-500/5"
          : "bg-[#0b0f19]/70 border-white/[0.07] hover:border-white/[0.12] hover:bg-[#0d1322]/80"
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-medium tracking-wide text-slate-400 uppercase">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {isDemo && (
            <Badge variant="demo" size="sm" showDot={false}>
              Demo Data
            </Badge>
          )}
          {icon && <div className="text-slate-400">{icon}</div>}
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-mono">
          {value}
        </span>

        {delta && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${
              isNeutral
                ? "text-slate-400"
                : isGood
                ? "text-emerald-400"
                : "text-rose-400"
            }`}
          >
            {isNeutral ? (
              <Minus className="w-3.5 h-3.5" />
            ) : isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {delta.value > 0 ? `+${delta.value}%` : `${delta.value}%`}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 truncate">
          <Info className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">{subtitle}</span>
        </p>
      )}

      {/* Subtle top border accent highlight */}
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400" />
      )}
    </div>
  );
};

