import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple, robust markdown processor for college answers
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let currentList: string[] = [];
  let isNumberedList = false;

  const flushList = (keyPrefix: number) => {
    if (currentList.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${keyPrefix}`} className="list-decimal pl-5 space-y-1 my-2 text-slate-700">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${keyPrefix}`} className="list-disc pl-5 space-y-1 my-2 text-slate-700">
            {currentList.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check headings
    if (trimmed.startsWith('### ')) {
      flushList(index);
      elements.push(
        <h3 key={`h3-${index}`} className="text-base font-bold text-slate-900 mt-3 mb-1.5 flex items-center gap-1.5">
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(index);
      elements.push(
        <h2 key={`h2-${index}`} className="text-lg font-bold text-slate-900 mt-4 mb-2">
          {trimmed.replace('## ', '')}
        </h2>
      );
      return;
    }

    // Check list items
    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (isNumberedList && currentList.length > 0) {
        flushList(index);
      }
      isNumberedList = false;
      currentList.push(bulletMatch[1]);
      return;
    }

    const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numberMatch) {
      if (!isNumberedList && currentList.length > 0) {
        flushList(index);
      }
      isNumberedList = true;
      currentList.push(numberMatch[2]);
      return;
    }

    // Blank line
    if (!trimmed) {
      flushList(index);
      return;
    }

    // Callout quote or italic note
    if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.includes('**')) {
      flushList(index);
      elements.push(
        <div key={`note-${index}`} className="my-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/60 text-amber-900 text-xs italic">
          {trimmed.slice(1, -1)}
        </div>
      );
      return;
    }

    flushList(index);
    elements.push(
      <p key={`p-${index}`} className="my-1.5 text-slate-700 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
    );
  });

  flushList(lines.length);

  return <div className="space-y-1">{elements}</div>;
};

// Formats **bold**, *italic*, `code`, and [links](url)
function formatInlineMarkdown(text: string): string {
  let formatted = text;

  // Escaping basic HTML to prevent injection
  formatted = formatted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');

  // Inline code / tags
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-xs font-medium border border-slate-200/80">$1</code>');

  // Italic
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="text-slate-600 italic">$1</em>');

  // Links: [text](url)
  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline font-medium">$1</a>'
  );

  return formatted;
}
