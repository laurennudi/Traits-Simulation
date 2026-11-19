import { useMemo, useState } from 'react';
import {
  BiomeId,
  GenerationStep,
  INITIAL_OBSERVATIONS,
  TrialObservation,
  computeFoxTraits,
} from './data/evolutions';
import { SimulationWorkspace } from './components/SimulationWorkspace';
import { EvidenceBuilderSection } from './components/EvidenceBuilderSection';

export default function App() {
  const [biomeId, setBiomeId] = useState<BiomeId>('arctic');
  const [generationStep, setGenerationStep] = useState<GenerationStep>(0);
  const [observations, setObservations] = useState<TrialObservation[]>(INITIAL_OBSERVATIONS);
  const [externalAdvanceSignal, setExternalAdvanceSignal] = useState<number>(0);

  const traits = useMemo(
    () => computeFoxTraits(biomeId, generationStep),
    [biomeId, generationStep]
  );

  const handleSelectBiome = (id: BiomeId) => {
    setBiomeId(id);
    setGenerationStep(0);
  };

  const handleRecordObservation = (obs: Omit<TrialObservation, 'id' | 'recordedAt'>) => {
    const nextIndex = observations.length + 1;
    const newEntry: TrialObservation = {
      ...obs,
      id: `obs-${Date.now()}-${nextIndex}`,
      recordedAt: obs.generation === 0 ? 'Start' : `Stage ${obs.generation}`,
    };
    setObservations((prev) => [newEntry, ...prev]);
  };

  const handleRemoveObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleClearObservations = () => {
    setObservations([]);
  };

  const handleHeaderNextGeneration = () => {
    const el = document.getElementById('simulation');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setExternalAdvanceSignal((n) => n + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Habitat &amp; Traits Lab
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <a
              href="#simulation"
              className="whitespace-nowrap shrink-0 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
            >
              Simulation
            </a>
            <a
              href="#evidence"
              className="whitespace-nowrap shrink-0 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
            >
              Trait Evidence
            </a>
            <a
              href="#standard"
              className="whitespace-nowrap shrink-0 hover:text-slate-900 hover:underline underline-offset-4 transition-colors"
            >
              NGSS 3-LS3-2
            </a>
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={handleHeaderNextGeneration}
              className="whitespace-nowrap shrink-0 rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Next Stage
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-[1200px] px-4 sm:px-6">
        {/* Focused Introduction */}
        <section className="border-b border-slate-200 pt-10 pb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span className="text-teal-800">NGSS 3-LS3-2</span>
            <span aria-hidden="true">·</span>
            <span>Heredity: Inheritance and Variation of Traits</span>
            <span aria-hidden="true">·</span>
            <span>Cause &amp; Effect Evidence Lab</span>
          </div>

          <h1
            className="mt-3 max-w-3xl font-display font-bold tracking-tight text-slate-900 text-balance"
            style={{ fontSize: 'clamp(2rem, 3.6vw, 2.85rem)', lineHeight: 1.12 }}
          >
            How Environments Shape Animal Traits for Survival
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Pick an environment below and press <strong>Next Stage</strong> to watch how a fox
            population&apos;s traits change across many generations. Each stage explains what
            changed and why it helps the fox survive.
          </p>
        </section>

        {/* Simplified Single-Fox Generation Simulation */}
        <SimulationWorkspace
          biomeId={biomeId}
          generationStep={generationStep}
          traits={traits}
          onSelectBiome={handleSelectBiome}
          onChangeGenerationStep={setGenerationStep}
          onRecordObservation={handleRecordObservation}
          observationCount={observations.length}
          externalAdvanceSignal={externalAdvanceSignal}
        />

        {/* Student Evidence Log & CER Explanation Builder */}
        <EvidenceBuilderSection
          observations={observations}
          onRemoveObservation={handleRemoveObservation}
          onClearObservations={handleClearObservations}
        />

        {/* NGSS 3-LS3-2 Standard Alignment */}
        <section id="standard" className="border-t border-slate-200 py-14">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-teal-800">
              Curriculum Standard · Next Generation Science Standards
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 text-balance">
              NGSS 3-LS3-2: Use Evidence to Support Trait Explanations
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-teal-800">
                01. Science &amp; Engineering Practice
              </div>
              <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                Constructing Explanations
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Students use observed survival rates, camouflage percentages, and trait changes
                across generations as concrete evidence to support scientific explanations.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-teal-800">
                02. Disciplinary Core Idea
              </div>
              <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                LS3.A &amp; LS3.B: Trait Variation
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Other characteristics result from individuals&apos; interactions with the
                environment. Many traits involve both inheritance and environmental influence.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="text-xs font-semibold text-teal-800">
                03. Crosscutting Concept
              </div>
              <h3 className="mt-1.5 text-base font-semibold text-slate-900">
                Cause and Effect
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Students identify cause-and-effect relationships between environmental challenges
                and measurable trait changes across generations.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-4 text-xs text-slate-500 sm:px-6">
          <span>Habitat &amp; Traits Lab · Educational Science Simulation for NGSS 3-LS3-2</span>
          <a
            href="https://www.nextgenscience.org/pe/3-ls3-2-heredity-inheritance-and-variation-traits"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-teal-800 hover:underline underline-offset-4"
          >
            View NGSS 3-LS3-2 Standard Page
          </a>
        </div>
      </footer>
    </div>
  );
}
