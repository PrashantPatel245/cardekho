"use client";

import { useState } from "react";
import { QuestionnaireFlow } from "@/components/questionnaire/QuestionnaireFlow";
import { ResultsView } from "@/components/results/ResultsView";
import type { UserPreferences } from "@/lib/types";
import { Car } from "lucide-react";

type Phase = "quiz" | "results";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("quiz");
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const handleComplete = (prefs: UserPreferences) => {
    setPreferences(prefs);
    setPhase("results");
  };

  const handleEditPreferences = () => {
    setPhase("quiz");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <header className="mb-10 text-center md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Car className="h-4 w-4" />
            Find My Car
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-5xl">
            From confused to confident in 6 questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground md:text-lg">
            Answer a short guided questionnaire and get a ranked shortlist of Indian-market cars —
            with transparent scoring you can tweak instantly.
          </p>
        </header>

        {phase === "quiz" ? (
          <QuestionnaireFlow
            initialPreferences={preferences ?? undefined}
            onComplete={handleComplete}
          />
        ) : preferences ? (
          <ResultsView preferences={preferences} onEditPreferences={handleEditPreferences} />
        ) : null}
      </div>
    </main>
  );
}
