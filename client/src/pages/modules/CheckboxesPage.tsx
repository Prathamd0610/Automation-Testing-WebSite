import { useMemo, useState } from 'react';
import { ListChecks } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';

const HOBBIES = [
  { id: 'reading', label: 'Reading' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'hiking', label: 'Hiking' },
  { id: 'cooking', label: 'Cooking' },
] as const;

export default function CheckboxesPage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const allSelected = selectedHobbies.length === HOBBIES.length;
  const someSelected = selectedHobbies.length > 0 && !allSelected;
  const masterState: boolean | 'indeterminate' = allSelected ? true : someSelected ? 'indeterminate' : false;

  const toggleHobby = (id: string, checked: boolean) =>
    setSelectedHobbies((prev) => (checked ? [...prev, id] : prev.filter((item) => item !== id)));

  const toggleAll = (checked: boolean) =>
    setSelectedHobbies(checked ? HOBBIES.map((hobby) => hobby.id) : []);

  const resultValue = useMemo(
    () => `${selectedHobbies.length} selected · ${JSON.stringify(selectedHobbies)}`,
    [selectedHobbies],
  );

  const handleSubmit = () => {
    toast.success(`Form submitted with ${selectedHobbies.length} hobby selection(s).`);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<ListChecks className="h-5 w-5" />}
        title="Checkboxes"
        description="Single checkboxes, gated submits and a master checkbox with an indeterminate state."
      />

      <Section title="Terms & submission" id="terms" description="The submit button stays disabled until the terms are accepted.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-3">
              <Checkbox
                id="checkbox-terms"
                data-testid="checkbox-terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <Label htmlFor="checkbox-terms">I accept the terms and conditions</Label>
            </div>
            <Button type="button" data-testid="checkbox-submit" disabled={!termsAccepted} onClick={handleSubmit}>
              Submit
            </Button>
          </CardContent>
        </Card>
      </Section>

      <Section title="Hobby group" id="hobbies" description="The master checkbox reflects partial selection as indeterminate.">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Checkbox
                id="checkbox-select-all"
                data-testid="checkbox-select-all"
                checked={masterState}
                onCheckedChange={(checked) => toggleAll(checked === true)}
              />
              <Label htmlFor="checkbox-select-all" className="font-semibold">
                Select all
              </Label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {HOBBIES.map((hobby) => {
                const checked = selectedHobbies.includes(hobby.id);
                return (
                  <div key={hobby.id} className="flex items-center gap-3">
                    <Checkbox
                      id={`checkbox-hobby-${hobby.id}`}
                      data-testid={`checkbox-hobby-${hobby.id}`}
                      checked={checked}
                      onCheckedChange={(value) => toggleHobby(hobby.id, value === true)}
                    />
                    <Label htmlFor={`checkbox-hobby-${hobby.id}`}>{hobby.label}</Label>
                  </div>
                );
              })}
            </div>
            <ResultPanel label="Selection state" value={resultValue} testId="checkbox-result" tone="success" />
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
