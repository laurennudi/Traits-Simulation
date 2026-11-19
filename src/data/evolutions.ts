export type BiomeId = 'arctic' | 'desert' | 'forest';

export type TraitPartId = 'ears' | 'coat' | 'paws' | 'body';

export type GenerationStep = 0 | 1 | 2 | 3;

export interface GenerationMilestone {
  step: GenerationStep;
  shortLabel: string;
  timeHorizon: string;
  title: string;
  subtitle: string;
  whatChanged: string;
  whyItChanged: string;
  traitHighlight: string;
}

export interface BiomeDefinition {
  id: BiomeId;
  name: string;
  speciesName: string;
  scientificName: string;
  imagePath: string;
  accentHex: string;
  badgeText: string;
  climateSummary: string;
  survivalChallenges: string[];
  defaultTempC: number;
  defaultCoverPct: number;
  defaultFoodPct: number;
  coverLabel: string;
  foodLabel: string;
  targetEarScale: number; // 1.0 = ancestral baseline
  targetFurThickness: number; // 0.35 = thin desert, 1.8 = thick arctic
  targetBodyMass: number; // relative compactness / visual fullness
  targetPawPadding: number; // 1.0 = baseline, 1.75 = dense fur soles
  targetCoatColor: string;
  summerOrShiftCoatColor: string;
  generationMilestones: Record<GenerationStep, GenerationMilestone>;
  traits: Record<
    TraitPartId,
    {
      label: string;
      changeSummary: string;
      environmentCause: string;
      survivalNeed: string;
    }
  >;
}

export interface ComputedFoxTraits {
  earScale: number;
  earRoundness: number; // 0 = pointed, 1 = rounded
  earVesselGlow: number; // 0..1 heat radiation through ears
  furThickness: number; // 0.35..1.9
  pawPadding: number; // 0.85..1.8
  bodyMassScale: number; // visual compactness
  tailFluff: number; // 0.7..1.7
  coatColor: string;
  bellyColor: string;
  earInnerColor: string;
  legTipColor: string;
  camouflageMatch: number; // 0..100%
  thermalBalanceScore: number; // 0..100%
  estimatedBodyTempC: number;
  thermalStatus: 'Nominal' | 'Cold Stress' | 'Heat Stress';
  foragingEnergyScore: number; // 0..100%
  survivalRate: number; // 0..100%
  adaptationStageLabel: string;
  causeEffectExplanation: string;
}

export interface TrialObservation {
  id: string;
  biomeId: BiomeId;
  biomeName: string;
  speciesLabel: string;
  generation: number;
  temperatureC: number;
  groundCoverPct: number;
  foodSupplyPct: number;
  camouflageMatch: number;
  thermalStatus: 'Nominal' | 'Cold Stress' | 'Heat Stress';
  foragingEnergyScore: number;
  survivalRate: number;
  keyTraitNote: string;
  recordedAt: string;
}

export const ANCESTOR_FOX = {
  name: 'Early Ancestral Fox',
  scientificName: 'Genus Vulpes (ancestral lineage)',
  imagePath: '/src/assets/images/specimen_ancestor_fox_1794862400184.jpg',
  habitatSummary: 'Cool to mild ancestral Eurasia & high-altitude plateaus',
  coatColor: '#8B7B6B',
  bellyColor: '#DDD5CA',
  earInnerColor: '#C4A89B',
  legTipColor: '#4A3F37',
  earScale: 1.0,
  furThickness: 1.0,
  pawPadding: 1.0,
  bodyMassScale: 1.0,
  tailFluff: 1.0,
  traits: {
    ears: 'Medium upright ears (moderate hearing and heat exchange)',
    coat: 'Gray-brown fur suited for rocky terrain and seasonal grass',
    paws: 'Standard padded paws for soil and rocky ground',
    body: 'Medium-proportioned frame with an average-length muzzle and tail',
  },
};

