import React from "react";
import { LucideIcon, Layers } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Layers,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-white/10 bg-[#0b0f19]/40 my-4">
      <div className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 mb-4 shadow-inner">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-sm transition-all duration-150 border border-cyan-400/20"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

