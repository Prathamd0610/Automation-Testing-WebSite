import { useState } from 'react';
import { ListCollapse } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const FAQ = [
  { id: 'what', q: 'What is this playground for?', a: 'A safe sandbox of real UI controls with stable data-testid hooks for practising automation.' },
  { id: 'tools', q: 'Which tools does it support?', a: 'Anything that drives a browser — Selenium, Cypress and Playwright all work here.' },
  { id: 'auth', q: 'Do I need an account?', a: 'Most practice modules are public. Learning courses and workflows require signing in.' },
];

const PANELS = [
  { id: 'shipping', title: 'Shipping', body: 'Standard delivery in 3–5 business days. Express options available at checkout.' },
  { id: 'returns', title: 'Returns', body: 'Free returns within 30 days. Items must be unused and in original packaging.' },
  { id: 'warranty', title: 'Warranty', body: 'All products include a 12-month limited warranty against manufacturing defects.' },
];

export default function AccordionPage() {
  const [single, setSingle] = useState<string>('');
  const [multiple, setMultiple] = useState<string[]>([]);

  return (
    <PageContainer>
      <PageHeader
        icon={<ListCollapse className="h-5 w-5" />}
        title="Accordion"
        description="A single-open FAQ accordion and a multi-open panel group — practise expanding, collapsing and asserting visible content."
      />

      <Section title="Single open (FAQ)" id="single" description="Opening one item closes the others.">
        <Card>
          <CardContent className="pt-2">
            <Accordion
              type="single"
              collapsible
              value={single}
              onValueChange={setSingle}
              data-testid="faq-accordion"
            >
              {FAQ.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger data-testid={`faq-trigger-${item.id}`}>{item.q}</AccordionTrigger>
                  <AccordionContent data-testid={`faq-content-${item.id}`}>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        <ResultPanel label="Open FAQ item" value={single || null} testId="faq-open" />
      </Section>

      <Section title="Multiple open" id="multiple" description="Several panels can stay open at once.">
        <Card>
          <CardContent className="pt-2">
            <Accordion
              type="multiple"
              value={multiple}
              onValueChange={setMultiple}
              data-testid="panels-accordion"
            >
              {PANELS.map((panel) => (
                <AccordionItem key={panel.id} value={panel.id}>
                  <AccordionTrigger data-testid={`panel-trigger-${panel.id}`}>{panel.title}</AccordionTrigger>
                  <AccordionContent data-testid={`panel-content-${panel.id}`}>{panel.body}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        <ResultPanel
          label="Open panels"
          value={multiple.length ? `${multiple.length} · ${JSON.stringify(multiple)}` : null}
          testId="panels-open"
          tone={multiple.length ? 'success' : 'default'}
        />
      </Section>
    </PageContainer>
  );
}
