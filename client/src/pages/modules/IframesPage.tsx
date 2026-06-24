import { Frame } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';

function buildFrameDoc(heading: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; padding: 16px; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #111827; }
      h2 { margin: 0 0 8px; font-size: 16px; }
      p { font-size: 14px; }
      form { display: flex; gap: 8px; margin: 12px 0; }
      input { flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }
      button { padding: 8px 16px; border: none; border-radius: 8px; background: #2563eb; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }
      #iframe-output { font-weight: 500; }
    </style>
  </head>
  <body>
    <h2 id="iframe-heading">${heading}</h2>
    <p>This content is rendered inside an isolated iframe document.</p>
    <form id="iframe-form">
      <input id="iframe-input" placeholder="Type a message" />
      <button id="iframe-submit" type="submit">Send</button>
    </form>
    <p id="iframe-output">Awaiting input…</p>
    <script>
      var form = document.getElementById('iframe-form');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var value = document.getElementById('iframe-input').value;
        document.getElementById('iframe-output').textContent = value ? 'You typed: ' + value : 'Empty submission';
      });
    </script>
  </body>
</html>`;
}

export default function IframesPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={<Frame className="h-5 w-5" />}
        title="iFrames"
        description="Practise switching into same-origin iframe contexts before locating elements inside each frame."
      />

      <Section
        title="Same-origin frames"
        id="iframes"
        description="Each frame is a self-contained document rendered via srcDoc. Switch the driver's frame context before interacting with #iframe-input or #iframe-submit."
      >
        <Card>
          <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Frame one</p>
              <iframe
                data-testid="iframe-one"
                title="Practice iframe one"
                srcDoc={buildFrameDoc('Frame One')}
                className="h-64 w-full rounded-lg border border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Frame two</p>
              <iframe
                data-testid="iframe-two"
                title="Practice iframe two"
                srcDoc={buildFrameDoc('Frame Two')}
                className="h-64 w-full rounded-lg border border-input bg-background"
              />
            </div>
          </CardContent>
        </Card>
      </Section>

      <p className="text-sm text-muted-foreground" data-testid="iframe-note">
        Note: elements inside an iframe live in a separate document. Testers must switch frame context (for example
        <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">driver.switchTo().frame(...)</code>)
        before locating <code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">#iframe-heading</code> or
        the form controls.
      </p>
    </PageContainer>
  );
}
