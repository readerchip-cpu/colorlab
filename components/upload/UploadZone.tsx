'use client';

import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import ReviewSlider from '@/components/loading/ReviewSlider';

interface Props {
  sessionId: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'] as const;

// 분석 단계별 메시지 (각 단계 약 4~5초)
const PHASES = [
  '이미지 분석 준비 중...',
  'AI가 피부 톤을 읽고 있어요...',
  '명도와 채도를 계산하고 있어요...',
  '퍼스널컬러 타입 매핑 중...',
  '맞춤 리포트를 작성하고 있어요...',
];

export default function UploadZone({ sessionId }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [freeConcern, setFreeConcern] = useState('');
  const [customerName, setCustomerName] = useState('');

  const validate = useCallback((f: File): string | null => {
    if (!(ALLOWED as readonly string[]).includes(f.type))
      return 'JPG, PNG, WebP 형식만 업로드 가능해요.';
    if (f.size > MAX_BYTES) return '파일 크기는 10MB 이하여야 해요.';
    return null;
  }, []);

  const applyFile = useCallback((f: File) => {
    const err = validate(f);
    if (err) { setFileError(err); return; }
    setFileError(null);
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, [validate]);

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  /* ── Drag & Drop ── */
  const onDragOver = (e: DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) applyFile(f);
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) applyFile(f);
  };

  /* ── 분석 시작 ── */
  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setApiError(null);
    setProgress(0);
    setPhaseIdx(0);

    // 진행률 시뮬레이션 (최대 88%까지 자연스럽게 증가)
    let p = 0;
    let phase = 0;
    timerRef.current = setInterval(() => {
      p = Math.min(p + (Math.random() * 2.5 + 0.5), 88);
      setProgress(p);
      const newPhase = Math.min(Math.floor(p / 17), PHASES.length - 1);
      if (newPhase !== phase) { phase = newPhase; setPhaseIdx(newPhase); }
    }, 400);

    const stopAll = () => {
      clearInterval(timerRef.current!);
      clearInterval(pollRef.current!);
    };

    try {
      const form = new FormData();
      form.append('session_id', sessionId);
      form.append('image', file);
      form.append('free_concern', freeConcern);
      form.append('customer_name', customerName);

      const res = await fetch('/api/analyze', { method: 'POST', body: form });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      // 분석이 백그라운드에서 시작됨 — 폴링으로 완료 확인
      const startedAt = Date.now();
      const MAX_WAIT_MS = 5 * 60 * 1000; // 5분

      pollRef.current = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/analyze/status?sessionId=${sessionId}`);
          const { status } = await statusRes.json() as { status: string };

          if (status === 'completed') {
            stopAll();
            setProgress(100);
            setPhaseIdx(PHASES.length - 1);
            setTimeout(() => router.push(`/report/${sessionId}`), 600);
          } else if (status === 'failed') {
            stopAll();
            setIsAnalyzing(false);
            setProgress(0);
            setPhaseIdx(0);
            setApiError('분석에 실패했어요. 다시 시도해주세요.');
          } else if (Date.now() - startedAt > MAX_WAIT_MS) {
            // 5분 초과 — 리포트 페이지에서 확인하도록 이동
            stopAll();
            setProgress(100);
            setPhaseIdx(PHASES.length - 1);
            setTimeout(() => router.push(`/report/${sessionId}`), 600);
          }
        } catch {
          // 폴링 일시 실패 — 계속 대기
        }
      }, 5000);

    } catch (err) {
      stopAll();
      setIsAnalyzing(false);
      setProgress(0);
      setPhaseIdx(0);
      setApiError(
        err instanceof Error && err.message.includes('401')
          ? '결제 정보를 확인할 수 없어요. 다시 시도해주세요.'
          : '분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  /* ── 분석 중 오버레이 ── */
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-8">
        {/* 스피너 */}
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-violet-100 border-t-[#7C3AED]" />
          <span className="text-2xl">🎨</span>
        </div>

        {/* 상태 텍스트 + 진행 바 */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {PHASES[phaseIdx]}
          </p>
          <div className="h-1.5 w-56 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-[#7C3AED] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">최대 20초 소요될 수 있어요</p>
        </div>

        {/* 리뷰 슬라이더 */}
        <ReviewSlider />
      </div>
    );
  }

  return (
    <div>
      {/* 업로드 영역 */}
      {!preview ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="사진 업로드 영역"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed py-14 transition-all duration-150',
            isDragging
              ? 'border-violet-400 bg-violet-50'
              : 'border-gray-200 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/40',
          )}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <UploadIcon />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-700">
              사진을 드래그하거나 클릭해 업로드
            </p>
            <p className="mt-1 text-xs text-gray-400">JPG · PNG · WebP · 최대 10MB</p>
          </div>
        </div>
      ) : (
        /* 미리보기 */
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={preview}
            alt="업로드된 사진 미리보기"
            width={600}
            height={600}
            className="max-h-80 w-full object-cover"
            unoptimized
          />
          <button
            onClick={removeFile}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-opacity hover:bg-black/70"
            aria-label="사진 제거"
          >
            ✕
          </button>
          <div className="bg-black/30 px-4 py-2 text-center">
            <p className="truncate text-xs text-white/80">{file?.name}</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED.join(',')}
        className="hidden"
        onChange={onChange}
        aria-hidden="true"
      />

      {/* 파일 유효성 오류 */}
      {fileError && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-500">
          {fileError}
        </p>
      )}

      {/* API 오류 */}
      {apiError && (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-500">
          {apiError}
        </p>
      )}

      {/* 이름 입력 */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          리포트에 표시될 이름을 알려주세요{' '}
          <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value.slice(0, 10))}
            placeholder="예: 김지은"
            maxLength={10}
            className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-violet-300 focus:bg-white"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-300">
            {customerName.length}/10
          </span>
        </div>
      </div>

      {/* 자유 고민 입력 */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          마지막으로, 더 알고 싶은 고민이 있다면 적어주세요{' '}
          <span className="font-normal text-gray-400">(선택)</span>
        </label>
        <div className="relative">
          <textarea
            value={freeConcern}
            onChange={(e) => setFreeConcern(e.target.value.slice(0, 200))}
            placeholder="예: 쿨톤이라는데 왜 핑크가 안 어울리죠?"
            rows={3}
            className="w-full resize-none rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-300 focus:border-violet-300 focus:bg-white"
          />
          <span className="absolute bottom-3 right-4 text-xs text-gray-300">
            {freeConcern.length}/200
          </span>
        </div>
      </div>

      {/* 분석 버튼 */}
      <button
        onClick={handleAnalyze}
        disabled={!file || !customerName.trim() || isAnalyzing}
        className="mt-5 w-full rounded-2xl bg-[#7C3AED] py-4 text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        분석 시작하기 →
      </button>

      {file && (
        <button
          onClick={removeFile}
          className="mt-3 w-full rounded-2xl border-2 border-gray-100 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-200 hover:text-gray-700"
        >
          다른 사진 선택
        </button>
      )}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
        stroke="#7C3AED"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