export const BIOMES: Record<BiomeId, BiomeDefinition> = {
  arctic: {
    id: 'arctic',
    name: 'Arctic Tundra',
    speciesName: 'Arctic Fox',
    scientificName: 'Vulpes lagopus',
    imagePath: '/src/assets/images/specimen_arctic_fox_1794862399836.jpg',
    accentHex: '#0284C7',
    badgeText: 'Frozen Tundra',
    climateSummary: 'Sub-zero winds (-22°C), long snowy winters, scarce winter prey.',
    survivalChallenges: [
      'Conserving body heat in freezing sub-zero winds',
      'Camouflaging on snow-covered winter tundra (while coastal morphs stay darker on bare rock)',
      'Walking on snow and ice without losing heat through paws',
    ],
    defaultTempC: -22,
    defaultCoverPct: 90,
    defaultFoodPct: 65,
    coverLabel: 'Snow & Ice Cover',
    foodLabel: 'Lemmings & Tundra Forage',
    targetEarScale: 0.66,
    targetFurThickness: 1.78,
    targetBodyMass: 1.15,
    targetPawPadding: 1.75,
    targetCoatColor: '#F4F7FA',
    summerOrShiftCoatColor: '#7D6E5D',
    generationMilestones: {
      0: {
        step: 0,
        shortLabel: 'Start',
        timeHorizon: 'Start (Ancestral Fox)',
        title: 'Ancestral Fox (Starting Population)',
        subtitle: 'Entering cold, snowy Pleistocene habitats',
        whatChanged:
          'No specialized cold adaptations yet — this ancestral fox still has medium ears and gray-brown fur.',
        whyItChanged:
          'In freezing snow, gray-brown fur stands out to predators and medium ears lose body heat rapidly. Fossil and DNA evidence shows rapid climate shifts could even wipe out local groups that could not keep up.',
        traitHighlight: 'Medium ears · Gray-brown fur · Standard paws',
      },
      1: {
        step: 1,
        shortLabel: 'Stage 1',
        timeHorizon: 'Stage 1 (many generations later)',
        title: 'Stage 1: Denser, Lighter Underfur',
        subtitle: 'Foxes with thicker, paler coats survive cold winters better',
        whatChanged:
          'Over many generations, individuals born with denser underfur and paler coats survived better and passed those traits on, while ears became slightly shorter.',
        whyItChanged:
          'Freezing -22°C winds and snowy ground favored foxes that conserved warmth and blended into snow. (In snow-free coastal zones, darker "blue" morphs remained common.)',
        traitHighlight: 'Denser pale coat · Slightly shorter ears',
      },
      2: {
        step: 2,
        shortLabel: 'Stage 2',
        timeHorizon: 'Stage 2 (hundreds of generations later)',
        title: 'Stage 2: Fur-Covered Paws & Compact Shape',
        subtitle: 'Conserving heat on ice and snow',
        whatChanged:
          'Dense fur grew over the soles of the paws, ears became shorter and rounder, and the tail grew bushier.',
        whyItChanged:
          'Smaller rounded ears and a compact shape reduce heat-losing surface area (Allen’s rule), while fur-covered paw soles insulate against freezing ice and snow.',
        traitHighlight: 'Furry paw soles · Rounder ears · Bushy tail',
      },
      3: {
        step: 3,
        shortLabel: 'Stage 3',
        timeHorizon: 'Stage 3 (thousands of generations later)',
        title: 'Stage 3: Adapted Arctic Fox (Vulpes lagopus)',
        subtitle: 'Specialized for the circumpolar tundra',
        whatChanged:
          'The population now has a thick, seasonal white winter coat (shedding to brown in summer), compact rounded ears, fur-cushioned paws, and a dense insulating tail.',
        whyItChanged:
          'Each generation shaped traits to match extreme cold and snow—though ancient DNA research (PMC10740874) reminds us that when climates warm rapidly, local populations can disappear if habitats vanish faster than traits can shift.',
        traitHighlight: 'Seasonal white coat · Compact ears · Fur-soled paws',
      },
    },
    traits: {
      ears: {
        label: 'Short, Rounded Ears',
        changeSummary: 'Ears became shorter and rounder with thick fur.',
        environmentCause: 'Freezing polar air rapidly drains heat from large exposed surfaces.',
        survivalNeed: 'Smaller surface area reduces heat loss in sub-zero winters (Allen’s rule).',
      },
      coat: {
        label: 'Dense Seasonal Winter Coat',
        changeSummary: 'Multi-layered underfur turns white in snowy winter and brown in summer.',
        environmentCause: 'Seasonal snow cover and frigid wind.',
        survivalNeed: 'Traps insulating air for warmth and camouflages the fox against snow.',
      },
      paws: {
        label: 'Fur-Covered Paw Soles',
        changeSummary: 'Dense fur covers the undersides of the paws.',
        environmentCause: 'Icy ground and deep snow.',
        survivalNeed: 'Protects paws from freezing and gives grip on slick snow and ice.',
      },
      body: {
        label: 'Compact Shape & Insulating Tail',
        changeSummary: 'Compact frame (~3–4.5 kg) with shorter muzzle and very fluffy tail.',
        environmentCause: 'Long freezing winters and scarce winter prey.',
        survivalNeed: 'Reduces heat loss; the fox curls its bushy tail around its nose while sleeping.',
      },
    },
  },
  desert: {
    id: 'desert',
    name: 'Arid Desert',
    speciesName: 'Fennec Desert Fox',
    scientificName: 'Vulpes zerda',
    imagePath: '/src/assets/images/specimen_desert_fox_1794862400729.jpg',
    accentHex: '#D97706',
    badgeText: 'Arid Sand Dunes',
    climateSummary: 'Scorching daytime sun (+40°C), bright sand dunes, burrowing insects & lizards.',
    survivalChallenges: [
      'Releasing excess body heat without losing precious water',
      'Blending into bright golden sand dunes',
      'Hearing tiny insects and lizards moving beneath the sand',
    ],
    defaultTempC: 40,
    defaultCoverPct: 88,
    defaultFoodPct: 55,
    coverLabel: 'Bright Sand Dunes',
    foodLabel: 'Desert Insects & Lizards',
    targetEarScale: 1.85,
    targetFurThickness: 0.42,
    targetBodyMass: 0.78,
    targetPawPadding: 1.35,
    targetCoatColor: '#E8C99B',
    summerOrShiftCoatColor: '#B98C5E',
    generationMilestones: {
      0: {
        step: 0,
        shortLabel: 'Start',
        timeHorizon: 'Start (Ancestral Fox)',
        title: 'Ancestral Fox (Starting Population)',
        subtitle: 'Entering the hot Arid Desert',
        whatChanged:
          'No desert adaptations yet — this ancestral fox still has medium ears and darker gray-brown fur.',
        whyItChanged:
          'Under scorching +40°C sun and bright dunes, darker thicker fur traps too much heat and stands out against pale sand.',
        traitHighlight: 'Medium ears · Darker, thicker fur',
      },
      1: {
        step: 1,
        shortLabel: 'Stage 1',
        timeHorizon: 'Stage 1 (many generations later)',
        title: 'Stage 1: Taller Ears & Lighter Sandy Fur',
        subtitle: 'Better cooling and camouflage on dunes',
        whatChanged:
          'Over many generations, foxes with taller ears and thinner, lighter tan coats survived desert heat better and reproduced.',
        whyItChanged:
          'Hot air and bright sand favored traits that reflect sunlight and release heat faster.',
        traitHighlight: 'Taller ears · Lighter tan coat',
      },
      2: {
        step: 2,
        shortLabel: 'Stage 2',
        timeHorizon: 'Stage 2 (hundreds of generations later)',
        title: 'Stage 2: Heat-Radiating Ears & Leaner Body',
        subtitle: 'Built for desert heat and underground prey',
        whatChanged:
          'Ears grew much larger with abundant blood vessels, body size became smaller and leaner, and hair grew between paw pads.',
        whyItChanged:
          'Extra blood flow near the thin skin of large ears releases heat into the air, while hair on paw soles shields feet from hot sand.',
        traitHighlight: 'Large cooling ears · Leaner body · Hair-shielded paws',
      },
      3: {
        step: 3,
        shortLabel: 'Stage 3',
        timeHorizon: 'Stage 3 (thousands of generations later)',
        title: 'Stage 3: Adapted Fennec Fox (Vulpes zerda)',
        subtitle: 'Smallest fox species, thriving in arid dunes',
        whatChanged:
          'The population now has oversized heat-radiating ears, sleek pale cream-tan fur, and the smallest, lightest fox body (~1–1.5 kg).',
        whyItChanged:
          'Giant ears release body heat and detect insects moving underground, while pale sandy fur reflects sunlight and blends into the dunes.',
        traitHighlight: 'Giant cooling ears · Pale sandy fur · Small lightweight body',
      },
    },
    traits: {
      ears: {
        label: 'Oversized Heat-Radiating Ears',
        changeSummary: 'Ears grew up to 15 cm tall with dense blood vessels.',
        environmentCause: 'Extreme desert heat (+40°C) and underground prey.',
        survivalNeed: 'Releases excess body heat into the air and hears insects under sand.',
      },
      coat: {
        label: 'Thin Sandy-Tan Coat',
        changeSummary: 'Short, reflective pale cream-tan fur.',
        environmentCause: 'Intense sunlight and pale golden sand dunes.',
        survivalNeed: 'Reflects heat by day and camouflages seamlessly in sand.',
      },
      paws: {
        label: 'Hair-Shielded Paw Soles',
        changeSummary: 'Thick hair grows over the pads of slender paws.',
        environmentCause: 'Hot desert sand.',
        survivalNeed: 'Protects feet from scorching sand and helps grip loose dunes.',
      },
      body: {
        label: 'Small, Lightweight Body',
        changeSummary: 'Smallest fox species (~1–1.5 kg) with slender legs.',
        environmentCause: 'Hot climate and scarce desert food and water.',
        survivalNeed: 'Cools down faster and needs less food and water to survive.',
      },
    },
  },
  forest: {
    id: 'forest',
    name: 'Temperate Forest',
    speciesName: 'Woodland Red Fox',
    scientificName: 'Vulpes vulpes',
    imagePath: '/src/assets/images/specimen_forest_fox_1794862401690.jpg',
    accentHex: '#059669',
    badgeText: 'Temperate Woodland',
    climateSummary: 'Changing seasons (15°C), dappled shade, rustling leaf litter, fast woodland prey.',
    survivalChallenges: [
      'Camouflaging among fallen oak leaves, bark, and ferns',
      'Pinpointing and leaping onto fast mice in tall grass',
      'Adapting coat density as mild summers shift to cool autumns',
    ],
    defaultTempC: 15,
    defaultCoverPct: 85,
    defaultFoodPct: 78,
    coverLabel: 'Leaf Litter & Brush',
    foodLabel: 'Woodland Mice & Berries',
    targetEarScale: 1.18,
    targetFurThickness: 1.05,
    targetBodyMass: 1.04,
    targetPawPadding: 1.05,
    targetCoatColor: '#C85A28',
    summerOrShiftCoatColor: '#A86442',
    generationMilestones: {
      0: {
        step: 0,
        shortLabel: 'Start',
        timeHorizon: 'Start (Ancestral Fox)',
        title: 'Ancestral Fox (Starting Population)',
        subtitle: 'Entering the Temperate Forest',
        whatChanged:
          'No woodland specializations yet — this ancestral fox has a plain gray-brown coat and standard ears.',
        whyItChanged:
          'Among reddish-brown fallen leaves and shadowed forest brush, plain gray fur is easier for prey and predators to notice.',
        traitHighlight: 'Gray-brown coat · Medium ears',
      },
      1: {
        step: 1,
        shortLabel: 'Stage 1',
        timeHorizon: 'Stage 1 (many generations later)',
        title: 'Stage 1: Warmer Reddish Coat',
        subtitle: 'Blending into autumn leaves and tree bark',
        whatChanged:
          'Over many generations, coat color shifted toward warm reddish-orange as foxes matching the forest floor survived and hunted more successfully.',
        whyItChanged:
          'Fallen oak leaves, tree bark, and dappled sunlight favored warm russet-colored fur.',
        traitHighlight: 'Warm reddish fur · Alert ears',
      },
      2: {
        step: 2,
        shortLabel: 'Stage 2',
        timeHorizon: 'Stage 2 (hundreds of generations later)',
        title: 'Stage 2: Pointed Listening Ears & Dark Legs',
        subtitle: 'Tracking mice hidden under brush',
        whatChanged:
          'Ears became sharper and swiveling, lower legs darkened to black-brown, and the tail developed a white tip.',
        whyItChanged:
          'Directional ears pinpoint mice rustling under thick leaves, while dark legs blend into forest shadows.',
        traitHighlight: 'Pointed directional ears · Dark legs',
      },
      3: {
        step: 3,
        shortLabel: 'Stage 3',
        timeHorizon: 'Stage 3 (thousands of generations later)',
        title: 'Stage 3: Adapted Red Fox (Vulpes vulpes)',
        subtitle: 'Agile hunter of temperate woodlands',
        whatChanged:
          'The population now has a rich russet-red coat, dark agile legs, sharp directional ears, and a long bushy balance tail.',
        whyItChanged:
          'Russet fur conceals it in woodland cover while long legs and keen hearing let it leap accurately onto hidden prey.',
        traitHighlight: 'Russet-red coat · Directional ears · Balance tail',
      },
    },
    traits: {
      ears: {
        label: 'Alert Directional Ears',
        changeSummary: 'Pointed, swiveling dark-tipped ears.',
        environmentCause: 'Dense forest brush hides small prey from view.',
        survivalNeed: 'Pinpoints quiet rustling sounds under leaves for accurate pouncing.',
      },
      coat: {
        label: 'Russet-Red & White-Bellied Coat',
        changeSummary: 'Rich reddish-orange fur that grows denser in cool winter.',
        environmentCause: 'Warm brown bark, autumn leaves, and seasonal temperatures.',
        survivalNeed: 'Camouflages in woodland shadows and adjusts warmth between summer and winter.',
      },
      paws: {
        label: 'Agile Woodland Paws',
        changeSummary: 'Dark-stockinged slender legs with grippy claw pads.',
        environmentCause: 'Fallen logs, mossy rocks, and uneven forest soil.',
        survivalNeed: 'Supports silent stalking and quick leaps over brush.',
      },
      body: {
        label: 'Agile Frame & Balance Tail',
        changeSummary: 'Long flexible spine (~5–7 kg) with a white-tipped rudder tail.',
        environmentCause: 'Obstacles like logs, streams, and fast woodland prey.',
        survivalNeed: 'Aids balance during high leaps and provides warmth when curled in a den.',
      },
    },
  },
};

