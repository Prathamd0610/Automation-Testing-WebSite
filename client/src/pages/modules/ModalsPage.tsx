import { useState } from 'react';
import { Layers } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';

export default function ModalsPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmChoice, setConfirmChoice] = useState<string | null>(null);
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [modalResult, setModalResult] = useState<string | null>(null);

  const handleConfirm = (choice: 'confirmed' | 'cancelled') => {
    setConfirmChoice(choice);
    setConfirmOpen(false);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setModalResult(formName);
    setFormOpen(false);
    toast.success('Form submitted from modal');
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Layers className="h-5 w-5" />}
        title="Modals & Dialogs"
        description="Basic, confirm/cancel, nested and form-in-modal dialogs with automatic focus trapping."
      />

      <Section title="Modal variants" id="modals">
        <Card>
          <CardContent className="flex flex-wrap gap-3 pt-6">
            <Button onClick={() => setBasicOpen(true)} data-testid="open-basic-modal">
              Open basic modal
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(true)} data-testid="open-confirm-modal">
              Open confirm modal
            </Button>
            <Button variant="outline" onClick={() => setOuterOpen(true)} data-testid="open-nested">
              Open nested modal
            </Button>
            <Button variant="outline" onClick={() => setFormOpen(true)} data-testid="open-form-modal">
              Open form modal
            </Button>
          </CardContent>
        </Card>
      </Section>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResultPanel label="Confirm choice" value={confirmChoice} testId="confirm-choice" tone="success" />
        <ResultPanel label="Form result" value={modalResult} testId="modal-result" />
      </div>

      <Dialog open={basicOpen} onOpenChange={setBasicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Basic modal</DialogTitle>
            <DialogDescription>A simple dialog with a single dismiss action.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button data-testid="basic-modal-close">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>Choose an option to record your decision.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleConfirm('cancelled')} data-testid="confirm-no">
              No
            </Button>
            <Button onClick={() => handleConfirm('confirmed')} data-testid="confirm-yes">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={outerOpen} onOpenChange={setOuterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Outer modal</DialogTitle>
            <DialogDescription>This dialog can open another dialog on top of it.</DialogDescription>
          </DialogHeader>
          <Button onClick={() => setInnerOpen(true)} data-testid="nested-inner-open">
            Open inner modal
          </Button>
          <Dialog open={innerOpen} onOpenChange={setInnerOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inner modal</DialogTitle>
                <DialogDescription>The nested dialog stacked above its parent.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button data-testid="nested-inner-close">Close inner</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form modal</DialogTitle>
            <DialogDescription>Submit the form to send its value to the result panel.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="modal-form-name">Name</Label>
              <Input
                id="modal-form-name"
                data-testid="modal-form-name"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder="Your name"
              />
            </div>
            <DialogFooter>
              <Button type="submit" data-testid="modal-form-submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
