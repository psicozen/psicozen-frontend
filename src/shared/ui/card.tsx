import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function Card({
  className,
  children,
  hoverEffect = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6",
        hoverEffect && "glass-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
