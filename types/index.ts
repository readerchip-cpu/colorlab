// ============================================================
// PersonalColor
// ============================================================

export type PersonalColorType =
  | '봄 라이트'
  | '봄 브라이트'
  | '여름 라이트'
  | '여름 뮤트'
  | '가을 뮤트'
  | '가을 딥'
  | '겨울 브라이트'
  | '겨울 딥';

export type Season = '봄' | '여름' | '가을' | '겨울';

export type Tone = '웜톤' | '쿨톤';


// ============================================================
// Test
// ============================================================

export type QuestionCategory = '피부' | '눈' | '머리' | '스타일링' | '고민';

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: number;
  category: QuestionCategory;
  question: string;
  multiSelect: boolean;
  options: QuestionOption[];
}

export interface TestAnswers {
  Q1: string;
  Q2: string;
  Q3: string[]; // 다중 선택
  Q4: string;
  Q5: string;
  Q6: string;
  Q7: string;
  Q8: string;
  Q9: string[];  // 다중 선택
  Q10: string[]; // 다중 선택
}


// ============================================================
// Supabase 테이블 매핑
// ============================================================

export interface TestSession {
  id: string;
  answers: TestAnswers;
  free_concern: string | null;
  result_type: PersonalColorType | null;
  is_paid: boolean;
  report_content: string | null;
  customer_name: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  session_id: string;
  order_id: string;
  payment_key: string | null;
  amount: number;
  status: 'pending' | 'done' | 'failed';
  email: string | null;
  created_at: string;
}


// ============================================================
// Result
// ============================================================

export interface FreeResult {
  sessionId: string;
  colorType: PersonalColorType;
  season: Season;
  tone: Tone;
  topColors: [string, string, string]; // hex 코드 3개
  summary: string;
}
