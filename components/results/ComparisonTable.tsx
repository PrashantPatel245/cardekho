import { formatPriceLakhs } from "@/lib/utils";
import type { RankedCar } from "@/lib/types";

interface ComparisonTableProps {
  results: RankedCar[];
}

export function ComparisonTable({ results }: ComparisonTableProps) {
  const topThree = results.slice(0, 3);

  if (topThree.length === 0) return null;

  const rows = [
    {
      label: "Price",
      values: topThree.map((r) => formatPriceLakhs(r.car.priceLakhs)),
    },
    {
      label: "Body type",
      values: topThree.map((r) => r.car.bodyType.replace("-", " ")),
    },
    {
      label: "Fuel",
      values: topThree.map((r) => r.car.fuelType),
    },
    {
      label: "Mileage",
      values: topThree.map((r) =>
        r.car.fuelType === "electric" ? "Electric" : `${r.car.mileageKmpl} kmpl`
      ),
    },
    {
      label: "Safety",
      values: topThree.map((r) => `${r.car.safetyRating}/5`),
    },
    {
      label: "Seating",
      values: topThree.map((r) => `${r.car.seatingCapacity} seats`),
    },
    {
      label: "Match score",
      values: topThree.map((r) => `${r.totalScore}%`),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Spec</th>
            {topThree.map((r, i) => (
              <th key={r.car.id} className="px-4 py-3 text-left font-semibold">
                #{i + 1} {r.car.make} {r.car.model}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border/60 last:border-0">
              <td className="px-4 py-3 font-medium text-muted-foreground">{row.label}</td>
              {row.values.map((value, i) => (
                <td key={`${row.label}-${i}`} className="px-4 py-3 capitalize">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