export const BIOME_ORDER: BiomeId[] = ['arctic', 'desert', 'forest'];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

export function lerpHex(hexA: string, hexB: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  return rgbToHex(lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t));
}

export function computeFoxTraits(
  biomeId: BiomeId,
  generationStep: GenerationStep
): ComputedFoxTraits {
  const biome = BIOMES[biomeId];
  const temperatureC = biome.defaultTempC;
  const foodSupplyPct = biome.defaultFoodPct;
  const evoProgress = generationStep / 3;

  const bodyMassScale = Number(
    lerp(ANCESTOR_FOX.bodyMassScale, biome.targetBodyMass, evoProgress).toFixed(2)
  );
  const furThickness = Number(
    lerp(ANCESTOR_FOX.furThickness, biome.targetFurThickness, evoProgress).toFixed(2)
  );
  const earScale = Number(
    lerp(ANCESTOR_FOX.earScale, biome.targetEarScale, evoProgress).toFixed(2)
  );
  const earRoundness =
    biomeId === 'arctic' ? lerp(0.15, 0.92, evoProgress) : lerp(0.15, 0.08, evoProgress);

  const earVesselGlow =
    biomeId === 'desert' && generationStep >= 2 ? lerp(0.2, 0.95, evoProgress) : 0;

  const pawPadding = Number(
    lerp(ANCESTOR_FOX.pawPadding, biome.targetPawPadding, evoProgress).toFixed(2)
  );
  const tailFluff = Number(
    lerp(
      ANCESTOR_FOX.tailFluff,
      biomeId === 'arctic' ? 1.62 : biomeId === 'forest' ? 1.32 : 0.85,
      evoProgress
    ).toFixed(2)
  );

  const coatColor = lerpHex(ANCESTOR_FOX.coatColor, biome.targetCoatColor, evoProgress);
  const bellyColor =
    biomeId === 'arctic'
      ? lerpHex(ANCESTOR_FOX.bellyColor, '#FFFFFF', evoProgress * 0.85)
      : biomeId === 'desert'
      ? lerpHex(ANCESTOR_FOX.bellyColor, '#FBF3E4', evoProgress)
      : lerpHex(ANCESTOR_FOX.bellyColor, '#F8F5F0', evoProgress);

  const earInnerColor =
    biomeId === 'desert'
      ? lerpHex('#C4A89B', '#F0B6A3', evoProgress)
      : biomeId === 'arctic'
      ? lerpHex('#C4A89B', '#DCE3EA', evoProgress)
      : '#D4A59A';

  const legTipColor =
    biomeId === 'forest'
      ? lerpHex(ANCESTOR_FOX.legTipColor, '#272320', evoProgress)
      : biomeId === 'arctic'
      ? lerpHex(ANCESTOR_FOX.legTipColor, '#E2E8F0', evoProgress)
      : lerpHex(ANCESTOR_FOX.legTipColor, '#D4B082', evoProgress);

  const [cr, cg, cb] = hexToRgb(coatColor);
  const coatLuminance = (0.299 * cr + 0.587 * cg + 0.114 * cb) / 255;

  let envTargetLuminance = 0.52;
  let envRednessBias = 0;
  if (biomeId === 'arctic') {
    envTargetLuminance = 0.91;
  } else if (biomeId === 'desert') {
    envTargetLuminance = 0.76;
  } else {
    envTargetLuminance = 0.48;
    envRednessBias = (cr - cb) / 255;
  }

  const lumDiff = Math.abs(coatLuminance - envTargetLuminance);
  let camoRaw = 96 - lumDiff * 145;
  if (biomeId === 'forest') {
    camoRaw = 94 - lumDiff * 120 + (envRednessBias > 0.2 ? 6 : -14);
  }
  const camouflageMatch = Math.round(Math.max(24, Math.min(98, camoRaw)));

  const requiredInsulation = lerp(1.93, 0.04, (temperatureC + 22) / 62);
  const effectiveInsulation = furThickness - (earScale - 1.0) * 0.45;
  const thermalDelta = effectiveInsulation - requiredInsulation;
  const absThermalError = Math.abs(thermalDelta);

  const thermalBalanceScore = Math.round(Math.max(20, Math.min(99, 100 - absThermalError * 68)));
  const estimatedBodyTempC = Number((38.5 + thermalDelta * 2.0).toFixed(1));
  let thermalStatus: 'Nominal' | 'Cold Stress' | 'Heat Stress' = 'Nominal';
  if (thermalDelta < -0.34) {
    thermalStatus = 'Cold Stress';
  } else if (thermalDelta > 0.34) {
    thermalStatus = 'Heat Stress';
  }

  const earForagingBonus =
    biomeId === 'desert'
      ? lerp(0, 18, (earScale - 1) / 0.85)
      : biomeId === 'forest'
      ? lerp(0, 14, evoProgress)
      : lerp(0, 10, evoProgress);
  const foragingRaw = foodSupplyPct * 0.75 + earForagingBonus + (thermalBalanceScore - 50) * 0.2;
  const foragingEnergyScore = Math.round(Math.max(25, Math.min(99, foragingRaw)));

  const survivalRate = Math.round(
    camouflageMatch * 0.38 + thermalBalanceScore * 0.36 + foragingEnergyScore * 0.26
  );

  const milestone = biome.generationMilestones[generationStep];

  return {
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
    camouflageMatch,
    thermalBalanceScore,
    estimatedBodyTempC,
    thermalStatus,
    foragingEnergyScore,
    survivalRate,
    adaptationStageLabel: milestone.title,
    causeEffectExplanation: milestone.whyItChanged,
  };
}

