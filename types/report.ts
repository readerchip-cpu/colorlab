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
}
