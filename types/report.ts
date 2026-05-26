import type { PersonalColorType } from './index';

interface SeasonalLook {
  title: string;
  description: string;
  mustHaves: Array<{ icon: string; label: string }>;
  colors: Array<{ name: string; hex: string }>;
}

export interface Celebrity {
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
    toneStrength: string;
    accentColor: string;
  };
  palette: {
    best: Array<{ hex: string; name: string }>;
    worst: Array<{ hex: string; name: string }>;
    stylingNotes?: string[];
  };
  personalIntro: {
    greeting: string;
    colorTypeDescription: {
      summary: string;
      characteristics: [string, string, string];
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
    lip: Array<{ hex: string; name: string }>;
    foundation: Array<{ hex: string; name: string }>;
    eyeshadow: Array<{ hex: string; name: string }>;
    blush: Array<{ hex: string; name: string }>;
    tips?: string[];
  };
  hair: {
    recommended: Array<{ name: string; desc: string }>;
    avoid: string;
  };
  fashion: {
    main: string;
    sub: string;
    accent: string;
    tip: string;
  };
  seasonalStyling: {
    spring: SeasonalLook;
    summer: SeasonalLook;
    autumn: SeasonalLook;
    winter: SeasonalLook;
  };
  celebrities?: Celebrity[];
  customAdvice?: {
    isRelated: boolean;
    answer: string;
  };
}
