import { Fragment, useState, type ReactNode } from 'react';
import { Check, Copy, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';
import type { LessonBlock } from '@/config/learning';
import { cn } from '@/lib/utils';

/**
 * Renders a lesson's structured content blocks. Paragraphs and list items
 * support a tiny inline syntax: **bold** and `inline code`.
 */

/** Parse a string with **bold** and `code` markers into React nodes. */
function renderInline(text: string): ReactNode {
  // Split on **bold** or `code`, keeping the delimiters via capture groups.
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Code copied to clipboard');
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy — select and copy manually');
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-[hsl(222_47%_11%)] text-slate-100 shadow-card">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">{language}</span>
        <button
          type="button"
          onClick={copy}
          data-testid="lesson-copy-code"
          aria-label="Copy code"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    wrap: 'border-emerald-500/30 bg-emerald-500/10',
    icontone: 'text-emerald-500',
    label: 'Tip',
  },
  note: {
    icon: Info,
    wrap: 'border-sky-500/30 bg-sky-500/10',
    icontone: 'text-sky-500',
    label: 'Note',
  },
  warning: {
    icon: TriangleAlert,
    wrap: 'border-amber-500/30 bg-amber-500/10',
    icontone: 'text-amber-500',
    label: 'Watch out',
  },
} as const;

function Callout({
  tone,
  title,
  text,
}: {
  tone: 'tip' | 'note' | 'warning';
  title?: string;
  text: string;
}) {
  const style = CALLOUT_STYLES[tone];
  const Icon = style.icon;
  return (
    <div className={cn('flex gap-3 rounded-xl border p-4', style.wrap)}>
      <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', style.icontone)} aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title ?? style.label}</p>
        <p className="text-sm text-muted-foreground">{renderInline(text)}</p>
      </div>
    </div>
  );
}

export function LessonContent({ blocks }: { blocks: LessonBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case 'heading':
            return (
              <h2
                key={i}
                className="scroll-mt-24 pt-2 text-xl font-bold tracking-tight text-foreground"
              >
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={i} className="text-[15px] leading-7 text-muted-foreground">
                {renderInline(block.text)}
              </p>
            );
          case 'list':
            return block.ordered ? (
              <ol
                key={i}
                className="ml-5 list-decimal space-y-2 text-[15px] leading-7 text-muted-foreground marker:text-primary marker:font-semibold"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    {renderInline(item)}
                  </li>
                ))}
              </ol>
            ) : (
              <ul
                key={i}
                className="ml-5 list-disc space-y-2 text-[15px] leading-7 text-muted-foreground marker:text-primary"
              >
                {block.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            );
          case 'code':
            return <CodeBlock key={i} language={block.language} code={block.code} />;
          case 'callout':
            return <Callout key={i} tone={block.tone} title={block.title} text={block.text} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
