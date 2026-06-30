"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ComparisonTable } from "@/components/results/ComparisonTable";
import { ShortlistCard } from "@/components/results/ShortlistCard";
import { WeightSliders } from "@/components/results/WeightSliders";
import { rankCars } from "@/lib/rank";
import type { RankedCar, UserPreferences, Weights } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface ResultsViewProps {
  preferences: UserPreferences;
  onEditPreferences: () => void;
}

export function ResultsView({ preferences, onEditPreferences }: ResultsViewProps) {
  const [results, setResults] = useState<RankedCar[]>([]);
  const [weights, setWeights] = useState<Weights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialRank() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/rank", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preferences, limit: 5 }),
        });

        if (!response.ok) {
          throw new Error("Ranking failed");
        }

        const data = await response.json();
        if (!cancelled) {
          setResults(data.results);
          setWeights(data.defaultWeights);
        }
      } catch {
        if (!cancelled) {
          setError("Something went wrong while ranking cars. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchInitialRank();
    return () => {
      cancelled = true;
    };
  }, [preferences]);

  useEffect(() => {
    if (!weights || loading) return;
    const { results: reranked } = rankCars(preferences, weights, 5);
    setResults(reranked);
  }, [weights, preferences, loading]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Scoring 50 cars against your preferences…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-center">
        <p className="mb-4">{error}</p>
        <Button onClick={onEditPreferences}>Edit preferences</Button>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/60 p-6 text-center">
        <p className="mb-2 font-medium">No strong matches found</p>
        <p className="mb-4 text-sm text-muted-foreground">
          Try widening your budget or selecting more body types.
        </p>
        <Button onClick={onEditPreferences}>Edit preferences</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">Your shortlist</h2>
          <p className="text-muted-foreground">
            Top {results.length} cars ranked by our transparent scoring engine.
          </p>
        </div>
        <Button variant="outline" onClick={onEditPreferences}>
          Edit preferences
        </Button>
      </div>

      {weights ? <WeightSliders weights={weights} onChange={setWeights} /> : null}

      <div className="grid gap-4">
        {results.map((ranked, index) => (
          <ShortlistCard key={ranked.car.id} ranked={ranked} rank={index + 1} />
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold">Compare top 3</h3>
        <ComparisonTable results={results} />
      </div>
    </div>
  );
}
