"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { OptionChip, QuestionCard } from "@/components/questionnaire/QuestionCard";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import {
  BODY_TYPE_OPTIONS,
  BUDGET_OPTIONS,
  FUEL_OPTIONS,
  MUST_HAVE_OPTIONS,
  PRIMARY_USE_OPTIONS,
} from "@/lib/constants";
import type { BodyType, FuelType, MustHave, PrimaryUse, UserPreferences } from "@/lib/types";

const TOTAL_STEPS = 6;

interface QuestionnaireFlowProps {
  initialPreferences?: Partial<UserPreferences>;
  onComplete: (preferences: UserPreferences) => void;
}

export function QuestionnaireFlow({ initialPreferences, onComplete }: QuestionnaireFlowProps) {
  const [step, setStep] = useState(0);
  const [budgetIndex, setBudgetIndex] = useState<number | null>(() => {
    if (initialPreferences?.budgetMin !== undefined && initialPreferences?.budgetMax !== undefined) {
      return BUDGET_OPTIONS.findIndex(
        (b) => b.min === initialPreferences.budgetMin && b.max === initialPreferences.budgetMax
      );
    }
    return null;
  });
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>(initialPreferences?.bodyTypes ?? []);
  const [primaryUse, setPrimaryUse] = useState<PrimaryUse | null>(
    initialPreferences?.primaryUse ?? null
  );
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>(initialPreferences?.fuelTypes ?? []);
  const [noFuelPreference, setNoFuelPreference] = useState(
    (initialPreferences?.fuelTypes?.length ?? 0) === 0
  );
  const [mustHaves, setMustHaves] = useState<MustHave[]>(initialPreferences?.mustHaves ?? []);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return budgetIndex !== null;
      case 1:
        return bodyTypes.length > 0;
      case 2:
        return primaryUse !== null;
      case 3:
        return noFuelPreference || fuelTypes.length > 0;
      case 4:
        return true;
      case 5:
        return budgetIndex !== null && bodyTypes.length > 0 && primaryUse !== null;
      default:
        return false;
    }
  }, [step, budgetIndex, bodyTypes, primaryUse, fuelTypes, noFuelPreference]);

  const preferences = useMemo((): UserPreferences | null => {
    if (budgetIndex === null || !primaryUse || bodyTypes.length === 0) return null;
    const budget = BUDGET_OPTIONS[budgetIndex];
    return {
      budgetMin: budget.min,
      budgetMax: budget.max,
      bodyTypes,
      primaryUse,
      fuelTypes: noFuelPreference ? [] : fuelTypes,
      mustHaves,
    };
  }, [budgetIndex, bodyTypes, primaryUse, fuelTypes, noFuelPreference, mustHaves]);

  const toggleBodyType = (value: BodyType) => {
    setBodyTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleFuel = (value: FuelType) => {
    setNoFuelPreference(false);
    setFuelTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleMustHave = (value: MustHave) => {
    setMustHaves((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (preferences) onComplete(preferences);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <ProgressBar current={step + 1} total={TOTAL_STEPS} />

      {step === 0 && (
        <QuestionCard
          title="What's your budget?"
          description="Pick a range that feels comfortable — we'll prioritize cars that fit."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {BUDGET_OPTIONS.map((option, index) => (
              <OptionChip
                key={option.label}
                label={option.label}
                selected={budgetIndex === index}
                onClick={() => setBudgetIndex(index)}
              />
            ))}
          </div>
        </QuestionCard>
      )}

      {step === 1 && (
        <QuestionCard
          title="Which body styles do you like?"
          description="Select all that apply — we'll only show matching shapes."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {BODY_TYPE_OPTIONS.map((option) => (
              <OptionChip
                key={option.value}
                label={option.label}
                selected={bodyTypes.includes(option.value)}
                onClick={() => toggleBodyType(option.value)}
              />
            ))}
          </div>
        </QuestionCard>
      )}

      {step === 2 && (
        <QuestionCard
          title="How will you mostly use the car?"
          description="This helps us weigh mileage, space, and capability differently."
        >
          <div className="grid gap-3">
            {PRIMARY_USE_OPTIONS.map((option) => (
              <OptionChip
                key={option.value}
                label={option.label}
                description={option.description}
                selected={primaryUse === option.value}
                onClick={() => setPrimaryUse(option.value)}
              />
            ))}
          </div>
        </QuestionCard>
      )}

      {step === 3 && (
        <QuestionCard
          title="Any fuel preference?"
          description="Choose one or more, or skip if you're open to anything."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {FUEL_OPTIONS.map((option) => (
              <OptionChip
                key={option.label}
                label={option.label}
                selected={
                  option.value === "any"
                    ? noFuelPreference
                    : fuelTypes.includes(option.value as FuelType)
                }
                onClick={() => {
                  if (option.value === "any") {
                    setNoFuelPreference(true);
                    setFuelTypes([]);
                  } else {
                    toggleFuel(option.value as FuelType);
                  }
                }}
              />
            ))}
          </div>
        </QuestionCard>
      )}

      {step === 4 && (
        <QuestionCard
          title="What matters most to you?"
          description="Optional — these boost scoring weight for your top priorities."
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {MUST_HAVE_OPTIONS.map((option) => (
              <OptionChip
                key={option.value}
                label={option.label}
                description={option.description}
                selected={mustHaves.includes(option.value)}
                onClick={() => toggleMustHave(option.value)}
              />
            ))}
          </div>
        </QuestionCard>
      )}

      {step === 5 && preferences && (
        <QuestionCard title="Ready to find your match?" description="Review your choices and we'll rank 50 real Indian-market cars for you.">
          <div className="space-y-3 rounded-xl bg-secondary/40 p-4 text-sm">
            <p><span className="text-muted-foreground">Budget:</span> {BUDGET_OPTIONS[budgetIndex!].label}</p>
            <p><span className="text-muted-foreground">Body types:</span> {bodyTypes.join(", ")}</p>
            <p><span className="text-muted-foreground">Primary use:</span> {primaryUse}</p>
            <p><span className="text-muted-foreground">Fuel:</span> {noFuelPreference ? "No preference" : fuelTypes.join(", ")}</p>
            <p><span className="text-muted-foreground">Must-haves:</span> {mustHaves.length ? mustHaves.join(", ") : "None selected"}</p>
          </div>
        </QuestionCard>
      )}

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed} size="lg">
          {step === TOTAL_STEPS - 1 ? "Find My Cars" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
