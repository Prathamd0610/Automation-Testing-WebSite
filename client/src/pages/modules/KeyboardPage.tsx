import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface KeyInfo {
  key: string;
  code: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

function detectShortcut(event: KeyboardEvent): string | null {
  if (event.ctrlKey && event.key.toLowerCase() === 's') return 'Save (Ctrl+S)';
  if (event.ctrlKey && event.key === 'Enter') return 'Submit (Ctrl+Enter)';
  if (event.key === 'Escape') return 'Escape';
  return null;
}

export default function KeyboardPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [shortcut, setShortcut] = useState<string | null>(null);

  const [text, setText] = useState('');
  const [cpm, setCpm] = useState(0);
  const typingStart = useRef<number | null>(null);

  useEffect(() => {
    const node = inputRef.current;
    if (!node) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      setKeyInfo({
        key: event.key,
        code: event.code,
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey,
        meta: event.metaKey,
      });
      const matched = detectShortcut(event);
      if (matched) {
        if (event.ctrlKey && event.key.toLowerCase() === 's') event.preventDefault();
        setShortcut(matched);
      }
    };

    node.addEventListener('keydown', handleKeyDown);
    return () => node.removeEventListener('keydown', handleKeyDown);
  }, []);

  const modifiers = useMemo(() => {
    if (!keyInfo) return '';
    const flags: string[] = [];
    if (keyInfo.ctrl) flags.push('ctrl');
    if (keyInfo.alt) flags.push('alt');
    if (keyInfo.shift) flags.push('shift');
    if (keyInfo.meta) flags.push('meta');
    return flags.length ? flags.join('+') : 'none';
  }, [keyInfo]);

  const handleTyping = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setText(value);
    if (value.length === 0) {
      typingStart.current = null;
      setCpm(0);
      return;
    }
    if (typingStart.current === null) typingStart.current = performance.now();
    const elapsedMinutes = (performance.now() - typingStart.current) / 60000;
    setCpm(elapsedMinutes > 0 ? Math.round(value.length / elapsedMinutes) : 0);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Keyboard className="h-5 w-5" />}
        title="Keyboard Actions"
        description="Capture key events, detect named shortcuts and measure typing speed for keyboard-driven automation."
      />

      <Section title="Key capture" id="key-capture">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="key-input">Focus and press any key</Label>
              <Input
                id="key-input"
                ref={inputRef}
                data-testid="key-input"
                placeholder="Press keys here (try Ctrl+S, Ctrl+Enter, Escape)"
                aria-describedby="key-help"
              />
              <p id="key-help" className="text-xs text-muted-foreground">
                Modifier flags and the named shortcut update on every key down.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultPanel label="Last key" value={keyInfo?.key} testId="key-last" />
              <ResultPanel label="Key code" value={keyInfo?.code} testId="key-code" />
              <ResultPanel label="Modifiers" value={modifiers} testId="key-modifiers" />
            </div>
            <ResultPanel label="Shortcut detected" value={shortcut} testId="key-shortcut" tone="success" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Typing speed" id="typing-speed">
        <Card>
          <CardContent className="space-y-2 pt-6">
            <Label htmlFor="typing-area">Type to measure characters per minute</Label>
            <Textarea
              id="typing-area"
              data-testid="typing-area"
              value={text}
              onChange={handleTyping}
              placeholder="Start typing to begin measuring your speed…"
              rows={4}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <ResultPanel label="Characters typed" value={text.length} testId="typing-count" />
              <ResultPanel label="Chars / minute" value={cpm} testId="typing-cpm" tone="success" />
            </div>
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
