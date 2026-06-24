import { Layers } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';

function escapeHtmlAttribute(html: string): string {
  return html.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

const INNER_DOC = `<!doctype html>
<html lang='en'>
  <head>
    <meta charset='utf-8' />
    <style>
      body { margin: 0; padding: 16px; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #111827; }
      h3 { margin: 0 0 8px; font-size: 15px; }
      button { padding: 8px 16px; border: none; border-radius: 8px; background: #16a34a; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }
      #inner-frame-output { margin-top: 12px; font-size: 14px; font-weight: 500; }
    </style>
  </head>
  <body>
    <h3>Inner frame</h3>
    <button id='inner-frame-button' type='button'>Click the inner button</button>
    <p id='inner-frame-output'>Inner button not clicked yet</p>
    <script>
      var count = 0;
      var output = document.getElementById('inner-frame-output');
      document.getElementById('inner-frame-button').addEventListener('click', function () {
        count += 1;
        output.textContent = 'Inner button clicked ' + count + ' time(s)';
      });
    </script>
  </body>
</html>`;

const OUTER_DOC = `<!doctype html>
<html lang='en'>
  <head>
    <meta charset='utf-8' />
    <style>
      body { margin: 0; padding: 16px; font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #111827; }
      h2 { margin: 0 0 8px; font-size: 16px; }
      p { font-size: 14px; }
      iframe { width: 100%; height: 220px; border: 1px solid #d1d5db; border-radius: 8px; margin-top: 12px; }
    </style>
  </head>
  <body>
    <h2 id='outer-frame-heading'>Outer frame</h2>
    <p>This outer document embeds another iframe below, creating a nested frame hierarchy.</p>
    <iframe title='Inner frame' srcdoc="${escapeHtmlAttribute(INNER_DOC)}"></iframe>
  </body>
</html>`;

export default function NestedFramesPage() {
  return (
    <PageContainer>
      <PageHeader
        icon={<Layers className="h-5 w-5" />}
        title="Nested Frames"
        description="Drill through a frame inside a frame, switching context at each level before reaching the inner controls."
      />

      <Section
        title="Frame within a frame"
        id="nested-frames"
        description="The outer iframe contains an inner iframe. Switch into the outer frame, then into the inner frame to reach #inner-frame-button and #inner-frame-output."
      >
        <Card>
          <CardContent className="pt-6">
            <iframe
              data-testid="outer-iframe"
              title="Outer frame"
              srcDoc={OUTER_DOC}
              className="h-80 w-full rounded-lg border border-input bg-background"
            />
          </CardContent>
        </Card>
      </Section>

      <p className="text-sm text-muted-foreground" data-testid="nested-frame-note">
        Guidance: nested frames require switching context one level at a time. Enter the outer frame first
        (<code className="mx-1 rounded bg-muted px-1 py-0.5 font-mono text-xs">#outer-frame-heading</code>), then switch
        into the inner frame before locating its button and output.
      </p>
    </PageContainer>
  );
}
