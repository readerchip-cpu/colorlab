import type { PersonalColorType } from './index';
import type { CosmeticProduct } from '@/lib/data/cosmetics';

interface SeasonalLook {
  title: string;
  description: string;
  mustHaves: Array<{ icon: string; label: string }>;
  colors: Array<{ name: string; hex: string }>;
}

export interface Celebrity {
  id?: string;
  name: string;
  profession?: string;
  similarity?: string;
  iconicLook?: string;
  signatureColors?: string[];
}

export interface ReportData {
  meta: {
    typeName: string;
    typeNameKr: PersonalColorType;
    toneStrength?: string;
    accentColor: string;       // injected in page.tsx (not from Claude)
    customerName?: string;
    analysisDate?: string;
  };
  palette: {
    best: Array<{ hex: string; name: string; mood?: string }>;
    worst: Array<{ hex: string; name: string; reason?: string }>;
    stylingNotes?: string[];
  };
  personalIntro: {
    greeting: string;
    colorTypeDescription: {
      summary: string;
      characteristics: string[];
      bestFor: string;
    };
    photoImpression: string;
    keyFinding: string;
  };
  analysis: {
    quadrant: { warmCool: number; lightDeep: number };
    fourAttributes: { hue: string; value: string; chroma: string; clarity: string };
    base: string;
    contrast: string;
    keyInsight?: string;
  };
  makeup: {
    lipstick: CosmeticProduct[];
    foundation: CosmeticProduct[];
    eyeshadow: CosmeticProduct[];
    blusher: CosmeticProduct[];
    tips?: string[];
  };
  hair: {
    recommended: Array<{ name: string; description: string }>;
    avoid?: Array<{ name: string; reason: string }>;
  };
  fashion: {
    main: string[];
    sub: string[];
    accent: string[];
    tips?: string[];
  };
  seasonalStyling: {
    spring: SeasonalLook;
    summer: SeasonalLook;
    fall: SeasonalLook;
    winter: SeasonalLook;
  };
  celebrities?: Celebrity[];
  customAdvice?: {
    isRelated: boolean;
    answer: string;
  };
}
