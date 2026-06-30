"use client";

import { Slider } from "@/components/ui/slider";
import { WEIGHT_LABELS } from "@/lib/constants";
import type { Weights } from "@/lib/types";

interface WeightSlidersProps {
  weights: Weights;
  onChange: (weights: Weights) => void;
}

const weightKeys = Object.keys(WEIGHT_LABELS) as (keyof Weights)[];

export function WeightSliders({ weights, onChange }: WeightSlidersProps) {
  const handleChange = (key: keyof Weights, value: number[]) => {
    onChange({ ...weights, [key]: value[0] });
  };

  return (
    <div className="space-y-5 rounded-xl border border-border/60 bg-card/60 p-5">
      <div>
        <h3 className="text-lg font-semibold">Tune your priorities</h3>
        <p className="text-sm text-muted-foreground">
          Drag sliders to instantly re-rank — the scoring engine recalculates in real time.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {weightKeys.map((key) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{WEIGHT_LABELS[key]}</span>
              <span className="font-medium text-primary">{weights[key]}%</span>
            </div>
            <Slider
              value={[weights[key]]}
              min={0}
              max={50}
              step={1}
              onValueChange={(value) => handleChange(key, value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
