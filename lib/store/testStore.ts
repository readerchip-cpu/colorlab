import { create } from 'zustand';
import type { TestAnswers } from '@/types';

type MultiKey = 'Q3' | 'Q9' | 'Q10';

interface TestStore {
  currentStep: number; // 0 = Q1, 9 = Q10
  answers: Partial<TestAnswers>;
  isLoading: boolean;
  setAnswer: (key: keyof TestAnswers, value: string) => void;
  toggleMultiAnswer: (key: MultiKey, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useTestStore = create<TestStore>((set) => ({
  currentStep: 0,
  answers: {},
  isLoading: false,
  setAnswer: (key, value) =>
    set((state) => ({ answers: { ...state.answers, [key]: value } })),
  toggleMultiAnswer: (key, value) =>
    set((state) => {
      const current = (state.answers[key] as string[] | undefined) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { answers: { ...state.answers, [key]: next } };
    }),
  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 9) })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ currentStep: 0, answers: {}, isLoading: false }),
}));
