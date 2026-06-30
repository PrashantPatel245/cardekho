"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function QuestionCard({ title, description, children, className }: QuestionCardProps) {
  return (
    <Card className={cn("border-border/60 bg-card/80 backdrop-blur transition-all duration-300", className)}>
      <CardHeader>
        <CardTitle className="text-balance text-2xl md:text-3xl">{title}</CardTitle>
        {description ? <CardDescription className="text-base">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface OptionChipProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionChip({ label, description, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-xl border px-4 py-3 text-left transition-all duration-200 hover:border-primary/60 hover:bg-secondary/60",
        selected
          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
          : "border-border bg-secondary/30"
      )}
    >
      <div className="font-medium">{label}</div>
      {description ? <div className="mt-1 text-sm text-muted-foreground">{description}</div> : null}
    </button>
  );
}
