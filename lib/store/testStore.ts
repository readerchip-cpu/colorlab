import { create } from 'zustand';
import type { TestAnswers } from '@/types';

interface TestStore {
  currentStep: number; // 0 = Q1, 10 = Q11
  answers: Partial<TestAnswers>;
  isLoading: boolean;
  setAnswer: (key: keyof TestAnswers, value: string) => void;
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
  nextStep: () =>
    set((state) => ({ currentStep: Math.min(state.currentStep + 1, 10) })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(state.currentStep - 1, 0) })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ currentStep: 0, answers: {}, isLoading: false }),
}));
