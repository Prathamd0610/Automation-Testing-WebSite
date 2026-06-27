import { useRef, useState } from 'react';
import { ClipboardCopy, Check, Copy, RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

function randomToken(): string {
  return Array.from({ length: 24 }, () =>
    'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)],
  ).join('');
}

export default function ClipboardPage() {
  const [token, setToken] = useState(randomToken);
  const [copied, setCopied] = useState<string | null>(null);
  const [lastCopied, setLastCopied] = useState<string | null>(null);
  const [pasted, setPasted] = useState('');
  const fieldRef = useRef<HTMLInputElement>(null);

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setLastCopied(text);
      toast.success('Copied to clipboard');
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      toast.error('Clipboard not available — copy manually.');
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<ClipboardCopy className="h-5 w-5" />}
        title="Clipboard"
        description="Copy static text, copy a regenerating token from a field, and a paste target that captures what you paste."
      />

      <Section title="Copy to clipboard" id="copy" description="Each button writes its value to the system clipboard.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant={copied === 'static' ? 'success' : 'outline'}
                data-testid="copy-static"
                onClick={() => copy('hello-from-automation-lab', 'static')}
              >
                {copied === 'static' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy sample text
              </Button>
              <code className="rounded bg-muted px-2 py-1 text-xs" data-testid="copy-static-value">
                hello-from-automation-lab
              </code>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="copy-token">Access token</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  id="copy-token"
                  ref={fieldRef}
                  data-testid="copy-token"
                  readOnly
                  value={token}
                  className="max-w-xs font-mono"
                />
                <Button
                  type="button"
                  variant={copied === 'token' ? 'success' : 'default'}
                  data-testid="copy-token-button"
                  onClick={() => copy(token, 'token')}
                >
                  {copied === 'token' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  data-testid="regenerate-token"
                  onClick={() => {
                    setToken(randomToken());
                    setCopied(null);
                  }}
                >
                  <RefreshCw className="h-4 w-4" /> Regenerate
                </Button>
              </div>
            </div>

            <ResultPanel label="Last copied value" value={lastCopied} testId="last-copied" tone={lastCopied ? 'success' : 'default'} />
          </CardContent>
        </Card>
      </Section>

      <Section title="Paste target" id="paste" description="Paste anything here — the captured text appears below.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Textarea
              data-testid="paste-area"
              rows={3}
              placeholder="Paste here (Ctrl/Cmd+V)…"
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              onPaste={(e) => {
                const text = e.clipboardData.getData('text');
                if (text) toast.message('Pasted content captured');
              }}
            />
            <ResultPanel
              label="Pasted characters"
              value={pasted ? `${pasted.length} chars` : null}
              testId="paste-count"
            />
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
