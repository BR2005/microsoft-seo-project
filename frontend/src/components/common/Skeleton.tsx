import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "h-4 w-full" }) => {
  return (
    <div
      className={`animate-pulse rounded bg-slate-800/60 ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0b0f19]/70 p-5 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12 rounded-full" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-44" />
    </div>
  );
};

