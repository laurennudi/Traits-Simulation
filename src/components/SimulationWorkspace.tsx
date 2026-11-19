import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookmarkPlus,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Thermometer,
  X,
} from 'lucide-react';
import {
  ANCESTOR_FOX,
  BIOMES,
  BIOME_ORDER,
  BiomeId,
  ComputedFoxTraits,
  GenerationStep,
  TraitPartId,
  TrialObservation,
} from '../data/evolutions';
import { HabitatStage } from './HabitatStage';

interface SimulationWorkspaceProps {
  biomeId: BiomeId;
  generationStep: GenerationStep;
  traits: ComputedFoxTraits;
  onSelectBiome: (id: BiomeId) => void;
  onChangeGenerationStep: (step: GenerationStep) => void;
  onRecordObservation: (obs: Omit<TrialObservation, 'id' | 'recordedAt'>) => void;
  observationCount: number;
  externalAdvanceSignal: number;
}

const STEP_LABELS: Record<GenerationStep, string> = {
  0: 'Start (Ancestral Fox)',
  1: 'Stage 1 (many generations later)',
  2: 'Stage 2 (hundreds of generations later)',
  3: 'Stage 3 (thousands of generations later)',
};

export const SimulationWorkspace: React.FC<SimulationWorkspaceProps> = ({
  biomeId,
  generationStep,
  traits,
  onSelectBiome,
  onChangeGenerationStep,
  onRecordObservation,
  observationCount,
  externalAdvanceSignal,
}) => {
  const biome = BIOMES[biomeId];
  const milestone = biome.generationMilestones[generationStep];

  const [selectedTrait, setSelectedTrait] = useState<TraitPartId | null>('coat');
  const [popupOpen, setPopupOpen] = useState(false);
  const [justSavedMsg, setJustSavedMsg] = useState<string | null>(null);

  // If header CTA is clicked, advance one generation (or open popup)
  useEffect(() => {
    if (externalAdvanceSignal > 0) {
      if (generationStep < 3) {
        const nextStep = (generationStep + 1) as GenerationStep;
        onChangeGenerationStep(nextStep);
        setPopupOpen(true);
      } else {
        setPopupOpen(true);
      }
    }
  }, [externalAdvanceSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNextGeneration = () => {
    if (generationStep < 3) {
      const nextStep = (generationStep + 1) as GenerationStep;
      onChangeGenerationStep(nextStep);
      setPopupOpen(true);
    } else {
      onChangeGenerationStep(0);
      setPopupOpen(false);
    }
  };

  const handleStartOver = () => {
    onChangeGenerationStep(0);
    setPopupOpen(false);
  };

  const handleSaveEvidence = () => {
    const label =
      generationStep === 0
        ? 'Ancestral Fox (Start)'
        : `${biome.speciesName} · ${STEP_LABELS[generationStep]}`;

    onRecordObservation({
      biomeId,
      biomeName: biome.name,
      speciesLabel: label,
      generation: generationStep,
      temperatureC: biome.defaultTempC,
      groundCoverPct: biome.defaultCoverPct,
      foodSupplyPct: biome.defaultFoodPct,
      camouflageMatch: traits.camouflageMatch,
      thermalStatus: traits.thermalStatus,
      foragingEnergyScore: traits.foragingEnergyScore,
      survivalRate: traits.survivalRate,
      keyTraitNote: milestone.whatChanged,
    });

    setJustSavedMsg(`Saved "${label}" to Evidence Log.`);
    window.setTimeout(() => setJustSavedMsg(null), 2600);
  };

  const selectedTraitInfo = selectedTrait ? biome.traits[selectedTrait] : null;
  const ancestorTraitText = selectedTrait ? ANCESTOR_FOX.traits[selectedTrait] : null;

  return (
    <section id="simulation" aria-label="Fox Generation Simulation" className="py-8">
      {/* Choose Environment Tabs */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Choose Habitat Environment"
          className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-slate-200/75 p-1"
        >
          {BIOME_ORDER.map((id) => {
            const b = BIOMES[id];
            const active = biomeId === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setPopupOpen(false);
                  onSelectBiome(id);
                }}
                className={`whitespace-nowrap shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-600">
          Environment: <strong className="font-semibold text-slate-900">{biome.climateSummary}</strong>
        </div>
      </div>

      {/* Main Two-Zone Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* LEFT ZONE: One Fox on Habitat Stage + Simple Stats */}
        <div className="space-y-4 lg:col-span-8">
          <HabitatStage
            biomeId={biomeId}
            generationStep={generationStep}
            traits={traits}
            selectedTrait={selectedTrait}
            onSelectTrait={setSelectedTrait}
          />

          {/* Simple 3-Stat Readout */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Camouflage Match</span>
                <ShieldCheck className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                  {traits.camouflageMatch}%
                </span>
                <span
                  className={`text-xs font-medium ${
                    traits.camouflageMatch >= 65 ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {traits.camouflageMatch >= 65 ? 'Well Hidden' : 'Easy to Spot'}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Body Temperature</span>
                <Thermometer className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                  {traits.estimatedBodyTempC}°C
                </span>
                <span
                  className={`text-xs font-medium ${
                    traits.thermalStatus === 'Nominal' ? 'text-emerald-700' : 'text-red-700'
                  }`}
                >
                  {traits.thermalStatus === 'Nominal' ? 'Comfortable' : traits.thermalStatus}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Survival Chance</span>
                <CheckCircle2
                  className={`h-4 w-4 ${
                    traits.survivalRate >= 70 ? 'text-emerald-700' : 'text-amber-600'
                  }`}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="font-mono text-xl font-semibold text-slate-900 tabular-nums">
                  {traits.survivalRate}%
                </span>
                <span
                  className={`text-xs font-medium ${
                    traits.survivalRate >= 70
                      ? 'text-emerald-700'
                      : traits.survivalRate >= 50
                      ? 'text-amber-700'
                      : 'text-red-700'
                  }`}
                >
                  {traits.survivalRate >= 70
                    ? 'Thriving'
                    : traits.survivalRate >= 50
                    ? 'Getting Better'
                    : 'Struggling'}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Body Part Detail */}
          {selectedTraitInfo && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-semibold text-slate-900">
                  Body Part Focus: {selectedTraitInfo.label}
                </h3>
                <span className="text-xs text-slate-500">{biome.speciesName}</span>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold text-slate-500">At Start (Ancestor)</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">{ancestorTraitText}</p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-teal-800">How It Helps Survive</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">
                    {selectedTraitInfo.survivalNeed}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ZONE: Generation Controls OR Non-Blocking Explanation Pop-Up Beside the Fox */}
        <aside className="relative lg:col-span-4">
          {popupOpen ? (
            <div
              className="rounded-2xl border-2 border-teal-700 bg-white p-5 shadow-xl"
              role="dialog"
              aria-labelledby="generation-popup-title"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <p className="text-xs font-semibold text-teal-800">
                    {biome.name} · {milestone.timeHorizon}
                  </p>
                  <h3
                    id="generation-popup-title"
                    className="mt-1 font-display text-lg font-semibold text-slate-900"
                  >
                    {milestone.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">{milestone.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPopupOpen(false)}
                  aria-label="Close explanation pop-up"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-teal-700"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                  <div className="text-xs font-semibold text-slate-500">
                    What Changed on This Fox?
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-900">
                    {milestone.whatChanged}
                  </p>
                </div>

                <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3.5">
                  <div className="text-xs font-semibold text-teal-900">
                    Why Did the Environment Cause This?
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-800">
                    {milestone.whyItChanged}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <div className="text-[11px] font-medium text-slate-500">Camouflage</div>
                    <div className="font-mono text-base font-semibold text-slate-900 tabular-nums">
                      {traits.camouflageMatch}%
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <div className="text-[11px] font-medium text-slate-500">Survival Chance</div>
                    <div className="font-mono text-base font-semibold text-emerald-700 tabular-nums">
                      {traits.survivalRate}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setPopupOpen(false)}
                  className="whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                >
                  Got It
                </button>
                <button
                  type="button"
                  onClick={handleNextGeneration}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800"
                >
                  {generationStep < 3 ? (
                    <>
                      <span>Next Stage</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Start Over</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Watch Traits Change Over Time</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Press <strong>Next Stage</strong> to see how traits in this fox population change
                  across many generations in the {biome.name}.
                </p>
              </div>

              {/* Stepper Indicator */}
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-medium text-slate-500">Evolutionary Stages</div>

                <div className="mt-2.5 flex flex-col gap-1.5">
                  {([0, 1, 2, 3] as GenerationStep[]).map((step) => {
                    const isCurrent = generationStep === step;
                    const isPassed = generationStep > step;
                    return (
                      <button
                        key={step}
                        type="button"
                        onClick={() => {
                          onChangeGenerationStep(step);
                          if (step > 0) setPopupOpen(true);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-teal-700 ${
                          isCurrent
                            ? 'bg-teal-700 text-white'
                            : isPassed
                            ? 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {STEP_LABELS[step]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Action: Next Stage */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleNextGeneration}
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-teal-700 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  {generationStep < 3 ? (
                    <>
                      <span>Next Stage</span>
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      <span>Start Over at Ancestral Fox</span>
                    </>
                  )}
                </button>

                {generationStep > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPopupOpen(true)}
                      className="whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50"
                    >
                      Show Change Info
                    </button>
                    <button
                      type="button"
                      onClick={handleStartOver}
                      className="whitespace-nowrap shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                      Reset to Start
                    </button>
                  </div>
                )}
              </div>

              {/* Current Generation Quick Summary */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                <div className="text-xs font-semibold text-slate-500">Current Traits</div>
                <p className="mt-1 text-xs font-semibold text-slate-900">
                  {milestone.traitHighlight}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {milestone.whatChanged}
                </p>
              </div>

              {/* Save Evidence Button */}
              <div className="border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleSaveEvidence}
                  className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                >
                  <BookmarkPlus className="h-4 w-4 text-teal-700" aria-hidden="true" />
                  Save to Evidence Log ({observationCount})
                </button>
                {justSavedMsg && (
                  <p className="mt-2 text-center text-xs font-medium text-emerald-700">
                    {justSavedMsg}
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};
