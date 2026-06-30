"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPriceLakhs } from "@/lib/utils";
import type { RankedCar } from "@/lib/types";
import { Star } from "lucide-react";

interface ShortlistCardProps {
  ranked: RankedCar;
  rank: number;
}

export function ShortlistCard({ ranked, rank }: ShortlistCardProps) {
  const { car, totalScore, whyThisFits } = ranked;

  return (
    <Card className="overflow-hidden border-border/60 bg-card/90 transition-all duration-200 hover:border-primary/40">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">#{rank}</Badge>
            <Badge variant="outline">{totalScore}% match</Badge>
          </div>
          <CardTitle className="text-xl">
            {car.make} {car.model}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{car.variant}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-primary">{formatPriceLakhs(car.priceLakhs)}</p>
          <p className="text-xs capitalize text-muted-foreground">{car.bodyType.replace("-", " ")}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-accent">{whyThisFits}</p>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="capitalize">{car.fuelType}</span>
          <span>•</span>
          <span>{car.fuelType === "electric" ? "EV" : `${car.mileageKmpl} kmpl`}</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {car.safetyRating}/5 safety
          </span>
          <span>•</span>
          <span>{car.seatingCapacity} seats</span>
        </div>
      </CardContent>
    </Card>
  );
}
