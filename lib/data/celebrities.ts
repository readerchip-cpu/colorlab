import type { PersonalColorType } from '@/types';

export interface CelebrityEntry {
  id: string;
  name: string;
  profession: string;
}

const CELEBRITY_DB: Record<PersonalColorType, CelebrityEntry[]> = {
  '봄 라이트': [
    { id: 'iu',            name: '아이유',   profession: '가수·배우' },
    { id: 'park-boyoung',  name: '박보영',   profession: '배우' },
    { id: 'jung-chaeyeon', name: '정채연',   profession: '가수·배우' },
    { id: 'han-jimin',     name: '한지민',   profession: '배우' },
  ],
  '봄 브라이트': [
    { id: 'karina',       name: '카리나',   profession: '가수' },
    { id: 'winter',       name: '윈터',     profession: '가수' },
    { id: 'park-eunbin',  name: '박은빈',   profession: '배우' },
    { id: 'kim-yoojung',  name: '김유정',   profession: '배우' },
  ],
  '여름 라이트': [
    { id: 'kim-dami',    name: '김다미',   profession: '배우' },
    { id: 'kim-jiwon',   name: '김지원',   profession: '배우' },
    { id: 'park-soi',    name: '박소이',   profession: '배우' },
    { id: 'chae-subin',  name: '채수빈',   profession: '배우' },
  ],
  '여름 뮤트': [
    { id: 'han-sohee',    name: '한소희',   profession: '배우' },
    { id: 'jung-yoomi',   name: '정유미',   profession: '배우' },
    { id: 'song-hyekyo',  name: '송혜교',   profession: '배우' },
    { id: 'lee-eunsaem',  name: '이은샘',   profession: '모델' },
  ],
  '가을 뮤트': [
    { id: 'kim-taeri',      name: '김태리',   profession: '배우' },
    { id: 'park-seojun',    name: '박서준',   profession: '배우' },
    { id: 'han-yeseul',     name: '한예슬',   profession: '배우' },
    { id: 'lee-sungkyung',  name: '이성경',   profession: '배우·모델' },
  ],
  '가을 딥': [
    { id: 'jeon-jihyun',  name: '전지현',   profession: '배우' },
    { id: 'kim-heeae',    name: '김희애',   profession: '배우' },
    { id: 'gong-hyojin',  name: '공효진',   profession: '배우' },
  ],
  '겨울 브라이트': [
    { id: 'jennie',       name: '제니',     profession: '가수' },
    { id: 'cha-eunwoo',   name: '차은우',   profession: '가수·배우' },
    { id: 'lee-dohyun',   name: '이도현',   profession: '배우' },
  ],
  '겨울 딥': [
    { id: 'kim-hyesoo',   name: '김혜수',   profession: '배우' },
    { id: 'song-joongki', name: '송중기',   profession: '배우' },
    { id: 'kim-dami-deep', name: '김다미',  profession: '배우' },
  ],
};

export function getCelebritiesByType(colorType: PersonalColorType): CelebrityEntry[] {
  return CELEBRITY_DB[colorType] ?? [];
}
