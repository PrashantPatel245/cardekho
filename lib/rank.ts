import { cars, maxMileage, maxSeating } from "@/lib/data/cars";
import type {
  Car,
  MustHave,
  RankedCar,
  ScoreBreakdown,
  UserPreferences,
  Weights,
} from "@/lib/types";

export const DEFAULT_WEIGHTS: Weights = {
  budget: 25,
  bodyType: 20,
  useCase: 15,
  fuel: 10,
  mileage: 15,
  safety: 10,
  space: 5,
};

function scoreBudget(car: Car, prefs: UserPreferences): number {
  const { priceLakhs } = car;
  const { budgetMin, budgetMax } = prefs;

  if (priceLakhs >= budgetMin && priceLakhs <= budgetMax) {
    return 100;
  }

  if (priceLakhs < budgetMin) {
    const gap = budgetMin - priceLakhs;
    return Math.max(40, 100 - gap * 8);
  }

  const overBy = priceLakhs - budgetMax;
  return Math.max(0, 100 - overBy * 12);
}

function scoreBodyType(car: Car, prefs: UserPreferences): number {
  if (prefs.bodyTypes.length === 0) return 70;
  return prefs.bodyTypes.includes(car.bodyType) ? 100 : 0;
}

function scoreUseCase(car: Car, prefs: UserPreferences): number {
  if (car.primaryUseTags.includes(prefs.primaryUse)) {
    return 100;
  }

  const familyPartialTypes = ["suv", "muv", "compact-suv"];
  if (prefs.primaryUse === "family" && familyPartialTypes.includes(car.bodyType)) {
    return 55;
  }

  if (prefs.primaryUse === "offroad" && car.bodyType === "suv") {
    return 50;
  }

  if (prefs.primaryUse === "highway" && (car.bodyType === "sedan" || car.fuelType === "diesel")) {
    return 45;
  }

  return 20;
}

function scoreFuel(car: Car, prefs: UserPreferences): number {
  if (prefs.fuelTypes.length === 0) return 70;
  return prefs.fuelTypes.includes(car.fuelType) ? 100 : 25;
}

function scoreMileage(car: Car): number {
  if (car.fuelType === "electric") {
    return 85;
  }
  if (car.mileageKmpl <= 0) return 50;
  return Math.round((car.mileageKmpl / maxMileage) * 100);
}

function scoreSafety(car: Car): number {
  return Math.round((car.safetyRating / 5) * 100);
}

function scoreSpace(car: Car): number {
  return Math.round((car.seatingCapacity / maxSeating) * 100);
}

function applyMustHaveBoosts(weights: Weights, mustHaves: MustHave[]): Weights {
  const boosted = { ...weights };

  if (mustHaves.includes("safety")) boosted.safety += 10;
  if (mustHaves.includes("mileage")) boosted.mileage += 10;
  if (mustHaves.includes("space")) boosted.space += 10;

  const total =
    boosted.budget +
    boosted.bodyType +
    boosted.useCase +
    boosted.fuel +
    boosted.mileage +
    boosted.safety +
    boosted.space;

  return {
    budget: Math.round((boosted.budget / total) * 100),
    bodyType: Math.round((boosted.bodyType / total) * 100),
    useCase: Math.round((boosted.useCase / total) * 100),
    fuel: Math.round((boosted.fuel / total) * 100),
    mileage: Math.round((boosted.mileage / total) * 100),
    safety: Math.round((boosted.safety / total) * 100),
    space: Math.round((boosted.space / total) * 100),
  };
}

export function resolveWeights(preferences: UserPreferences, weights?: Weights): Weights {
  const base = weights ?? DEFAULT_WEIGHTS;
  return applyMustHaveBoosts(base, preferences.mustHaves);
}

function computeBreakdown(car: Car, prefs: UserPreferences): ScoreBreakdown {
  return {
    budget: scoreBudget(car, prefs),
    bodyType: scoreBodyType(car, prefs),
    useCase: scoreUseCase(car, prefs),
    fuel: scoreFuel(car, prefs),
    mileage: scoreMileage(car),
    safety: scoreSafety(car),
    space: scoreSpace(car),
  };
}

function weightedTotal(breakdown: ScoreBreakdown, weights: Weights): number {
  const sum =
    breakdown.budget * weights.budget +
    breakdown.bodyType * weights.bodyType +
    breakdown.useCase * weights.useCase +
    breakdown.fuel * weights.fuel +
    breakdown.mileage * weights.mileage +
    breakdown.safety * weights.safety +
    breakdown.space * weights.space;

  return Math.round(sum / 100);
}

const dimensionLabels: Record<keyof ScoreBreakdown, (car: Car) => string> = {
  budget: (car) => `fits your budget at ₹${car.priceLakhs.toFixed(2)}L`,
  bodyType: (car) => `matches your preferred ${car.bodyType.replace("-", " ")} body style`,
  useCase: () => "aligns with how you plan to use the car",
  fuel: (car) => `offers your preferred ${car.fuelType} powertrain`,
  mileage: (car) =>
    car.fuelType === "electric"
      ? "delivers zero-emission city driving"
      : `delivers strong mileage at ${car.mileageKmpl} kmpl`,
  safety: (car) => `scores ${car.safetyRating}/5 on safety`,
  space: (car) => `seats ${car.seatingCapacity} comfortably`,
};

export function explain(
  breakdown: ScoreBreakdown,
  car: Car,
  prefs: UserPreferences
): string {
  const entries = (Object.keys(breakdown) as (keyof ScoreBreakdown)[])
    .map((key) => ({ key, score: breakdown[key] }))
    .sort((a, b) => b.score - a.score);

  const top = entries.slice(0, 2);
  const reasons = top.map(({ key }) => dimensionLabels[key](car));

  const useLabel =
    prefs.primaryUse === "city"
      ? "city commute"
      : prefs.primaryUse === "highway"
        ? "highway drives"
        : prefs.primaryUse === "family"
          ? "family needs"
          : "adventure driving";

  return `${car.make} ${car.model}: ${reasons.join(" and ")} — ideal for your ${useLabel}.`;
}

export function rankCars(
  preferences: UserPreferences,
  weights?: Weights,
  limit = 5
): { results: RankedCar[]; defaultWeights: Weights } {
  const resolvedWeights = resolveWeights(preferences, weights);

  const results = cars
    .map((car) => {
      const breakdown = computeBreakdown(car, preferences);
      const totalScore = weightedTotal(breakdown, resolvedWeights);
      return {
        car,
        totalScore,
        breakdown,
        whyThisFits: explain(breakdown, car, preferences),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit);

  return { results, defaultWeights: resolvedWeights };
}

export function isValidPreferences(value: unknown): value is UserPreferences {
  if (!value || typeof value !== "object") return false;
  const prefs = value as UserPreferences;
  return (
    typeof prefs.budgetMin === "number" &&
    typeof prefs.budgetMax === "number" &&
    Array.isArray(prefs.bodyTypes) &&
    typeof prefs.primaryUse === "string" &&
    Array.isArray(prefs.fuelTypes) &&
    Array.isArray(prefs.mustHaves)
  );
}
