'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
} from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnalysisProgress } from '@/components/loading/AnalysisProgress';
import ReviewSlider from '@/components/loading/ReviewSlider';

interface Props {
  sessionId: string;
}

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'] as const;

export default function UploadZone({ sessionId }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [freeConcern, setFreeConcern] = useState('');
  const [customerName, setCustomerName] = useState('');

  // 분석 중 페이지 이탈 경고
  useEffect(() => {
    if (!isAnalyzing) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '분석이 진행 중입니다. 페이지를 닫으면 결과가 손실될 수 있어요.';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isAnalyzing]);

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
    if (cameraInputRef.current) cameraInputRef.current.value = '';
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

      const { redirectUrl } = await res.json();
      setTimeout(() => router.push(redirectUrl), 400);
    } catch (err) {
      setIsAnalyzing(false);
      setApiError(
        err instanceof Error && err.message === '401'
          ? '결제 정보를 확인할 수 없어요. 다시 시도해주세요.'
          : '분석 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  /* ── 분석 중 전체화면 오버레이 ── */
  if (isAnalyzing) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-gray-900">
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          <AnalysisProgress customerName={customerName || '고객'} />
          <div className="mt-6 w-full max-w-md px-6">
            <p className="mb-3 text-center text-xs text-gray-500 dark:text-gray-400">
              기다리는 동안 다른 분들의 후기를 확인해보세요
            </p>
            <ReviewSlider />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 업로드 영역 */}
      {!preview ? (
        <div className="space-y-3">
          {/* 1순위: 지금 바로 셀카 찍기 */}
          <label className="block cursor-pointer">
            <input
              ref={cameraInputRef}
              type="file"
              accept={ALLOWED.join(',')}
              capture="user"
              onChange={onChange}
              className="hidden"
              aria-label="셀카 찍기"
            />
            <div className="bg-[#7C3AED] hover:opacity-90 active:opacity-80 text-white font-bold py-4 px-6 rounded-2xl text-center shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2">
              <span className="text-xl">📷</span>
              <span>지금 바로 셀카 찍기</span>
            </div>
          </label>

          {/* 2순위: 갤러리에서 선택 */}
          <label className="block cursor-pointer">
            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED.join(',')}
              onChange={onChange}
              className="hidden"
              aria-label="갤러리에서 선택"
            />
            <div className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-2xl text-center text-sm transition-all flex items-center justify-center gap-2">
              <span>🖼️</span>
              <span>갤러리에서 선택하기</span>
            </div>
          </label>

          <p className="text-center text-xs text-gray-400 pt-1">JPG · PNG · WebP · 최대 10MB</p>
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

      {/* 소요 시간 안내 */}
      <p className="mt-3 text-center text-xs text-gray-400">
        분석에는 약 1분 30초 ~ 2분 소요돼요
      </p>

      {/* 분석 버튼 */}
      <button
        onClick={handleAnalyze}
        disabled={!file || !customerName.trim() || isAnalyzing}
        className="mt-3 w-full rounded-2xl bg-[#7C3AED] py-4 text-base font-bold text-white shadow-lg shadow-violet-200 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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
