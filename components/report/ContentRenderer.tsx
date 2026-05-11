import React from 'react';

interface Props {
  content: string;
}

// hex 색상 코드 → 인라인 컬러 칩
function renderHexColors(text: string, keyPrefix: string): React.ReactNode {
  const parts = text.split(/(#[0-9A-Fa-f]{6})/g);
  return parts.map((part, i) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(part)) {
      return (
        <span
          key={`${keyPrefix}-c${i}`}
          className="mx-0.5 inline-flex items-center gap-1 align-middle"
        >
          <span
            className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-white shadow"
            style={{ backgroundColor: part }}
          />
          <span className="font-mono text-[11px] text-gray-500">{part}</span>
        </span>
      );
    }
    return <React.Fragment key={`${keyPrefix}-t${i}`}>{part}</React.Fragment>;
  });
}

// **bold** + hex 색상 인라인 처리
function renderInline(text: string, keyPrefix: string): React.ReactNode {
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((part, i) => {
    const k = `${keyPrefix}-b${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={k} className="font-semibold text-gray-900 dark:text-gray-100">
          {renderHexColors(part.slice(2, -2), k)}
        </strong>
      );
    }
    return <React.Fragment key={k}>{renderHexColors(part, k)}</React.Fragment>;
  });
}

export default function ContentRenderer({ content }: Props) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) { i++; continue; }

    // 하위 섹션 제목 (###)
    if (trimmed.startsWith('### ')) {
      nodes.push(
        <p key={`h-${i}`} className="mt-4 mb-1.5 text-sm font-bold text-gray-800 dark:text-gray-200">
          {trimmed.replace(/^### /, '')}
        </p>,
      );
      i++;
      continue;
    }

    // 목록
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-2.5 space-y-2 pl-0.5">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              <span className="mt-[7px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-300" />
              <span>{renderInline(item, `li-${i}-${j}`)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // 일반 단락
    nodes.push(
      <p key={`p-${i}`} className="my-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {renderInline(trimmed, `p-${i}`)}
      </p>,
    );
    i++;
  }

  return <div className="space-y-0.5">{nodes}</div>;
}
