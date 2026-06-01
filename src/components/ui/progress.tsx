import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, indicatorClassName, ...props }, ref) => (
    <div ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-100", className)} {...props}>
      <div
        className={cn("h-full bg-brand-500 transition-all duration-500 rounded-full", indicatorClassName)}
        style={{ width: `${Math.min(Math.max((value / max) * 100, 0), 100)}%` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };
