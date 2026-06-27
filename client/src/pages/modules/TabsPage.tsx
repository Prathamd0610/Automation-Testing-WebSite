import { useState } from 'react';
import { AppWindow, Package, Star, Truck } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TABS = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Package,
    body: 'A lightweight, durable backpack with a padded laptop sleeve and weatherproof zips.',
  },
  {
    id: 'shipping',
    label: 'Shipping',
    icon: Truck,
    body: 'Ships worldwide in 3–5 business days. Free express shipping on orders over $50.',
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: Star,
    body: 'Rated 4.8/5 across 1,240 verified reviews — praised for comfort and build quality.',
  },
];

export default function TabsPage() {
  const [active, setActive] = useState('overview');

  return (
    <PageContainer>
      <PageHeader
        icon={<AppWindow className="h-5 w-5" />}
        title="Tabs"
        description="A tabbed product panel — switch tabs, assert the active tab and verify that only the selected panel's content is visible."
      />

      <Section title="Product details" id="tabs" description="Only the active tab's panel is rendered visible.">
        <Card>
          <CardContent className="pt-6">
            <Tabs value={active} onValueChange={setActive} data-testid="product-tabs">
              <TabsList>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} data-testid={`tab-${tab.id}`}>
                    <tab.icon className="mr-1.5 h-4 w-4" aria-hidden="true" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {TABS.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} data-testid={`tabpanel-${tab.id}`}>
                  <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                    {tab.body}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        <ResultPanel label="Active tab" value={active} testId="tabs-active" tone="success" />
      </Section>
    </PageContainer>
  );
}
