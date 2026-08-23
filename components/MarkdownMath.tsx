'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export function MarkdownMath({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);

  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <p key={i} className="text-[15px] leading-6 text-primaryText">
          {renderInline(block)}
        </p>
      ))}
    </div>
  );
}

function renderInline(text: string) {
  const parts = text.split(/(\$\$[^$]+\$\$)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      return <BlockMath key={idx} math={part.slice(2, -2)} />;
    }
    return <span key={idx}>{renderInlineMathAndBold(part)}</span>;
  });
}

function renderInlineMathAndBold(text: string) {
  const segments = text.split(/(\$[^$]+\$|\*\*[^*]+\*\*)/g);
  return segments.map((seg, idx) => {
    if (seg.startsWith('$') && seg.endsWith('$') && seg.length > 1) {
      return <InlineMath key={idx} math={seg.slice(1, -1)} />;
    }
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return <span key={idx}>{seg}</span>;
  });
}
