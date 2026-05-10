export interface ReportSection {
  number: number;
  title: string;
  content: string;
}

// "## 1. 정밀 타입 분석\n..." 형식의 마크다운을 섹션 배열로 파싱
export function parseReportSections(markdown: string): ReportSection[] {
  return markdown
    .split(/\n(?=## )/)
    .filter((chunk) => chunk.trimStart().startsWith('## '))
    .map((chunk) => {
      const lines = chunk.trim().split('\n');
      const heading = lines[0].replace(/^## /, '').trim();
      const match = heading.match(/^(\d+)\.\s+(.+)$/);
      if (!match) return null;
      return {
        number: parseInt(match[1]),
        title: match[2].trim(),
        content: lines.slice(1).join('\n').trim(),
      };
    })
    .filter((s): s is ReportSection => s !== null && s.number >= 1 && s.number <= 7);
}
