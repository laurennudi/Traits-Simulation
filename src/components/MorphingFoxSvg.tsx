import React from 'react';
import { BiomeId, ComputedFoxTraits, TraitPartId } from '../data/evolutions';

interface MorphingFoxSvgProps {
  biomeId: BiomeId;
  traits: ComputedFoxTraits;
  selectedTrait: TraitPartId | null;
  onSelectTrait: (part: TraitPartId) => void;
  isMoving?: boolean;
  facingLeft?: boolean;
  isListening?: boolean;
  isPredatorScanning?: boolean;
  className?: string;
}

export const MorphingFoxSvg: React.FC<MorphingFoxSvgProps> = ({
  biomeId,
  traits,
  selectedTrait,
  onSelectTrait,
  isMoving = false,
  facingLeft = false,
  isListening = false,
  isPredatorScanning = false,
  className = '',
}) => {
  const {
    earScale,
    earRoundness,
    earVesselGlow,
    furThickness,
    pawPadding,
    bodyMassScale,
    tailFluff,
    coatColor,
    bellyColor,
    earInnerColor,
    legTipColor,
    thermalStatus,
  } = traits;

  // Derived geometric morph values inside a 280x200 viewBox
  const bodyScaleY = 0.88 + (bodyMassScale - 0.75) * 0.36 + (furThickness - 0.4) * 0.08;
  const bodyScaleX = 0.92 + (bodyMassScale - 0.75) * 0.22;
  const ruffOpacity = Math.max(0, Math.min(1, (furThickness - 0.85) / 0.85));
  const pawRadiusX = 7 + (pawPadding - 1) * 6.5;
  const pawRadiusY = 4 + (pawPadding - 1) * 2.4;

  // Ear geometry: base width & height scale dynamically
  const earHeight = 36 * earScale;
  const earWidth = 20 * (0.85 + earScale * 0.22);
  const earTipCurve = 3 + earRoundness * 10; // higher = rounder Arctic ear

  // Tail geometry
  const tailScaleY = 0.75 + (tailFluff - 0.7) * 0.58;
  const tailScaleX = 0.85 + (tailFluff - 0.7) * 0.32;
  const showWhiteTailTip = biomeId === 'forest' || biomeId === 'arctic';

  // Outline stroke tone adapted to light or dark fur so white Arctic fox stays crisp against snow
  const outlineStroke = '#334155';

  return (
    <svg
      viewBox="0 0 300 210"
      className={`select-none overflow-visible ${className}`}
      role="img"
      aria-label={`Interactive morphing fox specimen in ${biomeId} habitat`}
    >
      <defs>
        <filter id="fox-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0F172A" floodOpacity="0.16" />
        </filter>
      </defs>

      <g
        transform={`translate(150, 115) scale(${facingLeft ? -1 : 1}, 1) translate(-150, -115)`}
        filter="url(#fox-shadow)"
      >
        {/* Ground contact shadow */}
        <ellipse
          cx="148"
          cy="176"
          rx={62 * bodyScaleX}
          ry="8"
          fill="#0F172A"
          opacity={isPredatorScanning ? 0.22 : 0.14}
        />

        {/* Listening sound rings around ears when foraging */}
        {isListening && (
          <g transform="translate(196, 52)">
            <circle
              cx="0"
              cy="0"
              r={18 * earScale}
              fill="none"
              stroke="#0D9488"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.7"
            />
            <circle
              cx="0"
              cy="0"
              r={28 * earScale}
              fill="none"
              stroke="#0D9488"
              strokeWidth="1.2"
              strokeDasharray="2 4"
              opacity="0.4"
            />
          </g>
        )}

        {/* TAIL */}
        <g
          transform={`translate(95, 118) rotate(${isMoving ? -6 : -14}) scale(${tailScaleX}, ${tailScaleY})`}
          className="cursor-pointer transition-transform duration-300"
          onClick={() => onSelectTrait('body')}
        >
          <path
            d="M 0,0 C -26,-16 -58,-12 -74,10 C -82,22 -72,38 -52,36 C -30,34 -12,20 4,10 Z"
            fill={coatColor}
            stroke={selectedTrait === 'body' ? '#0F766E' : outlineStroke}
            strokeWidth={selectedTrait === 'body' ? 2.6 : 1.6}
          />
          {showWhiteTailTip && (
            <path
              d="M -56,2 C -66,5 -72,11 -74,14 C -78,24 -70,36 -54,35 C -49,26 -50,12 -56,2 Z"
              fill="#F8FAFC"
              opacity="0.92"
            />
          )}
        </g>

        {/* BACK LEGS (far side) */}
        <g
          transform={`translate(106, 134) rotate(${isMoving ? 10 : 0})`}
          className="cursor-pointer"
          onClick={() => onSelectTrait('paws')}
        >
          <path
            d="M -6,0 L -10,24 L -5,38 L 4,38 L 3,20 L 8,0 Z"
            fill={coatColor}
            stroke={outlineStroke}
            strokeWidth="1.4"
          />
          <path d="M -9,22 L -5,38 L 4,38 L 3,22 Z" fill={legTipColor} />
          <ellipse
            cx="1"
            cy="39"
            rx={pawRadiusX * 0.9}
            ry={pawRadiusY * 0.9}
            fill={legTipColor}
            stroke={outlineStroke}
            strokeWidth="1.2"
          />
        </g>

        <g
          transform={`translate(168, 132) rotate(${isMoving ? -10 : 0})`}
          className="cursor-pointer"
          onClick={() => onSelectTrait('paws')}
        >
          <path
            d="M -5,0 L -3,22 L -1,39 L 8,39 L 7,20 L 8,0 Z"
            fill={coatColor}
            stroke={outlineStroke}
            strokeWidth="1.4"
          />
          <path d="M -3,22 L -1,39 L 8,39 L 7,22 Z" fill={legTipColor} />
          <ellipse
            cx="5"
            cy="40"
            rx={pawRadiusX * 0.9}
            ry={pawRadiusY * 0.9}
            fill={legTipColor}
            stroke={outlineStroke}
            strokeWidth="1.2"
          />
        </g>

        {/* TORSO / COAT */}
        <g
          transform={`translate(142, 118) scale(${bodyScaleX}, ${bodyScaleY})`}
          className="cursor-pointer transition-transform duration-300"
          onClick={() => onSelectTrait('coat')}
        >
          <path
            d="M -50,2 C -52,-22 -24,-30 14,-28 C 38,-26 52,-14 54,4 C 55,22 36,28 4,28 C -26,28 -48,22 -50,2 Z"
            fill={coatColor}
            stroke={selectedTrait === 'coat' ? '#0F766E' : outlineStroke}
            strokeWidth={selectedTrait === 'coat' ? 2.6 : 1.6}
          />
          {/* Lighter Belly */}
          <path
            d="M -26,18 C -6,27 24,27 44,16 C 36,23 18,27 2,27 C -12,27 -22,23 -26,18 Z"
            fill={bellyColor}
          />
          {/* Thick winter fur tufts along back when furThickness is high */}
          {ruffOpacity > 0.15 && (
            <g opacity={ruffOpacity} fill={coatColor} stroke={outlineStroke} strokeWidth="1.1">
              <path d="M -34,-21 Q -26,-33 -18,-24" />
              <path d="M -14,-26 Q -5,-36 4,-27" />
              <path d="M 8,-27 Q 18,-35 26,-24" />
            </g>
          )}
        </g>

        {/* FRONT & HIND LEGS (near side) */}
        <g
          transform={`translate(115, 134) rotate(${isMoving ? -11 : 0})`}
          className="cursor-pointer"
          onClick={() => onSelectTrait('paws')}
        >
          <path
            d="M -9,0 C -14,12 -12,22 -7,39 L 3,39 C 4,23 7,12 8,0 Z"
            fill={coatColor}
            stroke={selectedTrait === 'paws' ? '#0F766E' : outlineStroke}
            strokeWidth={selectedTrait === 'paws' ? 2.3 : 1.5}
          />
          <path d="M -10,23 L -7,39 L 3,39 L 3,23 Z" fill={legTipColor} />
          <ellipse
            cx="0"
            cy="40"
            rx={pawRadiusX}
            ry={pawRadiusY}
            fill={legTipColor}
            stroke={selectedTrait === 'paws' ? '#0F766E' : outlineStroke}
            strokeWidth={selectedTrait === 'paws' ? 2.2 : 1.4}
          />
        </g>

        <g
          transform={`translate(178, 132) rotate(${isMoving ? 11 : 0})`}
          className="cursor-pointer"
          onClick={() => onSelectTrait('paws')}
        >
          <path
            d="M -6,0 L -5,22 L -3,40 L 6,40 L 6,21 L 9,0 Z"
            fill={coatColor}
            stroke={selectedTrait === 'paws' ? '#0F766E' : outlineStroke}
            strokeWidth={selectedTrait === 'paws' ? 2.3 : 1.5}
          />
          <path d="M -5,23 L -3,40 L 6,40 L 6,23 Z" fill={legTipColor} />
          <ellipse
            cx="3"
            cy="41"
            rx={pawRadiusX}
            ry={pawRadiusY}
            fill={legTipColor}
            stroke={selectedTrait === 'paws' ? '#0F766E' : outlineStroke}
            strokeWidth={selectedTrait === 'paws' ? 2.2 : 1.4}
          />
        </g>

        {/* NECK RUFF */}
        <g
          transform={`translate(184, 96) scale(${1 + ruffOpacity * 0.25}, ${1 + ruffOpacity * 0.22})`}
          className="cursor-pointer"
          onClick={() => onSelectTrait('coat')}
        >
          <path
            d="M -16,-10 C -6,-20 14,-16 18,4 C 18,18 2,24 -12,18 C -20,14 -22,0 -16,-10 Z"
            fill={bellyColor}
            stroke={outlineStroke}
            strokeWidth="1.3"
          />
        </g>

        {/* HEAD */}
        <g transform="translate(198, 82)">
          {/* Far Ear */}
          <g
            transform="translate(4, -18)"
            className="cursor-pointer"
            onClick={() => onSelectTrait('ears')}
          >
            <path
              d={`M -6,4 Q -${earWidth * 0.45},-${earHeight * 0.65} ${earTipCurve * 0.2},-${earHeight} Q ${earWidth * 0.55},-${earHeight * 0.65} ${earWidth * 0.5},4 Z`}
              fill={coatColor}
              stroke={selectedTrait === 'ears' ? '#0F766E' : outlineStroke}
              strokeWidth={selectedTrait === 'ears' ? 2.4 : 1.5}
            />
            <path
              d={`M -2,2 Q -${earWidth * 0.25},-${earHeight * 0.55} ${earTipCurve * 0.2},-${earHeight * 0.82} Q ${earWidth * 0.32},-${earHeight * 0.5} ${earWidth * 0.3},2 Z`}
              fill={earInnerColor}
            />
          </g>

          {/* Cranium & Cheek Ruff */}
          <path
            d={`M -22,4 C -24,-14 -8,-22 10,-20 C 24,-18 32,-6 32,4 C 32,14 22,22 2,22 C -14,22 -21,14 -22,4 Z`}
            fill={coatColor}
            stroke={outlineStroke}
            strokeWidth="1.6"
          />
          {/* White/Cream Cheek Mask */}
          <path
            d="M -14,8 C -4,4 16,6 28,8 C 20,19 2,22 -14,14 Z"
            fill={bellyColor}
          />
          {/* Muzzle */}
          <path
            d="M 22,-3 L 46,4 C 48,7 45,12 40,12 L 20,12 Z"
            fill={coatColor}
            stroke={outlineStroke}
            strokeWidth="1.5"
          />
          <path d="M 22,6 L 44,7 C 44,11 40,12 22,12 Z" fill={bellyColor} />
          {/* Nose */}
          <ellipse cx="45" cy="5.5" rx="3.5" ry="2.8" fill="#1E293B" />

          {/* Eye */}
          <ellipse cx="18" cy="-2" rx="3.4" ry="3.8" fill="#1E293B" />
          <circle cx="19.2" cy="-3.2" r="1.1" fill="#FFFFFF" />

          {/* Near Ear (Primary Interactive Ear) */}
          <g
            transform="translate(-9, -15) rotate(-8)"
            className="cursor-pointer"
            onClick={() => onSelectTrait('ears')}
          >
            <path
              d={`M -8,6 Q -${earWidth * 0.6},-${earHeight * 0.7} 0,-${earHeight} Q ${earWidth * 0.65},-${earHeight * 0.7} ${earWidth * 0.55},6 Z`}
              fill={coatColor}
              stroke={selectedTrait === 'ears' ? '#0F766E' : outlineStroke}
              strokeWidth={selectedTrait === 'ears' ? 2.6 : 1.6}
            />
            <path
              d={`M -4,3 Q -${earWidth * 0.35},-${earHeight * 0.58} 0,-${earHeight * 0.84} Q ${earWidth * 0.38},-${earHeight * 0.55} ${earWidth * 0.34},3 Z`}
              fill={earInnerColor}
            />
            {/* Heat-radiating blood vessels visible when earVesselGlow is active */}
            {earVesselGlow > 0.15 && (
              <g
                stroke="#DC2626"
                strokeWidth="1.1"
                fill="none"
                opacity={earVesselGlow * 0.75}
                strokeLinecap="round"
              >
                <path d={`M 0,1 L 0,-${earHeight * 0.65}`} />
                <path d={`M 0,-${earHeight * 0.25} L -${earWidth * 0.18},-${earHeight * 0.48}`} />
                <path d={`M 0,-${earHeight * 0.38} L ${earWidth * 0.2},-${earHeight * 0.6}`} />
              </g>
            )}
          </g>
        </g>

        {/* Thermal Stress Visual Cue (subtle shiver lines or heat shimmer) */}
        {thermalStatus === 'Cold Stress' && (
          <g stroke="#0284C7" strokeWidth="1.4" fill="none" opacity="0.75">
            <path d="M 105,65 Q 100,72 105,79" />
            <path d="M 98,67 Q 93,74 98,81" />
          </g>
        )}
        {thermalStatus === 'Heat Stress' && (
          <g stroke="#DC2626" strokeWidth="1.4" fill="none" opacity="0.75">
            <path d="M 135,58 Q 140,51 135,44" />
            <path d="M 150,58 Q 155,51 150,44" />
          </g>
        )}

        {/* Interactive Hotspot Pins */}
        <g>
          {/* Ears hotspot */}
          <circle
            cx="192"
            cy={Math.max(20, 62 - earHeight * 0.45)}
            r={selectedTrait === 'ears' ? 6 : 4.5}
            fill={selectedTrait === 'ears' ? '#0F766E' : '#FFFFFF'}
            stroke="#0F766E"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => onSelectTrait('ears')}
          />
          {/* Coat hotspot */}
          <circle
            cx="144"
            cy="112"
            r={selectedTrait === 'coat' ? 6 : 4.5}
            fill={selectedTrait === 'coat' ? '#0F766E' : '#FFFFFF'}
            stroke="#0F766E"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => onSelectTrait('coat')}
          />
          {/* Paws hotspot */}
          <circle
            cx="180"
            cy="168"
            r={selectedTrait === 'paws' ? 6 : 4.5}
            fill={selectedTrait === 'paws' ? '#0F766E' : '#FFFFFF'}
            stroke="#0F766E"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => onSelectTrait('paws')}
          />
          {/* Tail/Body hotspot */}
          <circle
            cx="74"
            cy="126"
            r={selectedTrait === 'body' ? 6 : 4.5}
            fill={selectedTrait === 'body' ? '#0F766E' : '#FFFFFF'}
            stroke="#0F766E"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={() => onSelectTrait('body')}
          />
        </g>
      </g>
    </svg>
  );
};
