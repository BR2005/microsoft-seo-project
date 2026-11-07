import React from "react";
import { ChevronRight } from "lucide-react";

interface HeaderProps {
  breadcrumbs: string[];
  title: string;
  description?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbs,
  title,
  description,
  badge,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
      <div className="space-y-1">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb}>
              {index > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
              <span className={index === breadcrumbs.length - 1 ? "text-cyan-400 font-semibold" : ""}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            {title}
          </h1>
          {badge}
        </div>

        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Action buttons slot */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
          {actions}
        </div>
      )}
    </div>
  );
};

