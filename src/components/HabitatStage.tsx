import React from 'react';
import {
  BIOMES,
  BiomeId,
  ComputedFoxTraits,
  GenerationStep,
  TraitPartId,
} from '../data/evolutions';
import { MorphingFoxSvg } from './MorphingFoxSvg';

interface HabitatStageProps {
  biomeId: BiomeId;
  generationStep: GenerationStep;
  traits: ComputedFoxTraits;
  selectedTrait: TraitPartId | null;
  onSelectTrait: (part: TraitPartId) => void;
}

export const HabitatStage: React.FC<HabitatStageProps> = ({
  biomeId,
  generationStep,
  traits,
  selectedTrait,
  onSelectTrait,
}) => {
  const biome = BIOMES[biomeId];
  const milestone = biome.generationMilestones[generationStep];

  const groundColor =
    biomeId === 'arctic'
      ? '#F1F5F9'
      : biomeId === 'desert'
      ? '#F2D096'
      : '#8F6A47';

  const farHillColor =
    biomeId === 'arctic'
      ? '#E2E8F0'
      : biomeId === 'desert'
      ? '#E8BD7C'
      : '#5C7C5E';

  const skyGradient =
    biomeId === 'arctic'
      ? 'from-sky-100 via-slate-50 to-white'
      : biomeId === 'desert'
      ? 'from-amber-100/80 via-amber-50/40 to-white'
      : 'from-emerald-50/80 via-slate-50 to-white';

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Stage Top Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-900">{milestone.timeHorizon}</span>
          <span aria-hidden="true">·</span>
          <span>
            {biome.name} ({biome.defaultTempC}°C)
          </span>
        </div>
        <span className="text-slate-500">Click any dot on the fox to inspect a body part</span>
      </div>

      {/* Visual Habitat Scene with One Centered Morphing Fox */}
      <div className={`relative h-[320px] sm:h-[360px] w-full bg-gradient-to-b ${skyGradient}`}>
        <svg
          viewBox="0 0 800 360"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Sun / Polar Sun */}
          {biomeId === 'desert' && (
            <g>
              <circle cx="675" cy="68" r="34" fill="#F59E0B" opacity="0.22" />
              <circle cx="675" cy="68" r="22" fill="#F59E0B" opacity="0.55" />
            </g>
          )}
          {biomeId === 'arctic' && (
            <circle cx="140" cy="68" r="22" fill="#BAE6FD" opacity="0.55" />
          )}

          {/* Far Biome Terrain */}
          {biomeId === 'arctic' && (
            <path
              d="M 0,235 L 120,165 L 240,210 L 390,145 L 540,205 L 680,155 L 800,200 L 800,360 L 0,360 Z"
              fill={farHillColor}
            />
          )}
          {biomeId === 'desert' && (
            <path
              d="M 0,220 Q 180,165 360,210 T 720,195 L 800,205 L 800,360 L 0,360 Z"
              fill={farHillColor}
            />
          )}
          {biomeId === 'forest' && (
            <g>
              <path
                d="M 0,225 Q 200,185 420,215 T 800,200 L 800,360 L 0,360 Z"
                fill={farHillColor}
                opacity="0.45"
              />
              {[90, 210, 560, 690, 760].map((tx, i) => (
                <g key={tx} transform={`translate(${tx}, ${145 + (i % 2) * 18})`} opacity="0.65">
                  <rect x="-6" y="30" width="12" height="75" fill="#5C4433" />
                  <circle cx="0" cy="18" r="34" fill="#3F6B4B" />
                  <circle cx="-18" cy="30" r="24" fill="#4B7B56" />
                  <circle cx="20" cy="28" r="26" fill="#375F41" />
                </g>
              ))}
            </g>
          )}

          {/* Foreground Ground */}
          <path
            d="M 0,245 Q 230,228 450,245 T 800,238 L 800,360 L 0,360 Z"
            fill={groundColor}
          />

          {/* Biome Surface Texture Details */}
          {biomeId === 'arctic' && (
            <g>
              <g fill="#FFFFFF" opacity="0.9">
                <ellipse cx="180" cy="290" rx="95" ry="12" />
                <ellipse cx="580" cy="305" rx="120" ry="14" />
                <ellipse cx="380" cy="325" rx="140" ry="12" />
              </g>
              <g fill="#FFFFFF" opacity="0.75">
                {[75, 160, 250, 340, 460, 540, 630, 720].map((sx, i) => (
                  <circle
                    key={sx}
                    cx={sx}
                    cy={45 + ((i * 37) % 160)}
                    r={i % 2 === 0 ? 2.5 : 1.8}
                  />
                ))}
              </g>
            </g>
          )}
          {biomeId === 'desert' && (
            <g>
              <path d="M 120,305 L 114,286 M 120,305 L 122,282 M 120,305 L 129,288" stroke="#78716C" strokeWidth="2" />
              <path d="M 670,295 L 664,278 M 670,295 L 673,275 M 670,295 L 679,281" stroke="#78716C" strokeWidth="2" />
            </g>
          )}
          {biomeId === 'forest' && (
            <g>
              {Array.from({ length: 11 }, (_, idx) => (
                <ellipse
                  key={idx}
                  cx={70 + idx * 66}
                  cy={282 + ((idx * 19) % 45)}
                  rx="7"
                  ry="4"
                  transform={`rotate(${(idx * 25) % 60}, ${70 + idx * 66}, ${282 + ((idx * 19) % 45)})`}
                  fill={idx % 2 === 0 ? '#B45309' : '#9A3412'}
                  opacity="0.72"
                />
              ))}
              <path d="M 85,305 Q 70,275 55,268 M 85,305 Q 95,270 112,264" stroke="#15803D" strokeWidth="2.4" fill="none" />
              <path d="M 705,300 Q 690,272 676,265 M 705,300 Q 718,269 732,263" stroke="#15803D" strokeWidth="2.4" fill="none" />
            </g>
          )}
        </svg>

        {/* Single Centered Morphing Fox Specimen */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[250px] sm:w-[295px]">
          <MorphingFoxSvg
            biomeId={biomeId}
            traits={traits}
            selectedTrait={selectedTrait}
            onSelectTrait={onSelectTrait}
          />
        </div>
      </div>

      {/* Stage Bottom Trait Quick-Selector Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-white px-4 py-2.5">
        <span className="text-xs font-medium text-slate-500">Body Parts:</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {(['ears', 'coat', 'paws', 'body'] as TraitPartId[]).map((part) => {
            const active = selectedTrait === part;
            const labels: Record<TraitPartId, string> = {
              ears: 'Ears',
              coat: 'Fur Coat',
              paws: 'Paws',
              body: 'Body & Tail',
            };
            return (
              <button
                key={part}
                type="button"
                onClick={() => onSelectTrait(part)}
                className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                  active
                    ? 'bg-teal-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {labels[part]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
