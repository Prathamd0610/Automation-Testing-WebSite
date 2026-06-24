import { useMemo, useState } from 'react';
import { ListFilter } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const BROWSERS = ['Chrome', 'Firefox', 'Edge', 'Safari', 'Opera'] as const;

const COUNTRIES = ['United States', 'India', 'Canada', 'United Kingdom', 'Australia'] as const;

const FRAMEWORKS = [
  { id: 'selenium', label: 'Selenium' },
  { id: 'cypress', label: 'Cypress' },
  { id: 'playwright', label: 'Playwright' },
  { id: 'webdriverio', label: 'WebdriverIO' },
  { id: 'puppeteer', label: 'Puppeteer' },
] as const;

const STATES_BY_COUNTRY: Record<string, string[]> = {
  USA: ['California', 'Texas', 'New York', 'Florida'],
  India: ['Maharashtra', 'Karnataka', 'Delhi', 'Tamil Nadu'],
  Canada: ['Ontario', 'Quebec', 'British Columbia'],
};

const DEPENDENT_COUNTRIES = Object.keys(STATES_BY_COUNTRY);

export default function DropdownsPage() {
  const [nativeValue, setNativeValue] = useState('Chrome');
  const [country, setCountry] = useState('');
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [depCountry, setDepCountry] = useState('');
  const [depState, setDepState] = useState('');

  const availableStates = STATES_BY_COUNTRY[depCountry] ?? [];

  const toggleFramework = (id: string, checked: boolean) =>
    setFrameworks((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));

  const selectedFrameworkLabels = useMemo(
    () => FRAMEWORKS.filter((framework) => frameworks.includes(framework.id)).map((framework) => framework.label),
    [frameworks],
  );

  return (
    <PageContainer>
      <PageHeader
        icon={<ListFilter className="h-5 w-5" />}
        title="Dropdowns & Selects"
        description="Native selects, custom Radix selects, multi-select groups and dependent (cascading) dropdowns."
      />

      <Section title="Native select" id="native">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Label htmlFor="native-select">Preferred browser</Label>
            <select
              id="native-select"
              data-testid="native-select"
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              value={nativeValue}
              onChange={(event) => setNativeValue(event.target.value)}
            >
              {BROWSERS.map((browser) => (
                <option key={browser} value={browser}>
                  {browser}
                </option>
              ))}
            </select>
            <ResultPanel label="Native selection" value={nativeValue} testId="native-result" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Custom select" id="custom" description="A Radix-powered single-select of countries.">
        <Card>
          <CardContent className="space-y-3 pt-6">
            <Label htmlFor="custom-select-trigger">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="custom-select-trigger" data-testid="custom-select-trigger">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ResultPanel label="Custom selection" value={country} testId="custom-result" tone="success" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Multi-select" id="multi" description="Toggle checkboxes to build an array of values.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div data-testid="multi-select" className="grid gap-3 sm:grid-cols-2">
              {FRAMEWORKS.map((framework) => {
                const checked = frameworks.includes(framework.id);
                return (
                  <Label
                    key={framework.id}
                    htmlFor={`multi-${framework.id}`}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-input p-3 font-normal"
                  >
                    <Checkbox
                      id={`multi-${framework.id}`}
                      data-testid={`multi-option-${framework.id}`}
                      checked={checked}
                      onCheckedChange={(value) => toggleFramework(framework.id, value === true)}
                    />
                    <span>{framework.label}</span>
                  </Label>
                );
              })}
            </div>
            <ResultPanel
              label="Selected frameworks"
              value={selectedFrameworkLabels.length ? JSON.stringify(selectedFrameworkLabels) : null}
              testId="multi-result"
            />
          </CardContent>
        </Card>
      </Section>

      <Section
        title="Dependent dropdowns"
        id="dependent"
        description="Selecting a country repopulates and resets the state list."
      >
        <Card>
          <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="country-select-trigger">Country</Label>
              <Select
                value={depCountry}
                onValueChange={(value) => {
                  setDepCountry(value);
                  setDepState('');
                }}
              >
                <SelectTrigger id="country-select-trigger" data-testid="country-select-trigger">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {DEPENDENT_COUNTRIES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="state-select-trigger">State / Province</Label>
              <Select value={depState} onValueChange={setDepState} disabled={!depCountry}>
                <SelectTrigger id="state-select-trigger" data-testid="state-select-trigger">
                  <SelectValue placeholder={depCountry ? 'Select a state' : 'Select a country first'} />
                </SelectTrigger>
                <SelectContent>
                  {availableStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <ResultPanel
              className="sm:col-span-2"
              label="Dependent selection"
              value={depCountry ? `${depCountry}${depState ? ` → ${depState}` : ''}` : null}
              testId="dependent-result"
              tone="success"
            />
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
