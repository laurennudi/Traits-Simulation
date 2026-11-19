import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  HelpCircle,
  Trash2,
} from 'lucide-react';
import { TrialObservation } from '../data/evolutions';

interface EvidenceBuilderSectionProps {
  observations: TrialObservation[];
  onRemoveObservation: (id: string) => void;
  onClearObservations: () => void;
}

interface ExplanationEvaluation {
  isValid: boolean;
  headline: string;
  details: string;
  checks: {
    hasEvidence: boolean;
    hasEnvironmentCause: boolean;
    hasTraitAndSurvival: boolean;
    hasAccurateMechanism: boolean;
    noMisconception: boolean;
    matchesSelectedBiome: boolean;
  };
}

function evaluateScientificExplanation(
  rawText: string,
  selectedObs: TrialObservation[]
): ExplanationEvaluation {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // 1. Evidence contrast check
  const survivalValues = selectedObs.map((o) => o.survivalRate);
  const minS = survivalValues.length ? Math.min(...survivalValues) : 0;
  const maxS = survivalValues.length ? Math.max(...survivalValues) : 0;
  const hasEvidence =
    selectedObs.length >= 2 &&
    (maxS - minS >= 10 ||
      new Set(selectedObs.map((o) => o.biomeId)).size > 1 ||
      new Set(selectedObs.map((o) => o.generation)).size > 1);

  // 2. Misconception detector (Lamarckian intent or single-generation/individual morphing)
  const intentionalMisconception =
    /\b(wanted to|tried to|decided to|chose to|wished to|so it grew|so they grew|decided it needed)\b/i.test(
      text
    );
  const singleGenMisconception =
    /\b(in one generation|in a single generation|one lifetime|overnight|instantly|immediately|same fox grew|one fox changed its)\b/i.test(
      text
    );
  const noMisconception = !intentionalMisconception && !singleGenMisconception;

  // 3. Environmental cause check
  const hasEnvironmentCause =
    /\b(cold|freez\w*|snow\w*|ice|icy|tundra|arctic|winter|wind\w*|heat|hot|desert|sand\w*|sun\w*|forest|woodland|leaf|leaves|brush|predator\w*|prey|environment\w*|climate|habitat\w*|temperat\w*)\b/i.test(
      lower
    );

  // 4. Trait + survival advantage check
  const hasTraitWord =
    /\b(fur|coat\w*|color\w*|white|brown|tan|sandy|red|russet|ear\w*|paw\w*|tail\w*|body|size|compact|thick\w*|thin\w*|dense|round\w*|large\w*|small\w*|short\w*)\b/i.test(
      lower
    );
  const hasSurvivalBenefit =
    /\b(warm\w*|cool\w*|heat\w*|insulat\w*|hid\w*|camouflag\w*|blend\w*|spot\w*|hear\w*|listen\w*|hunt\w*|trac\w*|grip\w*|protect\w*|surviv\w*|reflect\w*|los[esing]+ heat|trap\w*)\b/i.test(
      lower
    );
  const hasTraitAndSurvival = hasTraitWord && hasSurvivalBenefit;

  // 5. Accurate evolutionary mechanism & multi-generation timescale
  const hasTimescale =
    /\b(generation\w*|many years|hundreds|thousands|over time|stages?|across time|long time)\b/i.test(
      lower
    );
  const hasSelectionMechanism =
    /\b(surviv\w*|pass\w* (?:on|down|those|the|their)|offspring|babies|young|inherit\w*|reproduc\w*|born with|natural selection|population\w*|more likely to live)\b/i.test(
      lower
    );
  const hasAccurateMechanism = hasTimescale && hasSelectionMechanism;

  // 6. Consistency with selected evidence biomes
  const selectedBiomes = new Set(selectedObs.map((o) => o.biomeId));
  let matchesSelectedBiome = true;
  if (selectedObs.length > 0 && selectedBiomes.size === 1) {
    const onlyBiome = Array.from(selectedBiomes)[0];
    if (
      onlyBiome === 'arctic' &&
      /\b(desert|fennec|sand dunes)\b/i.test(lower) &&
      !/\b(arctic|tundra|snow|cold|ice)\b/i.test(lower)
    ) {
      matchesSelectedBiome = false;
    } else if (
      onlyBiome === 'desert' &&
      /\b(arctic|tundra|snow|blizzard)\b/i.test(lower) &&
      !/\b(desert|sand|heat|hot|fennec)\b/i.test(lower)
    ) {
      matchesSelectedBiome = false;
    } else if (
      onlyBiome === 'forest' &&
      /\b(arctic|tundra|desert|sand dunes)\b/i.test(lower) &&
      !/\b(forest|woodland|leaves|leaf|russet|red fox)\b/i.test(lower)
    ) {
      matchesSelectedBiome = false;
    }
  }

  // Build specific, actionable feedback
  if (!hasEvidence) {
    return {
      isValid: false,
      headline: 'Select at least 2 contrasting trials',
      details:
        'Check at least 2 saved observations in the table on the left from different stages or habitats so your explanation compares real survival data.',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  if (text.length < 30) {
    return {
      isValid: false,
      headline: 'Write a complete scientific explanation',
      details:
        'Your explanation is too short. Describe the environmental challenge, the trait change, how it helped survival, and how it happened across many generations.',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  if (intentionalMisconception) {
    return {
      isValid: false,
      headline: 'Revise misconception: Animals do not choose to evolve',
      details:
        'Foxes do not decide, try, or want to grow new traits. Instead, individuals born with helpful traits survive better in that environment and pass those traits to their offspring.',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  if (singleGenMisconception) {
    return {
      isValid: false,
      headline: 'Revise misconception: Major traits do not change in one fox or one generation',
      details:
        'Ears, fur thickness, and paw pads do not transform overnight or in a single generation. Explain how traits shift across many, hundreds, or thousands of generations.',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  if (!matchesSelectedBiome) {
    return {
      isValid: false,
      headline: 'Explanation does not match your selected evidence',
      details:
        'Your reasoning describes a different habitat than the trials checked on the left. Match your explanation to the habitat in your selected observations.',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  if (!hasEnvironmentCause) {
    return {
      isValid: false,
      headline: 'Missing environmental cause',
      details:
        'Identify the specific environmental condition (such as freezing cold, snow, desert heat, sand, or forest cover/prey) that influenced which traits survived.',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  if (!hasTraitAndSurvival) {
    return {
      isValid: false,
      headline: 'Connect a specific trait to how it helps survival',
      details:
        'Name a specific physical trait (such as fur thickness, coat color, ear size, or furry paws) and explain how it helps the fox survive (stay warm, release heat, hide from predators, or find prey).',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  if (!hasAccurateMechanism) {
    return {
      isValid: false,
      headline: 'Explain WHY traits changed across generations',
      details: !hasTimescale
        ? 'Include the timescale: explain that these trait changes happened across many generations (or hundreds/thousands of generations), not all at once.'
        : 'Explain the survival mechanism: foxes born with helpful traits survived better and passed those traits on to their offspring.',
      checks: {
        hasEvidence,
        hasEnvironmentCause,
        hasTraitAndSurvival,
        hasAccurateMechanism,
        noMisconception,
        matchesSelectedBiome,
      },
    };
  }

  return {
    isValid: true,
    headline: 'Scientifically accurate NGSS 3-LS3-2 explanation!',
    details: `Your explanation accurately connects environmental pressures, specific survival traits, inheritance over many generations, and your ${selectedObs.length} selected observations (${minS}% to ${maxS}% survival).`,
    checks: {
      hasEvidence,
      hasEnvironmentCause,
      hasTraitAndSurvival,
      hasAccurateMechanism,
      noMisconception,
      matchesSelectedBiome,
    },
  };
}

export const EvidenceBuilderSection: React.FC<EvidenceBuilderSectionProps> = ({
  observations,
  onRemoveObservation,
  onClearObservations,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    observations.slice(0, 2).map((o) => o.id)
  );
  const [studentReasoning, setStudentReasoning] = useState<string>('');
  const [evaluation, setEvaluation] = useState<ExplanationEvaluation | null>(null);
  const [showScaffold, setShowScaffold] = useState(false);
  const [copied, setCopied] = useState(false);

  const validSelectedObservations = useMemo(
    () => observations.filter((o) => selectedIds.includes(o.id)),
    [observations, selectedIds]
  );

  const toggleSelectObservation = (id: string) => {
    setEvaluation(null);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckExplanation = () => {
    const result = evaluateScientificExplanation(studentReasoning, validSelectedObservations);
    setEvaluation(result);
  };

  const handleCopyReport = async () => {
    const checkResult = evaluateScientificExplanation(studentReasoning, validSelectedObservations);
    setEvaluation(checkResult);
    if (!checkResult.isValid) {
      return;
    }

    const evidenceLines = validSelectedObservations
      .map(
        (o) =>
          `- ${o.speciesLabel} in ${o.biomeName} (${o.temperatureC}°C): ${o.camouflageMatch}% camouflage, ${o.thermalStatus}, ${o.survivalRate}% survival.`
      )
      .join('\n');

    const reportText = [
      'NGSS 3-LS3-2 Trait & Environment Evidence Report',
      '',
      'Claim: Animal traits can be influenced by their environment, and those trait changes affect survival.',
      '',
      'Evidence from Simulation:',
      evidenceLines,
      '',
      `Reasoning: ${studentReasoning.trim()}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  const rubricItems = [
    {
      label: 'Cites 2+ contrasting stage observations',
      passed: evaluation ? evaluation.checks.hasEvidence : validSelectedObservations.length >= 2,
    },
    {
      label: 'Names the environmental condition (cold, snow, heat, sand, or forest)',
      passed: evaluation ? evaluation.checks.hasEnvironmentCause : null,
    },
    {
      label: 'Links a physical trait to how it helps survival',
      passed: evaluation ? evaluation.checks.hasTraitAndSurvival : null,
    },
    {
      label: 'Explains inheritance & survival across many generations (no misconceptions)',
      passed: evaluation
        ? evaluation.checks.hasAccurateMechanism &&
          evaluation.checks.noMisconception &&
          evaluation.checks.matchesSelectedBiome
        : null,
    },
  ];

  return (
    <section id="evidence" className="border-t border-slate-200 py-14">
      <div className="max-w-3xl">
        <p className="text-xs font-medium text-teal-800">
          NGSS 3-LS3-2 Evidence Lab · Claim, Evidence &amp; Reasoning
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl text-balance">
          Use Evidence to Explain Why Traits Changed
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
          Select at least two saved stages from the simulation, then write a scientifically accurate
          explanation describing why those traits changed across generations to help the fox
          survive.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left: Recorded Trials Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Saved Stage Observations
              </h3>
              <p className="text-xs text-slate-500">
                Check observations below to use them as evidence in your explanation.
              </p>
            </div>

            {observations.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onClearObservations();
                  setEvaluation(null);
                }}
                className="whitespace-nowrap shrink-0 text-xs font-medium text-slate-500 hover:text-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {observations.length === 0 ? (
            <div className="py-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-2 text-sm font-medium text-slate-700">No observations saved yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Advance through stages in the simulation above and click &ldquo;Save to Evidence
                Log&rdquo; to collect data.
              </p>
            </div>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 pr-2 font-medium">Use</th>
                    <th className="py-2.5 px-2 font-medium">Stage &amp; Habitat</th>
                    <th className="py-2.5 px-2 font-medium">Climate</th>
                    <th className="py-2.5 px-2 font-medium">Camo</th>
                    <th className="py-2.5 px-2 font-medium">Survival</th>
                    <th className="py-2.5 pl-2 text-right font-medium">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {observations.map((obs) => {
                    const checked = selectedIds.includes(obs.id);
                    return (
                      <tr
                        key={obs.id}
                        className={checked ? 'bg-teal-50/40' : 'hover:bg-slate-50/70'}
                      >
                        <td className="py-3 pr-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSelectObservation(obs.id)}
                            aria-label={`Select ${obs.speciesLabel} observation as evidence`}
                            className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <div className="font-semibold text-slate-900">{obs.speciesLabel}</div>
                          <div className="text-[11px] text-slate-500">
                            {obs.biomeName} · {obs.recordedAt}
                          </div>
                        </td>
                        <td className="py-3 px-2 font-mono text-[11px] text-slate-700 tabular-nums">
                          {obs.temperatureC}°C · {obs.thermalStatus}
                        </td>
                        <td className="py-3 px-2 font-mono font-medium text-slate-800 tabular-nums">
                          {obs.camouflageMatch}%
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`font-mono font-semibold tabular-nums ${
                              obs.survivalRate >= 70
                                ? 'text-emerald-700'
                                : obs.survivalRate >= 50
                                ? 'text-amber-700'
                                : 'text-red-700'
                            }`}
                          >
                            {obs.survivalRate}%
                          </span>
                        </td>
                        <td className="py-3 pl-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              onRemoveObservation(obs.id);
                              setEvaluation(null);
                            }}
                            aria-label={`Delete observation ${obs.speciesLabel}`}
                            className="inline-flex rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Scientific Explanation Builder */}
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5">
          <h3 className="text-base font-semibold text-slate-900">
            Scientific Explanation Builder
          </h3>

          <div className="rounded-lg bg-slate-50 p-3.5">
            <div className="text-xs font-semibold text-slate-500">Claim (Target Standard)</div>
            <p className="mt-1 text-sm font-medium text-slate-900">
              Animal traits can be influenced by their environment, and those trait changes affect
              survival.
            </p>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-500">
              Selected Evidence ({validSelectedObservations.length} observations)
            </span>
            {validSelectedObservations.length === 0 ? (
              <p className="mt-1.5 text-xs text-slate-500">
                Check at least two observations in the table on the left to attach data evidence.
              </p>
            ) : (
              <ul className="mt-2 space-y-2">
                {validSelectedObservations.map((obs) => (
                  <li
                    key={obs.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-700"
                  >
                    <span className="font-semibold text-slate-900">{obs.speciesLabel}</span> in{' '}
                    {obs.biomeName} (<span className="font-mono tabular-nums">{obs.temperatureC}°C</span>
                    ):{' '}
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {obs.camouflageMatch}% camo · {obs.survivalRate}% survival
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="reasoning-input"
                className="block text-xs font-semibold text-slate-500"
              >
                Your Scientific Reasoning (Required)
              </label>
              <button
                type="button"
                onClick={() => setShowScaffold((s) => !s)}
                className="inline-flex items-center gap-1 text-xs font-medium text-teal-800 hover:underline underline-offset-2"
              >
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                {showScaffold ? 'Hide Guide' : 'Sentence Guide'}
              </button>
            </div>

            {showScaffold && (
              <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
                <span className="font-semibold text-slate-900">Writing frame: </span>
                &ldquo;In the [environment &amp; challenge], foxes born with [specific trait] could
                [how it helped survive] better. Across [many/hundreds/thousands of generations],
                foxes with those traits survived and passed them to offspring.&rdquo;
              </div>
            )}

            <textarea
              id="reasoning-input"
              rows={4}
              value={studentReasoning}
              onChange={(e) => {
                setStudentReasoning(e.target.value);
                setEvaluation(null);
              }}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700"
              placeholder="Write in your own words: What environmental condition challenged the foxes, which traits helped them survive, and why did the population change over many generations?"
            />
          </div>

          {/* Accuracy Checklist */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            <div className="text-xs font-semibold text-slate-600">
              Required for an Accurate Explanation
            </div>
            <ul className="mt-2 space-y-1.5 text-xs">
              {rubricItems.map((item) => (
                <li key={item.label} className="flex items-start gap-2">
                  {item.passed === true ? (
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                  ) : item.passed === false ? (
                    <AlertCircle
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700"
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  )}
                  <span
                    className={
                      item.passed === true
                        ? 'text-emerald-900 font-medium'
                        : item.passed === false
                        ? 'text-amber-900 font-medium'
                        : 'text-slate-600'
                    }
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleCheckExplanation}
              className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap shrink-0 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              Check Explanation
            </button>
            <button
              type="button"
              onClick={handleCopyReport}
              disabled={evaluation !== null && !evaluation.isValid}
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              <Copy className="h-4 w-4 text-slate-600" aria-hidden="true" />
              {copied ? 'Copied' : 'Copy Report'}
            </button>
          </div>

          {evaluation && (
            <div
              className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed ${
                evaluation.isValid
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-amber-200 bg-amber-50 text-amber-900'
              }`}
            >
              {evaluation.isValid ? (
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
              ) : (
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                  aria-hidden="true"
                />
              )}
              <div>
                <div className="font-semibold">{evaluation.headline}</div>
                <p className="mt-0.5">{evaluation.details}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
