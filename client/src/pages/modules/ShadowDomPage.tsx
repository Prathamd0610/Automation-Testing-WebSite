import { useEffect, useRef, useState } from 'react';
import { Boxes } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';

const SHADOW_TEMPLATE = `
  <style>
    .shadow-wrap {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(120, 120, 140, 0.25);
      background: rgba(120, 120, 140, 0.06);
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
    }
    #shadow-button {
      align-self: flex-start;
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: #2563eb;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
    }
    #shadow-button:hover { background: #1d4ed8; }
    #shadow-output { margin: 0; font-size: 14px; font-weight: 500; color: #111827; }
    #shadow-input {
      padding: 8px 12px;
      border: 1px solid rgba(120, 120, 140, 0.4);
      border-radius: 8px;
      font-size: 14px;
      background: #ffffff;
      color: #111827;
    }
  </style>
  <div class="shadow-wrap">
    <button id="shadow-button" type="button">Increment inside shadow</button>
    <p id="shadow-output">Clicks: 0</p>
    <input id="shadow-input" placeholder="Type inside the shadow DOM" />
  </div>
`;

export default function ShadowDomPage() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const attachedRef = useRef(false);
  const [count, setCount] = useState(0);
  const [mirroredValue, setMirroredValue] = useState('');

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    if (!attachedRef.current) {
      root.innerHTML = SHADOW_TEMPLATE;
      attachedRef.current = true;
    }

    const button = root.querySelector<HTMLButtonElement>('#shadow-button');
    const input = root.querySelector<HTMLInputElement>('#shadow-input');

    const handleClick = () => setCount((prev) => prev + 1);
    const handleInput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      setMirroredValue(target.value);
    };

    button?.addEventListener('click', handleClick);
    input?.addEventListener('input', handleInput);

    return () => {
      button?.removeEventListener('click', handleClick);
      input?.removeEventListener('input', handleInput);
    };
  }, []);

  useEffect(() => {
    const output = hostRef.current?.shadowRoot?.querySelector<HTMLParagraphElement>('#shadow-output');
    if (output) output.textContent = `Clicks: ${count}`;
  }, [count]);

  return (
    <PageContainer>
      <PageHeader
        icon={<Boxes className="h-5 w-5" />}
        title="Shadow DOM"
        description="Interact with elements encapsulated inside a shadow root that automation must pierce explicitly."
      />

      <Section
        title="Encapsulated component"
        id="shadow-host"
        description="The button, output and input below live inside a shadow root. Pierce the shadow boundary to reach #shadow-button, #shadow-output and #shadow-input."
      >
        <Card>
          <CardContent className="pt-6">
            <div data-testid="shadow-host" ref={hostRef} />
          </CardContent>
        </Card>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultPanel label="Shadow clicks (React)" value={count} testId="shadow-click-count" tone="success" />
        <ResultPanel label="Shadow input mirror (React)" value={mirroredValue} testId="shadow-react-mirror" />
      </div>
    </PageContainer>
  );
}
