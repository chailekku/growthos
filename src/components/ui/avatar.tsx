import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex shrink-0 overflow-hidden rounded-full bg-brand-100", sizeClasses[size], className)}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || ""} className="aspect-square h-full w-full object-cover" />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-semibold text-brand-600">
          {fallback?.slice(0, 2).toUpperCase() || "?"}
        </span>
      )}
    </div>
  )
);
Avatar.displayName = "Avatar";

export { Avatar };