export const INITIAL_OBSERVATIONS: TrialObservation[] = [
  {
    id: 'baseline-arctic-start',
    biomeId: 'arctic',
    biomeName: 'Arctic Tundra',
    speciesLabel: 'Ancestral Fox (Start)',
    generation: 0,
    temperatureC: -22,
    groundCoverPct: 90,
    foodSupplyPct: 65,
    camouflageMatch: 38,
    thermalStatus: 'Cold Stress',
    foragingEnergyScore: 54,
    survivalRate: 45,
    keyTraitNote: 'Gray-brown fur stands out on white snow and medium ears lose heat rapidly.',
    recordedAt: 'Start',
  },
  {
    id: 'baseline-arctic-stage3',
    biomeId: 'arctic',
    biomeName: 'Arctic Tundra',
    speciesLabel: 'Arctic Fox (Stage 3)',
    generation: 3,
    temperatureC: -22,
    groundCoverPct: 90,
    foodSupplyPct: 65,
    camouflageMatch: 95,
    thermalStatus: 'Nominal',
    foragingEnergyScore: 76,
    survivalRate: 90,
    keyTraitNote:
      'Over many generations: thick white winter coat, rounded ears, and fur-soled paws conserve heat and blend into snow.',
    recordedAt: 'Stage 3',
  },
];
