import React from "react";

interface ScoreGaugeProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  subScores?: { name: string; score: number }[];
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label = "SEO Health Score",
  size = "md",
  subScores,
}) => {
  const radius = size === "lg" ? 54 : size === "md" ? 44 : 32;
  const stroke = size === "lg" ? 8 : size === "md" ? 6 : 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 90) return { stroke: "#10b981", text: "text-emerald-400", badge: "Optimal" };
    if (s >= 75) return { stroke: "#06b6d4", text: "text-cyan-400", badge: "Good" };
    if (s >= 50) return { stroke: "#f59e0b", text: "text-amber-400", badge: "Needs Work" };
    return { stroke: "#f43f5e", text: "text-rose-400", badge: "Critical" };
  };

  const status = getColor(score);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-900/40 border border-white/[0.07]">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90 drop-shadow-md"
        >
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={status.stroke}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 0.8s ease-in-out" }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-bold ${size === "lg" ? "text-3xl" : "text-2xl"} ${status.text}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">/100</span>
        </div>
      </div>

      <div className="flex-1 w-full text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-between mb-1">
          <h4 className="text-sm font-semibold text-white">{label}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.text} bg-white/[0.04] border border-white/[0.06]`}>
            {status.badge}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Evaluated against 42 automated technical benchmarks & Google search guidelines.
        </p>

        {subScores && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {subScores.map((item) => (
              <div key={item.name} className="flex justify-between items-center bg-slate-950/50 px-2.5 py-1.5 rounded-md border border-white/[0.04]">
                <span className="text-slate-400 truncate text-[11px]">{item.name}</span>
                <span className="font-mono font-semibold text-slate-200 text-[11px]">{item.score}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

