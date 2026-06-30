import type { BodyType, FuelType, MustHave, PrimaryUse } from "@/lib/types";

export const BUDGET_OPTIONS = [
  { label: "Under ₹8L", min: 0, max: 8 },
  { label: "₹8L – ₹12L", min: 8, max: 12 },
  { label: "₹12L – ₹18L", min: 12, max: 18 },
  { label: "₹18L+", min: 18, max: 50 },
] as const;

export const BODY_TYPE_OPTIONS: { label: string; value: BodyType }[] = [
  { label: "Hatchback", value: "hatchback" },
  { label: "Sedan", value: "sedan" },
  { label: "SUV", value: "suv" },
  { label: "Compact SUV", value: "compact-suv" },
  { label: "MUV / MPV", value: "muv" },
];

export const PRIMARY_USE_OPTIONS: { label: string; value: PrimaryUse; description: string }[] = [
  { label: "City commute", value: "city", description: "Daily office runs and tight parking" },
  { label: "Highway drives", value: "highway", description: "Weekend getaways and long trips" },
  { label: "Family needs", value: "family", description: "Space, comfort, and safety first" },
  { label: "Off-road adventure", value: "offroad", description: "Rough roads and weekend trails" },
];

export const FUEL_OPTIONS: { label: string; value: FuelType | "any" }[] = [
  { label: "Petrol", value: "petrol" },
  { label: "Diesel", value: "diesel" },
  { label: "CNG", value: "cng" },
  { label: "Electric", value: "electric" },
  { label: "Hybrid", value: "hybrid" },
  { label: "No preference", value: "any" },
];

export const MUST_HAVE_OPTIONS: { label: string; value: MustHave; description: string }[] = [
  { label: "Safety", value: "safety", description: "Higher crash ratings and safety kit" },
  { label: "Mileage", value: "mileage", description: "Lower fuel bills matter most" },
  { label: "Space", value: "space", description: "More seats and cabin room" },
];

export const WEIGHT_LABELS: Record<string, string> = {
  budget: "Budget fit",
  bodyType: "Body type",
  useCase: "Use case",
  fuel: "Fuel type",
  mileage: "Mileage",
  safety: "Safety",
  space: "Space",
};
