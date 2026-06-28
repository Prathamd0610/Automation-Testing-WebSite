import { useRef, useState } from 'react';
import { Type, Bold, Italic, Underline, List, RotateCcw } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TOOLS = [
  { cmd: 'bold', label: 'Bold', icon: Bold },
  { cmd: 'italic', label: 'Italic', icon: Italic },
  { cmd: 'underline', label: 'Underline', icon: Underline },
  { cmd: 'insertUnorderedList', label: 'Bulleted list', icon: List },
] as const;

/**
 * Rich-text editor — a contenteditable surface with a formatting toolbar.
 * Editing a contenteditable (rather than an input/textarea) is a distinct
 * automation skill: you type into the element and assert on its innerHTML/text.
 */
export default function RichTextPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const exec = (cmd: string) => {
    editorRef.current?.focus();
    // execCommand is legacy but remains the simplest cross-browser rich-text API.
    document.execCommand(cmd, false);
    sync();
  };

  const sync = () => setCount((editorRef.current?.textContent ?? '').trim().length);

  const reset = () => {
    if (editorRef.current) editorRef.current.innerHTML = '';
    sync();
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Type className="h-5 w-5" />}
        title="Rich Text Editor"
        description="Type into the contenteditable area and apply formatting with the toolbar. Assert on the visible text or the rendered HTML."
      />

      <Section title="Editor" id="editor">
        <Card>
          <CardContent className="space-y-3 pt-4">
            <div className="flex flex-wrap gap-1" data-testid="rte-toolbar" role="toolbar" aria-label="Formatting">
              {TOOLS.map(({ cmd, label, icon: Icon }) => (
                <Button
                  key={cmd}
                  size="icon"
                  variant="outline"
                  className="h-9 w-9"
                  aria-label={label}
                  data-testid={`rte-${cmd}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => exec(cmd)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Button>
              ))}
              <Button size="icon" variant="outline" className="h-9 w-9" aria-label="Clear" data-testid="rte-clear" onClick={reset}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="Rich text content"
              data-testid="rte-editor"
              onInput={sync}
              className="min-h-[160px] rounded-lg border bg-background p-3 text-sm leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_ul]:list-disc [&_ul]:pl-6"
            >
              Select this text and try <b>Bold</b> or <i>Italic</i>.
            </div>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <ResultPanel label="Character count" value={count} testId="rte-count" tone="success" />
      </Section>
    </PageContainer>
  );
}
