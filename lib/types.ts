export type BodyType = "hatchback" | "sedan" | "suv" | "muv" | "compact-suv";
export type FuelType = "petrol" | "diesel" | "cng" | "electric" | "hybrid";
export type PrimaryUse = "city" | "highway" | "family" | "offroad";
export type MustHave = "safety" | "mileage" | "space";

export interface Car {
  id: string;
  make: string;
  model: string;
  variant: string;
  priceLakhs: number;
  bodyType: BodyType;
  fuelType: FuelType;
  mileageKmpl: number;
  seatingCapacity: number;
  safetyRating: number;
  primaryUseTags: PrimaryUse[];
  highlights: string[];
}

export interface UserPreferences {
  budgetMin: number;
  budgetMax: number;
  bodyTypes: BodyType[];
  primaryUse: PrimaryUse;
  fuelTypes: FuelType[];
  mustHaves: MustHave[];
}

export interface Weights {
  budget: number;
  bodyType: number;
  useCase: number;
  fuel: number;
  mileage: number;
  safety: number;
  space: number;
}

export interface ScoreBreakdown {
  budget: number;
  bodyType: number;
  useCase: number;
  fuel: number;
  mileage: number;
  safety: number;
  space: number;
}

export interface RankedCar {
  car: Car;
  totalScore: number;
  breakdown: ScoreBreakdown;
  whyThisFits: string;
}

export interface RankRequest {
  preferences: UserPreferences;
  weights?: Weights;
  limit?: number;
}

export interface RankResponse {
  results: RankedCar[];
  defaultWeights: Weights;
}
