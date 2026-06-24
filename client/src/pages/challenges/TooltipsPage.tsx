import { useState } from 'react';
import { HelpCircle, Info, Settings } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function TooltipsPage() {
  const [hovered, setHovered] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        icon={<Info className="h-5 w-5" />}
        title="Tooltips & Hovers"
        description="Radix tooltips on hover/focus plus an accessible hover-reveal card."
      />

      <TooltipProvider>
        <Section title="Tooltips" id="tooltips" description="Hover or keyboard-focus each trigger to reveal its tooltip.">
          <Card>
            <CardContent className="flex flex-wrap gap-3 pt-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" data-testid="tooltip-trigger-1">
                    Hover me
                  </Button>
                </TooltipTrigger>
                <TooltipContent data-testid="tooltip-content-1">A simple text tooltip.</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Help" data-testid="tooltip-trigger-2">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent data-testid="tooltip-content-2">Need help getting started?</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Settings" data-testid="tooltip-trigger-3">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent data-testid="tooltip-content-3">Open settings.</TooltipContent>
              </Tooltip>
            </CardContent>
          </Card>
        </Section>
      </TooltipProvider>

      <Section title="Hover-reveal card" id="hover" description="Hover or focus the card to reveal extra detail.">
        <Card>
          <CardContent className="pt-6">
            <div
              className="rounded-lg border border-input p-4 outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
              data-testid="hover-card"
              role="button"
              tabIndex={0}
              aria-expanded={hovered}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onFocus={() => setHovered(true)}
              onBlur={() => setHovered(false)}
            >
              <p className="text-sm font-medium text-foreground">Test plan</p>
              {hovered ? (
                <p className="mt-2 text-sm text-muted-foreground" data-testid="hover-card-content">
                  Covers smoke, regression and end-to-end suites across three browsers.
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Hover or focus to see the details.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
