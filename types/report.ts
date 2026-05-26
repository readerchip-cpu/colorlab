import type { PersonalColorType } from './index';

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
}
